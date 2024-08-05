import React, { DragEvent, useContext, useRef } from 'react';

import { DragAndDropContext } from './DragAndDropProvider';

import './DragAndDrop.scss';

interface DraggableProps { data: any; children: React.ReactNode; }
export default function Draggable({ data, children }: DraggableProps) {
    const { setValueOfDraggedElement, setDraggedElement } = useContext(DragAndDropContext);

    const startDrag = (e: DragEvent<HTMLElement>) => {
        setValueOfDraggedElement(data);

        const dragEle = e.target;

        setDraggedElement(dragEle);

        dragEle['classList'].add('dragging');
    };

    const endDrag = (e: React.DragEvent<HTMLElement>) => {
        setValueOfDraggedElement(undefined);

        const dragEle = e.target;

        dragEle['classList'].remove('dragging');
    };

    return (
        <article draggable="true" className="draggable" onDragStart={startDrag} onDragEnd={endDrag}>
            {children}
        </article>
    );
}