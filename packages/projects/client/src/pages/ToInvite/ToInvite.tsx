import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useToInvite from './useToInvite';

export default function Invite() {
    const { toInvite, loading } = useToInvite();
    const { teamId } = useParams<{ teamId: string }>();

    useEffect(() => { toInvite(teamId as string); }, []);

    return (
        loading ? <div>Loading...</div> : <div>Invite</div>
    );
}