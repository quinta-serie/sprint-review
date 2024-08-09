import { createContext, useMemo, useState } from 'react';

import { slug } from '@/utils/string';
import { wait } from '@/utils/promise';
import { deepCopy } from '@/utils/object';
import { defaultTemplate } from '@/services/template';
import { boardServices, COLORS, userServices } from '@/services/core';
import type { BoardData, BoardDataConfig, CardData } from '@/services/board';

type FavoriteCardData = { id: string; column: string };

interface BoardContextConfig {
    board: BoardData;
    loading: boolean;
    isOwner: boolean;
    removeTimer: () => Promise<void>;
    addCard: (card: CardData) => Promise<void>;
    deleteCard: (cardId: string, columCard: string) => Promise<void>;
    getBoardDetails: (boardId: string) => Promise<void>;
    loadBoard: (fn: (data: BoardData) => BoardData) => void;
    mergeCards: (origin: CardData, target: CardData) => void;
    favoriteCard: (dataCard: FavoriteCardData) => Promise<void>;
    unFavoriteCard: (dataCard: FavoriteCardData) => Promise<void>;
    updateTemplateConfig: (template: BoardDataConfig) => Promise<void>;
    editCardText: (cardId: string, cardColumn: string, text: string) => Promise<void>;
    changeCardPosition: (originCard: CardData, position: number, column: string) => void;
}

const defaultBoard: BoardData = {
    id: '',
    name: '',
    teamId: '',
    ownerId: '',
    createdAt: '',
    timer: { isRunning: false },
    description: '',
    status: 'active',
    cards: {},
    template: defaultTemplate('')
};

export const BoardContext = createContext<BoardContextConfig>({
    board: defaultBoard,
    loading: false,
    isOwner: false,
    mergeCards: () => null,
    loadBoard: () => defaultBoard,
    changeCardPosition: () => null,
    addCard: () => new Promise(() => null),
    deleteCard: () => new Promise(() => null),
    removeTimer: () => new Promise(() => null),
    favoriteCard: () => new Promise(() => null),
    editCardText: () => new Promise(() => null),
    unFavoriteCard: () => new Promise(() => null),
    updateTemplateConfig: () => new Promise(() => null),
    getBoardDetails: async () => new Promise(() => null),
});

