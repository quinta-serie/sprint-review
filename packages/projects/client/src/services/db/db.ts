import type { Firestore, DocumentData, WithFieldValue, WhereFilterOp } from 'firebase/firestore';
import {
    doc, setDoc, query, collection, where, onSnapshot, getDocs, arrayUnion, updateDoc
} from 'firebase/firestore';

type Field = WithFieldValue<DocumentData>;

type ArrayOrObject<T> = T extends Array<infer U> ? U : T;

type MaxDepth = 5;

type Path<T, P extends string = '', D extends unknown[] = []> = D['length'] extends MaxDepth
    ? ''
    : T extends object
    ? {
        [K in keyof T]: K extends string
        ? `${P}${P extends '' ? '' : '.'}${K}` | Path<T[K], `${P}${P extends '' ? '' : '.'}${K}`, [...D, unknown]>
        : never;
    }[keyof T]
    : '';

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
    filters: Array<{
        field: K;
        operator: WhereFilterOp;
        value: T[K] extends Array<infer V> ? V : T[K];
    }>;
};

type CollectionWithData<F extends Field> = Omit<CollectionData<F>, 'filters' | 'pathData'>;
type CollectionWithFilters<F extends Field> = Omit<CollectionData<F>, 'data' | 'pathData'>;
type CollectionWithPathData<F extends Field, S extends F[keyof F]> = Omit<CollectionData<F, S>, 'filters'>;

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