import DB from '@/services/db';
import { uuid } from '@/utils/uuid';
import { slug } from '@/utils/string';

import type { BoardData, CardData } from './interface';

type MethodPattern = { card: CardData; boardId: string; column: string; }

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

    async createTeamBoard(
        data: Omit<BoardData, 'id' | 'createdAt' | 'status'>
    ): Promise<BoardData> {
        const id = uuid();
        const status = 'active';
        const createdAt = new Date().toISOString();
        const cards = Object.fromEntries(data.template.columns.map(column => [slug(column), []]));

        return this.db.setItem<BoardData>({
            path: Board.PATH,
            pathSegments: [id],
            data: { ...data, id, createdAt, status, cards },
        }).then(() => ({ ...data, id, createdAt, status, cards }));
    }

    async updateBoard(data: BoardData): Promise<void> {
        return this.db.setItem<BoardData>({
            data,
            path: Board.PATH,
            pathSegments: [data.id],
        });
    }

    async updateBoardColumn(
        { column, boardId }: Omit<MethodPattern, 'card'>,
        callback: (b: BoardData) => CardData[]
    ): Promise<void> {
        const { getRef, transaction } = await this.db.transaction1<CardData>();

        const columnRef = getRef({ path: Board.PATH, pathSegments: [boardId] });

        return transaction(async (t) => {
            const snap = await t.get(columnRef);

            if (!snap.exists()) { throw new Error('Column not found!'); }

            const currentCards = snap.data() as BoardData;

            const result = callback(currentCards);

            t.update(columnRef, {
                [`cards.${column}`]: result,
            });
        });
    }

    async updateBoardMultipleColumns(
        { targetColumn, originColumn, boardId }: { targetColumn: string; originColumn: string; boardId: string },
        callback: (b: BoardData) => { updatedOriginColumn: CardData[], updatedTargetColumn: CardData[] }
    ): Promise<void> {
        const { getRef, transaction } = await this.db.transaction1<CardData>();

        const boardRef = getRef({ path: Board.PATH, pathSegments: [boardId] });

        return transaction(async (t) => {
            const snap = await t.get(boardRef);

            if (!snap.exists()) { throw new Error('Column not found!'); }

            const currentCards = snap.data() as BoardData;

            const { updatedOriginColumn, updatedTargetColumn } = callback(currentCards);

            t.update(boardRef, {
                [`cards.${targetColumn}`]: updatedTargetColumn,
                [`cards.${originColumn}`]: updatedOriginColumn,
            });
        });
    }

    async insertCard(boardId: string, data: CardData) {
        return this.db.insert<CardData, BoardData>({
            data,
            path: Board.PATH,
            pathSegments: [boardId],
            pathData: `cards.${slug(data.column)}`,
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