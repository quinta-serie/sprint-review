import type { BoardData, CardData } from './interface';

export function _generateNewOrderedColumn(column: BoardData['cards'][string], card: CardData, position: number) {
    const currentIndex = column.findIndex(({ id }) => id === card.id);

    const indexToInsert = position > currentIndex ? position - 1 : position;

    // Remove old card
    const newColumnCards = column.filter(({ id }) => id !== card.id);

    // Add new card
    newColumnCards.splice(indexToInsert, 0, card);

    return newColumnCards;
}

export function _favoriteCard(column: BoardData['cards'][string], cardId: string, email: string) {
    return column
        .map(card => {
            if (card.id !== cardId) { return card; }

            card.whoLiked.push(email);

            return card;
        });
}

export function _unFavoriteCard(column: BoardData['cards'][string], cardId: string, email: string) {
    return column
        .map(card => {
            if (card.id !== cardId) { return card; }

            const index = card.whoLiked.findIndex(e => e === email);

            card.whoLiked.splice(index, 1);

            return card;
        });
}

export function _editCard(column: BoardData['cards'][string], cardId: string, text: string) {
    return column
        .map(card => {
            if (card.id !== cardId) { return card; }

            card.text = text;

            return card;
        });
}

export function _mergeCardInTheSameColumn(column: BoardData['cards'][string], target: CardData, origin: CardData) {
    const newCard = {
        ...target,
        text: [target.text, '\n\n------------ \n\n', origin.text].join(' '),
        whoLiked: [...new Set([...origin.whoLiked, ...target.whoLiked])],
    };

    return column
        .map(card => card.id === target.id ? newCard : card)
        .filter(card => card.id !== origin.id);
}

export function _mergeCardsInDiferentColumns({ origin, target }: {
    target: { card: CardData, column: BoardData['cards'][string] },
    origin: { card: CardData, column: BoardData['cards'][string] }
}) {
    const newCard = {
        ...target.card,
        text: [target.card.text, '\n\n------------ \n\n', origin.card.text].join(' '),
        whoLiked: [...new Set([...origin.card.whoLiked, ...target.card.whoLiked])],
    };

    const columnOriginWithoutOrigin = origin.column
        .filter(card => card.id !== origin.card.id);

    const columnWithMergedTarget = target.column
        .map<CardData>(card => card.id === target.card.id ? newCard : card);

    return {
        updatedColumnTarget: columnWithMergedTarget,
        updatedColumnOrigin: columnOriginWithoutOrigin,
    };
}