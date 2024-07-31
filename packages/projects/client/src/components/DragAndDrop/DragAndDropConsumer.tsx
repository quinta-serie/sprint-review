import { DragAndDropContext, DragAndDropContextData } from './DragAndDropProvider';

interface DragAndDropConsumerProps { children: (data: DragAndDropContextData) => React.JSX.Element; }
export default function DragAndDropConsumer({ children }: DragAndDropConsumerProps) {
    return (
        <DragAndDropContext.Consumer>
            {children}
        </DragAndDropContext.Consumer>
    );
}