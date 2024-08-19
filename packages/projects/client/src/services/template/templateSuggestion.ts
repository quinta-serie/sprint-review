import { uuid } from '@/utils/uuid';

import type { TemplateData } from './interface';
import { COLORS } from './colors';

export const standardTemplate = (teamId: string): TemplateData => ({
    teamId,
    id: uuid(),
    name: 'Default',
    columns: [
        { name: 'Went well', slug: 'went-well', color: COLORS[0] },
        { name: 'To be improve', slug: 'to-be-improve', color: COLORS[1] },
        { name: 'Actions', slug: 'actions', color: COLORS[2] }
    ],
    isDefault: true,
    maxVotesPerCard: 3,
    maxVotesPerUser: 5,
    hideReactions: true,
    hideCardsAutor: true,
    hideCardsInitially: true,
});

export const truthsAndLiesTemplate = (teamId: string): TemplateData => ({
    teamId,
    id: uuid(),
    name: 'Default',
    columns: [
        { name: 'Fatos', slug: 'fatos', color: COLORS[7] },
        { name: 'Verdades', slug: 'verdades', color: COLORS[3] },
        { name: 'Mentiras', slug: 'mentiras', color: COLORS[5] },
        { name: 'Legenda', slug: 'legenda', color: COLORS[4] }
    ],
    isDefault: true,
    maxVotesPerCard: 3,
    maxVotesPerUser: 5,
    hideReactions: true,
    hideCardsAutor: true,
    hideCardsInitially: true,
});