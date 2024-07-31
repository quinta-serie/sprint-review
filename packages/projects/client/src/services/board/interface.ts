import type { TemplateData } from '../template';

export interface BoardData {
    id: string;
    name: string;
    teamId: string;
    ownerId: string;
    createdAt: string;
    description: string;
    cards: { [x: string]: CardData[] };
    template: TemplateData;
    status: 'active' | 'archived';
}

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
}