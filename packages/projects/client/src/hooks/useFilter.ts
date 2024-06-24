import { useEffect, useMemo, useState } from 'react';

export default function useFilter<T>(data: T[]) {
    const [filtered, setFiltered] = useState<T[]>(data);

    useEffect(() => { setFiltered(data); }, [data]);

    function filter(fn: (data: T) => boolean) { setFiltered(data.filter(fn)); }

    function reset() {
        console.log('reset', data);
        setFiltered(data);
    }

    return useMemo(() => ({ filtered, filter, reset }), [data, filtered]);
}