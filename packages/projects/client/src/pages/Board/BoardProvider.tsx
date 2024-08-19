import { createContext, useMemo, useState } from 'react';

import { slug } from '@/utils/string';
import { wait } from '@/utils/promise';
import { deepCopy } from '@/utils/object';
import { COLORS } from '@/services/template';
import { defaultTemplate } from '@/services/template';
import { boardServices, userServices } from '@/services/core';
import type { BoardData, BoardDataConfig, CardData } from '@/services/board';
import {
    _editCard,
    _favoriteCard,
    _unFavoriteCard,
    _changeCardColumn,
    _generateNewOrderedColumn,
    _mergeCardInTheSameColumn,
    _mergeCardsInDiferentColumns,
} from '@/services/board/boardUtilities';

type FavoriteCardData = { id: string; column: string };

interface BoardContextConfig {
    board: BoardData;
    loading: boolean;
    isOwner: boolean;
    removeTimer: () => Promise<void>;
    addCard: (card: CardData) => Promise<void>;
    getBoardDetails: (boardId: string) => Promise<void>;
    loadBoard: (fn: (data: BoardData) => BoardData) => void;
    mergeCards: (origin: CardData, target: CardData) => void;
    favoriteCard: (dataCard: FavoriteCardData) => Promise<void>;
    unFavoriteCard: (dataCard: FavoriteCardData) => Promise<void>;
    deleteCard: (cardId: string, columCard: string) => Promise<void>;
    updateTemplateConfig: (template: BoardDataConfig) => Promise<void>;
    reorderCard: (originCard: CardData, position: number) => Promise<void>;
    editCardText: (cardId: string, cardColumn: string, text: string) => Promise<void>;
    changeCardColumn: (data: { originCard: CardData, columnTargetSlug: string, position: number }) => void;
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
    loadBoard: () => defaultBoard,
    mergeCards: () => null,
    changeCardColumn: () => null,
    addCard: () => new Promise(() => null),
    deleteCard: () => new Promise(() => null),
    removeTimer: () => new Promise(() => null),
    reorderCard: () => new Promise(() => null),
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
        board,
        loading,
        isOwner: board.ownerId === user_id,
        addCard: (card) => addCard(card),
        removeTimer: () => removeTimer(),
        loadBoard: (fn) => setBoard(prev => fn(prev)),
        getBoardDetails: (boardId) => getBoardDetails(boardId),
        mergeCards: (origin, target) => mergeCards(origin, target),
        favoriteCard: ({ id, column }) => favoriteCard({ id, column }),
        deleteCard: (cardId, columCard) => deleteCard(cardId, columCard),
        reorderCard: (cardId, position) => reorderCard(cardId, position),
        unFavoriteCard: ({ id, column }) => unFavoriteCard({ id, column }),
        updateTemplateConfig: (template) => updateTemplateConfig(template),
        editCardText: (cardId, cardColumn, text) => editCardText(cardId, cardColumn, text),
        changeCardColumn: ({ originCard, columnTargetSlug, position }) =>
            changeCardColumn({ originCard, columnTargetSlug, position }),
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

        const cardsFallback = deepCopy(board.cards[column]);

        const updatedColumn = _favoriteCard(board.cards[columnSlug], id, email);

        setBoard(prev => ({ ...prev, cards: { ...prev.cards, [column]: updatedColumn } }));

