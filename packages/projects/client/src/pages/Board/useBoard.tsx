import { useContext } from 'react';

import { BoardContext } from './BoardProvider';

export default function useBoard() {
    return useContext(BoardContext);
}