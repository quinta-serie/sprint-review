import DB from '@/services/db';
import { uuid } from '@/utils/uuid';

import { type BoardData } from './interface';

export default class Board {
    private static PATH = 'boards';

    constructor(private db: DB) { }

    getTeamBoards(teamId: string) {
        return this.db.getList<BoardData>({
            path: Board.PATH,
            pathSegments: [],
            filters: [{ field: 'teamId', operator: '==', value: teamId }],
        });
    }

    getBoard(boardId: string) {
        return this.db.getItem<BoardData>({
            path: Board.PATH,
            pathSegments: [],
            filters: [{ field: 'id', operator: '==', value: boardId }],
        });
    }

    async createTeamBoard(data: Omit<BoardData, 'id' | 'createdAt' | 'status'>): Promise<BoardData> {
        const id = uuid();
        const status = 'active';
        const createdAt = new Date().toISOString();

        return this.db.setItem<BoardData>({
            path: Board.PATH,
            pathSegments: [id],
            data: { ...data, id, createdAt, status },
        }).then(() => ({ ...data, id, createdAt, status }));
    }

    async updateBoard(data: BoardData): Promise<void> {
        return this.db.setItem<BoardData>({
            data,
            path: Board.PATH,
            pathSegments: [data.id],
        });
    }

    subscription(boardId: string, callback: (data: BoardData) => void) {
        return this.db.subscription<BoardData>({
            path: Board.PATH,
            pathSegments: [],
            filters: [
                { field: 'id', operator: '==', value: boardId },
                { field: 'status', operator: '==', value: 'active' }
            ],
        }, callback);
    }
}