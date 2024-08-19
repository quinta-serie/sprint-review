import { createContext, useMemo, useState } from 'react';

import { wait } from '@/utils/promise';
import { deepCopy } from '@/utils/object';
import { standardTemplate } from '@/services/template';
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
    _addReaction,
    _removeReaction,
} from '@/services/board/boardUtilities';

type FavoriteCardData = { id: string; column: string; };
type ReactionCardData = { card: CardData; reaction: string; };

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
    manageReaction: (data: ReactionCardData) => Promise<void>;
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
    description: '',
    timer: { isRunning: false },
    status: 'active',
    cards: {},
    reactions: [],
    template: standardTemplate('')
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
    manageReaction: () => new Promise(() => null),
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
        manageReaction: (data) => manageReaction(data),
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
        const cardsFallback = deepCopy(board.cards[column]);

        const updatedColumn = _favoriteCard(board.cards[column], id, email);

        setBoard(prev => ({ ...prev, cards: { ...prev.cards, [column]: updatedColumn } }));

        return boardServices.updateBoardColumn({ column, boardId: board.id }, (b) => {
            return _favoriteCard(b.cards[column], id, email);
        }).catch(() => {
            setBoard(prev => ({ ...prev, cards: { ...prev.cards, [column]: cardsFallback } }));
        });
    };

    const unFavoriteCard = async ({ id, column }: FavoriteCardData) => {
        const cardsFallback = deepCopy(board.cards[column]);

        const updatedColumn = _unFavoriteCard(board.cards[column], id, email);

        setBoard(prev => ({ ...prev, cards: { ...prev.cards, [column]: updatedColumn } }));

        return boardServices.updateBoardColumn({ column, boardId: board.id }, (b) => {
            return _unFavoriteCard(b.cards[column], id, email);
        }).catch(() => {
            setBoard(prev => ({ ...prev, cards: { ...prev.cards, [column]: cardsFallback } }));
        });
    };

    const deleteCard = async (cardId: string, column: string) => {
        const updatedCards = board.cards[column].filter(card => card.id !== cardId);

        const boardColumnsUpdated = {
            ...board.cards,
            [column]: updatedCards,
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
            maxVotesPerCard,
            maxVotesPerUser,
            hideReactions,
            hideCardsAutor,
            hideCardsInitially,
        } = config;

        const templateConfig = {
            name, columns, hideCardsAutor,
            maxVotesPerCard, maxVotesPerUser,
            hideCardsInitially, hideReactions
        };

        const buildTemplateData = { ...board.template, ...templateConfig };

        return boardServices.updateBoard({
            ...board,
            timer: timer || { isRunning: false },
            template: buildTemplateData,
        }).then(() => setBoard(prev => ({ ...prev, template: buildTemplateData })));
    };

    const editCardText = async (cardId: string, column: string, text: string) => {
        const cardsFallback = deepCopy(board.cards[column]);

        const updatedColumn = _editCard(board.cards[column], cardId, text);

        setBoard(prev => ({ ...prev, cards: { ...prev.cards, [column]: updatedColumn } }));

        return boardServices.updateBoardColumn({ column: column, boardId: board.id }, (b) => {
            return _editCard(b.cards[column], cardId, text);
        }).catch(() => {
            setBoard(prev => ({ ...prev, cards: { ...prev.cards, [column]: cardsFallback } }));
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
        const column = originCard.column;

        const cardsFallback = deepCopy(board.cards[column]);

        const newColumnCards = _generateNewOrderedColumn(board.cards[column], originCard, position);

        setBoard(prev => ({ ...prev, cards: { ...prev.cards, [column]: newColumnCards } }));

        return boardServices.updateBoardColumn({ column, boardId: board.id }, (b) => {
            return _generateNewOrderedColumn(b.cards[column], originCard, position);
        }).catch(() =>
            setBoard(prev => ({ ...prev, cards: { ...prev.cards, [column]: cardsFallback } }))
        );
    };

    const mergeCards = async (origin: CardData, target: CardData) => {
        const columnOriginSlug = origin.column;
        const columnTargetSlug = target.column;
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
        const columnOriginSlug = originCard.column;

        const columnIndex = board.template.columns.findIndex(column => column.slug === columnTargetSlug);
        const column = board.template.columns[columnIndex];

        const cardsOriginFallback = deepCopy(board.cards[columnOriginSlug]);
        const cardsTargetFallback = deepCopy(board.cards[columnTargetSlug]);

        const { updatedColumnOrigin, updatedColumnTarget } = _changeCardColumn({
            position,
            origin: { card: originCard, column: board.cards[columnOriginSlug] },
            target: {
                slug: column.slug,
                color: column.color,
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
                    column: b.cards[columnTargetSlug],
                    slug: b.template.columns[columnIndex].slug,
                    color: b.template.columns[columnIndex].color,
                },
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
    };

    const manageReaction = async ({ card, reaction }: ReactionCardData) => {
        const cardsFallback = deepCopy(board.cards[card.column]);

        const isReactionUsed = card.reactions[reaction] && card.reactions[reaction]?.includes(email);

        if (isReactionUsed) {
            const updatedColumn = _removeReaction(board.cards[card.column], card.id, reaction, email);

            setBoard(prev => ({ ...prev, cards: { ...prev.cards, [card.column]: updatedColumn } }));

            boardServices.updateBoardColumn({ column: card.column, boardId: board.id }, (b) => {
                return _removeReaction(b.cards[card.column], card.id, reaction, email);
            }).catch(() => {
                setBoard(prev => ({ ...prev, cards: { ...prev.cards, [card.column]: cardsFallback } }));
            });
        } else {
            const updatedColumn = _addReaction(board.cards[card.column], card.id, reaction, email);

            setBoard(prev => ({ ...prev, cards: { ...prev.cards, [card.column]: updatedColumn } }));

            boardServices.updateBoardColumn({ column: card.column, boardId: board.id }, (b) => {
                return _addReaction(b.cards[card.column], card.id, reaction, email);
            }).catch(() => {
                setBoard(prev => ({ ...prev, cards: { ...prev.cards, [card.column]: cardsFallback } }));
            });
        }
    };

    return (
        <BoardContext.Provider value={context}>
            {children}
        </BoardContext.Provider>
    );
}