import { useEffect, useMemo, useState } from 'react';

export default function useFilter<T>(data: T[], initialFilter?: (data: T) => boolean) {
    const [filtered, setFiltered] = useState<T[]>(data);

    useEffect(() => {
        if (initialFilter) {
            setFiltered(data.filter(initialFilter));
        } else {
            setFiltered(data);
        }
    }, [data]);

    function filter(fn: (data: T) => boolean) { setFiltered(data.filter(fn)); }

    function reset() { setFiltered(data); }

    return useMemo(() => ({ filtered, filter, reset }), [data, filtered]);
}