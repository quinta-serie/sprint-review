export type InviteStatus = 'sent' | 'accepted' | 'rejected' | 'deleted';

export interface InviteData {
    id: string;
    email: string;
    teamId: string;
    teamName: string;
    createdAt: string;
    status: InviteStatus;
}