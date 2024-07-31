import React, { useContext } from 'react';

import { DragAndDropContext } from './DragAndDropProvider';

interface IProps {
    children: React.ReactNode;
    onDrop: (draggedElement?: EventTarget, ghostElement?: EventTarget) => void;
    onDragOver?: (draggedElement?: EventTarget, ghostElement?: EventTarget) => void;
}

export default function Droppable({ children, onDrop, onDragOver }: IProps) {
    const { draggedElement } = useContext(DragAndDropContext);

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();

        const targetElement = e.target;

        onDrop(draggedElement, targetElement);
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();

        const targetElement = e.target;

        onDragOver && onDragOver(draggedElement, targetElement);
    }

    return (
        <div onDrop={handleDrop} onDragOver={handleDragOver}>
            {children}
        </div>
    );
}