import { uuid } from '@/utils/uuid';

import type DB from '../db';
import type { TemplateData, TemplateWithEditableData } from './interface';

export default class Template {
    private static PATH = 'templates';

    constructor(private db: DB) { }

    getTemplate(teamId: string) {
        return this.db.getItem<TemplateData>({
            path: Template.PATH,
            pathSegments: [],
            filters: [
                { field: 'teamId', operator: '==', value: teamId },
                { field: 'isDefault', operator: '==', value: true },
            ],
        });
    }

    async createTemplate(data: TemplateWithEditableData) {
        const id = uuid();

        return this.db.setItem({
            path: Template.PATH,
            pathSegments: [id],
            data: { ...data, id },
        }).then(() => ({ ...data, id }));
    }

    updateTemplate(data: TemplateData) {
        return this.db.setItem({
            path: Template.PATH,
            pathSegments: [data.id],
            data
        });
    }
}