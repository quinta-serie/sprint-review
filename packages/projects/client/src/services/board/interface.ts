import type { TemplateData, TemplateWithEditableData } from '../template';

export interface BoardData {
    id: string;
    name: string;
    teamId: string;
    ownerId: string;
    createdAt: string;
    description: string;
    reactions: string[];
    timer?: { isRunning: boolean; expiryDate?: string; }
    status: 'active' | 'archived';
    template: TemplateData;
    cards: { [x: string]: CardData[] };
}

export type BoardDataConfig =
    Pick<BoardData, 'timer'> & Omit<TemplateWithEditableData, 'id' | 'teamId' | 'isDefault'>;

export interface CardData {
    id: string;
    text: string;
    color: string;
    owner: {
        id: string;
        name: string
    };
    column: string;
    whoLiked: string[];
    reactions: {
        [x: string]: string[];
    };
}