import { uuid } from '@/utils/uuid';

import type { TemplateData } from './interface';

export const defaultTemplate = (teamId: string): TemplateData => ({
    teamId,
    id: uuid(),
    name: 'Default',
    columns: ['Went well', 'To be improve', 'Actions'],
    isDefault: true,
    maxVotesPerCard: 3,
    maxVotesPerUser: 5,
    shouldShowCardsAutor: false,
    shouldHideCardsInitially: false,
});