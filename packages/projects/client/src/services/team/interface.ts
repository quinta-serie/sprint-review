import type { UserData } from '../user';
import type { TemplateData } from '../template';

export interface TeamData {
    id: string;
    name: string;
    admin: string;
    members: string[];
    defaultTemplate?: string;
}

export interface TeamPopulated extends Omit<TeamData, 'members' | 'admin' | 'defaultTemplate'> {
    admin: UserData;
    members: UserData[];
    defaultTemplate: TemplateData;
}