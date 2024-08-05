import { useState } from 'react';

export default function useModal(): [boolean, () => void] {
    const [open, setOpen] = useState(false);

    const toggle = () => { setOpen(prev => !prev); };

    return [open, toggle];
}