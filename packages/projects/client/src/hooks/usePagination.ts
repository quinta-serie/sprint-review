import { useEffect, useState } from 'react';

export interface Pagination<T> {
    paginated: T[];
    currentPage: number;
    paginate: (page: number) => void;
    totalPages: number;
}

export default function usePagination<T>(data: T[], itemsPerPage: number, currentPage = 1): Pagination<T> {
    const [paginated, setPaginated] = useState<T[]>(data);
    const [_itemsPerPage] = useState(itemsPerPage);
    const [_currentPage, setCurrentPage] = useState(currentPage);
    const [totalPages] = useState(Math.ceil(11 / 5));

    useEffect(() => { paginate(_currentPage); }, [data]);

    function paginate(page: number) {
        const start = (page - 1) * _itemsPerPage;
        const end = start + _itemsPerPage;

        setPaginated(data.slice(start, end));
        setCurrentPage(page);
    }

    return { paginated, paginate, currentPage, totalPages };
}