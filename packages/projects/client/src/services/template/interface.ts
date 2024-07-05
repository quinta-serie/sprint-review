export interface TemplateData {
    id: string;
    name: string;
    teamId: string;
    isDefault: boolean;
    columns: Array<string>;
    oneVotePerCard: boolean;
    maxVotesPerCard: number;
    maxVotesPerUser: number;
    shouldShowCardsAutor: boolean;
    shouldHideCardsInitially: boolean;
}

export type TemplateWithEditableData = Omit<TemplateData, 'id'>;