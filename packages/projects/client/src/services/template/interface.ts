interface Column {
    name: string;
    slug: string;
    color: string;
}

export interface TemplateData {
    id: string;
    name: string;
    teamId: string;
    isDefault: boolean;
    columns: Array<Column>;
    maxVotesPerCard: number;
    maxVotesPerUser: number;
    hideCardsInitially: boolean;
    hideReactions: boolean;
    hideCardsAutor: boolean;
}

export type TemplateWithEditableData = Omit<TemplateData, 'id'>;