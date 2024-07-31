import { useContext } from 'react';

import { DragAndDropContext } from './DragAndDropProvider';

export default function useDragAndDrop() {
    const { valueOfDraggedElement } = useContext(DragAndDropContext);

    return { valueOfDraggedElement };
}