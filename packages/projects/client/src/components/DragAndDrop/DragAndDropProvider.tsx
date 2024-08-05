
import React, { useMemo, useState, createContext } from 'react';

export interface DragAndDropContextData {
    valueOfDraggedElement: any;
    setValueOfDraggedElement: (element: any) => void;

    draggedElement?: EventTarget;
    setDraggedElement: (element: EventTarget) => void;

    ghostElement?: EventTarget;
    setGhostElement: (element: EventTarget) => void;
}

export const DragAndDropContext = createContext<DragAndDropContextData>({
    valueOfDraggedElement: false,
    setValueOfDraggedElement: () => null,

    draggedElement: undefined,
    setDraggedElement: () => null,

    ghostElement: undefined,
    setGhostElement: () => null
});

interface DragAndDropProviderProps { children: React.ReactNode; }
export default function DragAndDropProvider({ children }: DragAndDropProviderProps) {
    const [valueOfDraggedElement, setValueOfDraggedElement] = useState();
    const [draggedElement, setDraggedElement] = useState<EventTarget>();
    const [ghostElement, setGhostElement] = useState<EventTarget>();

    const context: DragAndDropContextData = useMemo(() => ({
        valueOfDraggedElement,
        setValueOfDraggedElement: (data) => setValueOfDraggedElement(data),

        draggedElement,
        setDraggedElement: (data) => setDraggedElement(data),

        ghostElement,
        setGhostElement: (data) => setGhostElement(data)
    }), [valueOfDraggedElement, draggedElement]);

    return (
        <DragAndDropContext.Provider value={context}>
            {children}
        </DragAndDropContext.Provider>
    );
}