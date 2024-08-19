import type { Firestore, DocumentData, WithFieldValue, WhereFilterOp, Transaction } from 'firebase/firestore';
import {
    doc,
    query,
    where,
    setDoc,
    getDocs,
    updateDoc,
    collection,
    onSnapshot,
    arrayUnion,
    runTransaction
} from 'firebase/firestore';

import { Path, PathValue, ArrayOrObject } from '@/utils/interface';

type Field = WithFieldValue<DocumentData>;

type CollectionData<
    F extends Field,
    S extends F[keyof F] = F[keyof F],
    T extends ArrayOrObject<F> = ArrayOrObject<F>,
    K extends keyof T = keyof T,
> = {
    data: F;
    path: string;
    pathSegments: string[];
    pathData: Path<S>;
    callback: (data: S) => Partial<{
        [P in Path<S>]: PathValue<S, P>;
    }>;
    filters: Array<{
        field: K;
        operator: WhereFilterOp;
        value: T[K] extends Array<infer V> ? V : T[K];
    }>;
};

type CollectionWithData<F extends Field> = Omit<CollectionData<F>, 'filters' | 'pathData' | 'callback'>;
type CollectionWithFilters<F extends Field> = Omit<CollectionData<F>, 'data' | 'pathData' | 'callback'>;
type CollectionWithOnlyPaths<F extends Field> = Omit<CollectionData<F>, 'data' | 'filters' | 'pathData' | 'callback'>;
type CollectionWithPathData<F extends Field, S extends F[keyof F]> = Omit<CollectionData<F, S>, 'filters' | 'callback'>;
type CollectionWithCallback<F extends Field, S extends F[keyof F]> = Omit<CollectionData<F, S>,
    'data' | 'filters' | 'pathData'
>;

export default class DB {
    constructor(private db: Firestore) { }

    public async setItem<F extends Field>({ path, data, pathSegments }: CollectionWithData<F>) {
        const ref = doc(this.db, path, ...pathSegments);

        return setDoc(ref, data);
    }

    public async insert<F extends Field, Segment extends F[keyof F]>({
        path,
        data,
        pathData,
        pathSegments,
    }: CollectionWithPathData<F, Segment>) {
        const ref = doc(this.db, path, ...pathSegments);

        updateDoc(ref, {
            [pathData]: arrayUnion(data)
        });
    }

    public async getItem<F extends Field>({ path, filters, pathSegments }: CollectionWithFilters<F>) {
        const q = query(
            collection(this.db, path, ...pathSegments),
            ...filters.map(({ field, operator, value }) => where(field as string, operator, value))
        );

        return getDocs(q)
            .then((querySnapshot) => {
                const result = querySnapshot.docs.map((doc) => doc.data() as F);
                return result ? result[0] : null;
            });
    }

    public async getList<F extends Field>({ path, filters, pathSegments }: CollectionWithFilters<F>) {
        const q = query(
            collection(this.db, path, ...pathSegments),
            ...filters.map(({ field, operator, value }) => where(field as string, operator, value))
        );

        return getDocs(q)
            .then((querySnapshot) => {
                return querySnapshot.docs.map<F>((doc) => doc.data() as F);
            });
    }

    public async transaction<F extends Field>() {
        const getRef = ({ path, pathSegments }: CollectionWithOnlyPaths<F>) => doc(this.db, path, ...pathSegments);

        const transaction = async (callback: (t: Transaction) => void) => {
            return await runTransaction(this.db, async (transaction) => {
                return callback(transaction);
            });
        };

        return { getRef, transaction };
    }

    public subscription<F extends Field>(
        { path, pathSegments, filters }: CollectionWithFilters<F>,
        callback: (data: F) => void
    ) {
        const q = query(
            collection(this.db, path, ...pathSegments),
            ...filters.map(({ field, operator, value }) => where(field as string, operator, value))
        );

        return onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                callback(change.doc.data() as F);
            });
        });
    }
}