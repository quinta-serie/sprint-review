import type { Firestore, DocumentData, WithFieldValue, WhereFilterOp } from 'firebase/firestore';
import { doc, setDoc, query, collection, where, onSnapshot, getDocs } from 'firebase/firestore';

type Field = WithFieldValue<DocumentData>;

type ArrayOrObject<T> = T extends Array<infer U> ? U : T;

type CollectionData<
    F extends Field,
    T extends ArrayOrObject<F> = ArrayOrObject<F>,
    K extends keyof T = keyof T,
> = {
    data: F;
    path: string;
    pathSegments: string[];
    filters: Array<{
        field: K;
        operator: WhereFilterOp;
        value: T[K] extends Array<infer V> ? V : T[K];
    }>;
};

export default class DB {
    constructor(private db: Firestore) { }

    public async setItem<F extends Field>({ path, data, pathSegments }: Omit<CollectionData<F>, 'filters'>) {
        const ref = doc(this.db, path, ...pathSegments);

        return setDoc(ref, data);
    }

    public async getItem<F extends Field>({ path, filters, pathSegments }: Omit<CollectionData<F>, 'data'>) {
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

    public async getList<F extends Field>({ path, filters, pathSegments }: Omit<CollectionData<F>, 'data'>) {
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
        { path, pathSegments }: Omit<CollectionData<F>, 'data'>,
        callback: (data: F) => void
    ) {
        return onSnapshot(
            doc(this.db, path, ...pathSegments),
            (doc) => { callback(doc.data() as F); }
        );
    }
}