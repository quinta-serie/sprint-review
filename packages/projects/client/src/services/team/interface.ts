import type { UserData } from '../user/interface';

export interface TeamData {
    id: string;
    name: string;
    admin: string;
    members: string[];
}

export interface TeamPopulated extends Omit<TeamData, 'members' | 'admin'> {
    admin: UserData;
    members: UserData[];
}