interface BoardProviderProps { children: React.JSX.Element; }
export default function BoardProvider({ children }: BoardProviderProps) {
    const [board, setBoard] = useState<BoardData>(defaultBoard);
    const [loading, setLoading] = useState(true);

    const { email, user_id } = userServices.current;

    const context = useMemo<BoardContextConfig>(() => ({
        loading,
        board,
        isOwner: board.ownerId === user_id,
        addCard: (card) => addCard(card),
        removeTimer: () => removeTimer(),
        loadBoard: (fn) => setBoard(prev => fn(prev)),
        getBoardDetails: (boardId) => getBoardDetails(boardId),
        mergeCards: (origin, target) => mergeCards(origin, target),
        favoriteCard: ({ id, column }) => favoriteCard({ id, column }),
        deleteCard: (cardId, columCard) => deleteCard(cardId, columCard),
        unFavoriteCard: ({ id, column }) => unFavoriteCard({ id, column }),
        updateTemplateConfig: (template) => updateTemplateConfig(template),
        editCardText: (cardId, cardColumn, text) => editCardText(cardId, cardColumn, text),
        changeCardPosition: (cardId, position, column) => changeCardPosition(cardId, position, column),
    }), [board, loading]);

    const getBoardDetails = async (boardId: string) => {
        boardServices.getBoard(boardId)
            .then((data) => setBoard(data as BoardData))
            .finally(() => wait(() => setLoading(false), 500));
    };

    const addCard = async (card: CardData) => {
        boardServices.insertCard(board.id, card);
    };

    const favoriteCard = async ({ id, column }: FavoriteCardData) => {
        const columnSlug = slug(column);

        const columnCardUpdated = board.cards[columnSlug]
            .map(card => {
                if (card.id !== id) { return card; }

                card.whoLiked.push(email);

                return card;
            });

        const boardColumnsUpdated = {
            ...board.cards,
            [columnSlug]: columnCardUpdated,
        };

        return boardServices.updateBoard({
            ...board,
            cards: boardColumnsUpdated,
        }).then(() => setBoard(prev => ({ ...prev, cards: boardColumnsUpdated })));
    };

    const unFavoriteCard = async ({ id, column }: FavoriteCardData) => {
        const columnSlug = slug(column);

        const columnCardUpdated = board.cards[columnSlug]
            .map(card => {
                if (card.id !== id) { return card; }

                const index = card.whoLiked.findIndex(e => e === email);

                card.whoLiked.splice(index, 1);

                return card;
            });

        const boardColumnsUpdated = {
            ...board.cards,
            [columnSlug]: columnCardUpdated,
        };

        return boardServices.updateBoard({
            ...board,
            cards: boardColumnsUpdated,
        }).then(() => setBoard(prev => ({ ...prev, cards: boardColumnsUpdated })));
    };

    const deleteCard = async (cardId: string, cardColumn: string) => {
        const columnSlug = slug(cardColumn);

        const updatedCards = board.cards[columnSlug].filter(card => card.id !== cardId);

        const boardColumnsUpdated = {
            ...board.cards,
            [columnSlug]: updatedCards,
        };

        return boardServices.updateBoard({
            ...board,
            cards: boardColumnsUpdated,
        }).then(() => setBoard(prev => ({ ...prev, cards: boardColumnsUpdated })));
    };

    const updateTemplateConfig = async (config: BoardDataConfig) => {
        const {
            name,
            timer,
            columns,
            hideCardsAutor,
            maxVotesPerCard,
            maxVotesPerUser,
            hideCardsInitially,
        } = config;

        const templateConfig = { name, columns, hideCardsAutor, maxVotesPerCard, maxVotesPerUser, hideCardsInitially };

        const buildTemplateData = { ...board.template, ...templateConfig };

        return boardServices.updateBoard({
            ...board,
            timer: timer || { isRunning: false },
            template: buildTemplateData,
        }).then(() => setBoard(prev => ({ ...prev, template: buildTemplateData })));
    };

    const editCardText = async (cardId: string, cardColumn: string, text: string) => {
        const columnSlug = slug(cardColumn);

        const columnCardUpdated = board.cards[columnSlug]
            .map(card => {
                if (card.id !== cardId) { return card; }

                card.text = text;

                return card;
            });

        const boardColumnsUpdated = {
            ...board.cards,
            [columnSlug]: columnCardUpdated,
        };

        return boardServices.updateBoard({
            ...board,
            cards: boardColumnsUpdated,
        }).then(() => setBoard(prev => ({ ...prev, cards: boardColumnsUpdated })));
    };

    const mergeCards = async (origin: CardData, target: CardData) => {
        const cardsFallback = deepCopy(board.cards);

        const newCard = {
            ...target,
            text: [target.text, '\n\n------------ \n\n', origin.text].join(' '),
            whoLiked: [...new Set([...origin.whoLiked, ...target.whoLiked])],
        };

        let boardColumnsUpdated: BoardData['cards'];

        if (origin.column !== target.column) {
            const columnOriginWithoutOrigin = board.cards[slug(origin.column)]
                .filter(card => card.id !== origin.id);

            const columnWithMergedTarget = board.cards[slug(target.column)]
                .map(card => card.id === target.id ? newCard : card);

            boardColumnsUpdated = {
                ...board.cards,
                [slug(origin.column)]: columnOriginWithoutOrigin,
                [slug(target.column)]: columnWithMergedTarget,
            };

            setBoard(prev => ({ ...prev, cards: boardColumnsUpdated }));
        } else {
            const columnUpdated = board.cards[slug(origin.column)]
                .map(card => card.id === target.id ? newCard : card)
                .filter(card => card.id !== origin.id);

            boardColumnsUpdated = {
                ...board.cards,
                [slug(origin.column)]: columnUpdated,
            };

            setBoard(prev => ({ ...prev, cards: boardColumnsUpdated }));
        }

        return boardServices.updateBoard({
            ...board,
            cards: boardColumnsUpdated,
        }).catch(() => setBoard(prev => ({ ...prev, cards: cardsFallback })));
    };

    const removeTimer = async () => {
        return boardServices.updateBoard({
            ...board,
            timer: {
                isRunning: false,
                expiryDate: '',
            },
        }).catch(() => setBoard(prev => ({ ...prev })));
    };

    const changeCardPosition = async (originCard: CardData, position: number, column: string) => {
        const cardsFallback = deepCopy(board.cards);
        const cloneCards = deepCopy(board.cards);
        const columnSlug = slug(column);
        const columnOriginSlug = slug(originCard.column);

        const isSameColumn = column === originCard.column;

        const indexColumn = board.template.columns.findIndex(col => col === column);
        const buildedCardOrigin: CardData = { ...originCard, column, color: COLORS[indexColumn] };
        const originCardIndex = cloneCards[columnOriginSlug].findIndex(card => card.id === originCard.id);

        if (isSameColumn) {
            const isBottomup = originCardIndex > position;

            // add reorded card
            cloneCards[columnSlug]
                .splice(isBottomup ? position : position + 1, 0, buildedCardOrigin);

            // remove old card
            cloneCards[columnOriginSlug]
                .splice(isBottomup ? originCardIndex + 1 : position - 1, 1);
        } else {
            // add reorded card
            cloneCards[columnSlug]
                .splice(position, 0, buildedCardOrigin);

            // remove old card
            cloneCards[columnOriginSlug]
                .splice(originCardIndex, 1);
        }

        setBoard(prev => ({ ...prev, cards: cloneCards }));

        return boardServices.updateBoard({
            ...board,
            cards: cloneCards,
        }).catch(() => setBoard(prev => ({ ...prev, cards: cardsFallback })));
    };

    return (
        <BoardContext.Provider value={context}>
            {children}
        </BoardContext.Provider>
    );
}