export type InviteStatus = 'sent' | 'accepted' | 'rejected' | 'deleted';

export interface InviteData {
    email: string;
    teamId: string;
    createdAt: string;
    status: InviteStatus;
}