        return boardServices.updateBoardColumn({ column: columnSlug, boardId: board.id }, (b) => {
            return _favoriteCard(b.cards[columnSlug], id, email);
        }).catch(() => {
            setBoard(prev => ({ ...prev, cards: { ...prev.cards, [columnSlug]: cardsFallback } }));
        });
    };

    const unFavoriteCard = async ({ id, column }: FavoriteCardData) => {
        const columnSlug = slug(column);

        const cardsFallback = deepCopy(board.cards[column]);

        const updatedColumn = _unFavoriteCard(board.cards[columnSlug], id, email);

        setBoard(prev => ({ ...prev, cards: { ...prev.cards, [column]: updatedColumn } }));

        return boardServices.updateBoardColumn({ column: columnSlug, boardId: board.id }, (b) => {
            return _unFavoriteCard(b.cards[columnSlug], id, email);
        }).catch(() => {
            setBoard(prev => ({ ...prev, cards: { ...prev.cards, [columnSlug]: cardsFallback } }));
        });
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

        const cardsFallback = deepCopy(board.cards[columnSlug]);

        const updatedColumn = _editCard(board.cards[columnSlug], cardId, text);

        setBoard(prev => ({ ...prev, cards: { ...prev.cards, [cardColumn]: updatedColumn } }));

        return boardServices.updateBoardColumn({ column: columnSlug, boardId: board.id }, (b) => {
            return _editCard(b.cards[columnSlug], cardId, text);
        }).catch(() => {
            setBoard(prev => ({ ...prev, cards: { ...prev.cards, [columnSlug]: cardsFallback } }));
        });
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

    const reorderCard = async (originCard: CardData, position: number) => {
        const columnSlug = slug(originCard.column);

        const cardsFallback = deepCopy(board.cards[columnSlug]);

        const newColumnCards = _generateNewOrderedColumn(board.cards[columnSlug], originCard, position);

        setBoard(prev => ({ ...prev, cards: { ...prev.cards, [columnSlug]: newColumnCards } }));

        return boardServices.updateBoardColumn({ column: columnSlug, boardId: board.id }, (b) => {
            return _generateNewOrderedColumn(b.cards[columnSlug], originCard, position);
        }).catch(() =>
            setBoard(prev => ({ ...prev, cards: { ...prev.cards, [columnSlug]: cardsFallback } }))
        );
    };

    const mergeCards = async (origin: CardData, target: CardData) => {
        const columnOriginSlug = slug(origin.column);
        const columnTargetSlug = slug(target.column);
        const cardsOriginFallback = deepCopy(board.cards[columnOriginSlug]);
        const cardsTargetFallback = deepCopy(board.cards[columnTargetSlug]);

        const isTheSameColumn = origin.column === target.column;

        if (isTheSameColumn) {
            const newCard = _mergeCardInTheSameColumn(board.cards[columnOriginSlug], target, origin);

            setBoard(prev => ({ ...prev, cards: { ...prev.cards, [columnOriginSlug]: newCard } }));

            boardServices.updateBoardColumn({ column: columnOriginSlug, boardId: board.id }, (b) => {
                return _mergeCardInTheSameColumn(b.cards[columnOriginSlug], target, origin);
            }).catch(() => {
                setBoard(prev => ({ ...prev, cards: { ...prev.cards, [columnOriginSlug]: cardsOriginFallback } }));
            });
        } else {
            const { updatedColumnOrigin, updatedColumnTarget } = _mergeCardsInDiferentColumns({
                origin: { card: origin, column: board.cards[columnOriginSlug] },
                target: { card: target, column: board.cards[columnTargetSlug] },
            });

            setBoard(prev => ({
                ...prev,
                cards: {
                    ...prev.cards,
                    [columnOriginSlug]: updatedColumnOrigin,
                    [columnTargetSlug]: updatedColumnTarget,
                }
            }));

            boardServices.updateBoardMultipleColumns({
                boardId: board.id,
                originColumn: columnOriginSlug,
                targetColumn: columnTargetSlug
            }, (b) => {
                const { updatedColumnOrigin, updatedColumnTarget } = _mergeCardsInDiferentColumns({
                    origin: { card: origin, column: b.cards[columnOriginSlug] },
                    target: { card: target, column: b.cards[columnTargetSlug] },
                });

                return {
                    updatedOriginColumn: updatedColumnOrigin,
                    updatedTargetColumn: updatedColumnTarget,
                };
            }).catch(() => {
                setBoard(prev => ({
                    ...prev, cards: {
                        ...prev.cards,
                        [columnOriginSlug]: cardsOriginFallback,
                        [columnTargetSlug]: cardsTargetFallback
                    }
                }));
            });
        }
    };

    const changeCardColumn = async ({
        position, originCard, columnTargetSlug
    }: { originCard: CardData, columnTargetSlug: string, position: number }) => {
        const columnOriginSlug = slug(originCard.column);

        const columnIndex = board.template.columns.findIndex(column => slug(column) === columnTargetSlug);

        const cardsOriginFallback = deepCopy(board.cards[columnOriginSlug]);
        const cardsTargetFallback = deepCopy(board.cards[columnTargetSlug]);

        const { updatedColumnOrigin, updatedColumnTarget } = _changeCardColumn({
            position,
            origin: { card: originCard, column: board.cards[columnOriginSlug] },
            target: {
                color: COLORS[columnIndex],
                slug: board.template.columns[columnIndex],
                column: board.cards[columnTargetSlug],
            },
        });

        setBoard(prev => ({
            ...prev,
            cards: {
                ...prev.cards,
                [columnOriginSlug]: updatedColumnOrigin,
                [columnTargetSlug]: updatedColumnTarget,
            }
        }));

        boardServices.updateBoardMultipleColumns({
            boardId: board.id,
            originColumn: columnOriginSlug,
            targetColumn: columnTargetSlug
        }, (b) => {
            const { updatedColumnOrigin, updatedColumnTarget } = _changeCardColumn({
                position,
                origin: { card: originCard, column: b.cards[columnOriginSlug] },
                target: {
                    color: COLORS[columnIndex],
                    column: b.cards[columnTargetSlug],
                    slug: b.template.columns[columnIndex],
                },
            });

            return {
                updatedOriginColumn: updatedColumnOrigin,
                updatedTargetColumn: updatedColumnTarget,
            };
        }).catch((e) => {
            console.log(e);
            setBoard(prev => ({
                ...prev, cards: {
                    ...prev.cards,
                    [columnOriginSlug]: cardsOriginFallback,
                    [columnTargetSlug]: cardsTargetFallback
                }
            }));
        });
    };

    return (
        <BoardContext.Provider value={context}>
            {children}
        </BoardContext.Provider>
    );
}