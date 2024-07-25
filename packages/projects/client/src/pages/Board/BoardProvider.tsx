import { createContext, useMemo, useState } from 'react';

import { wait } from '@/utils/promise';
import { defaultTemplate } from '@/services/template';
import type { BoardData, CardData } from '@/services/board';
import { boardServices, userServices } from '@/services/core';

import { TemplateFormData } from '../Teams/TemplateForm';

interface BoardContextConfig {
    board: BoardData;
    loading: boolean;
    deleteCard: (cardId: string) => Promise<void>;
    favoriteCard: (cardId: string) => Promise<void>;
    unFavoriteCard: (cardId: string) => Promise<void>;
    getBoardDetails: (boardId: string) => Promise<void>;
    loadBoard: (fn: (data: BoardData) => BoardData) => void;
    mergeCards: (origin: CardData, target: CardData) => void;
    editCardText: (cardId: string, text: string) => Promise<void>;
    addCard: (card: CardData) => Promise<void>;
    updateTemplateConfig: (template: TemplateFormData) => Promise<void>;
}

const defaultBoard: BoardData = {
    id: '',
    name: '',
    teamId: '',
    ownerId: '',
    createdAt: '',
    description: '',
    status: 'active',
    cards: [],
    template: defaultTemplate('')
};

export const BoardContext = createContext<BoardContextConfig>({
    board: defaultBoard,
    loading: false,
    mergeCards: () => null,
    loadBoard: () => defaultBoard,
    addCard: () => new Promise(() => null),
    deleteCard: () => new Promise(() => null),
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

    const { email } = userServices.current;

    const context = useMemo<BoardContextConfig>(() => ({
        loading,
        board,
        loadBoard: (fn) => setBoard(prev => fn(prev)),
        addCard: (card) => addCard(card),
        deleteCard: (cardId) => deleteCard(cardId),
        favoriteCard: (cardId) => favoriteCard(cardId),
        unFavoriteCard: (cardId) => unFavoriteCard(cardId),
        getBoardDetails: (boardId) => getBoardDetails(boardId),
        mergeCards: (origin, target) => mergeCards(origin, target),
        editCardText: (cardId, text) => editCardText(cardId, text),
        updateTemplateConfig: (template) => updateTemplateConfig(template),
    }), [board, loading]);

    const getBoardDetails = async (boardId: string) => {
        boardServices.getBoard(boardId)
            .then((data) => setBoard(data as BoardData))
            .finally(() => wait(() => setLoading(false), 500));
    };

    const addCard = async (card: BoardData['cards'][number]) => {
        const mergedCards = [...board.cards, card];
        return boardServices.updateBoard({
            ...board,
            cards: mergedCards,
        }).then(() => setBoard(prev => ({ ...prev, cards: mergedCards })));
    };

    const favoriteCard = async (cardId: string) => {
        const updatedCards = board.cards.map(card => {
            if (card.id !== cardId) { return card; }

            card.whoLiked.push(email);

            return card;
        });

        return boardServices.updateBoard({
            ...board,
            cards: updatedCards,
        }).then(() => setBoard(prev => ({ ...prev, cards: updatedCards })));
    };

    const unFavoriteCard = async (cardId: string) => {
        const updatedCards = board.cards.map(card => {
            if (card.id !== cardId) { return card; }

            const index = card.whoLiked.findIndex(e => e === email);

            card.whoLiked.splice(index, 1);

            return card;
        });

        return boardServices.updateBoard({
            ...board,
            cards: updatedCards,
        }).then(() => setBoard(prev => ({ ...prev, cards: updatedCards })));
    };

    const deleteCard = async (cardId: string) => {
        const updatedCards = board.cards.filter(card => card.id !== cardId);

        return boardServices.updateBoard({
            ...board,
            cards: updatedCards,
        }).then(() => setBoard(prev => ({ ...prev, cards: updatedCards })));
    };

    const updateTemplateConfig = async (template: TemplateFormData) => {
        const buildTemplateData = { ...board.template, ...template };

        return boardServices.updateBoard({
            ...board,
            template: buildTemplateData,
        }).then(() => setBoard(prev => ({ ...prev, template: buildTemplateData })));
    };

    const editCardText = async (cardId: string, text: string) => {
        const updatedCards = board.cards.map(card => {
            if (card.id !== cardId) { return card; }

            card.text = text;

            return card;
        });

        return boardServices.updateBoard({
            ...board,
            cards: updatedCards,
        }).then(() => setBoard(prev => ({ ...prev, cards: updatedCards })));
    };

    const mergeCards = async (origin: CardData, target: CardData) => {
        target.text = [target.text, '\n\n------------ \n\n', origin.text].join(' ');

        const updatedCards = board.cards
            .filter(card => card.id !== origin.id);

        return boardServices.updateBoard({
            ...board,
            cards: updatedCards,
        }).then(() => setBoard(prev => ({ ...prev, cards: updatedCards })));
    };

    return (
        <BoardContext.Provider value={context}>
            {children}
        </BoardContext.Provider>
    );
}