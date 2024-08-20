import { useState } from 'react';

export default function useMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };
    const handleClose = () => { setAnchorEl(null); };

    const handleToggle = (event?: React.MouseEvent<HTMLElement>) => {
        !open && event ? handleOpen(event) : handleClose();
    };

    return {
        open,
        anchorEl,
        handleOpen,
        handleClose,
        handleToggle
    };
}