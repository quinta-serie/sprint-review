export interface TemplateData {
    id: string;
    name: string;
    teamId: string;
    isDefault: boolean;
    columns: Array<string>;
    maxVotesPerCard: number;
    maxVotesPerUser: number;
    hideCardsInitially: boolean;
    hideCardsAutor: boolean;
}

export type TemplateWithEditableData = Omit<TemplateData, 'id'>;