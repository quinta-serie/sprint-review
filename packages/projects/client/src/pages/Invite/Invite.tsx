import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { enqueueSnackbar } from 'notistack';

import { user, team } from '@/services/core';
import { removeDuplicate } from '@/utils/array';
import log from '@/utils/log';

export default function Invite() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { teamId } = useParams<{ teamId: string }>();

    useEffect(() => {
        const { email } = user.current;

        team.getTeam(teamId as string)
            .then(t => {
                if (!t) { throw new Error('Team not found'); }

                const mappedMembers = removeDuplicate([...t.members, email]);

                team.updateMemberToTeam({ ...t, members: mappedMembers })
                    .then(() => {
                        enqueueSnackbar(`Você foi adicionado ao time: ${t.name}`, { variant: 'success' });
                        navigate('/teams');
                    });
            })
            .catch(e => {
                log.error(e);
                enqueueSnackbar('Time não encontrado', { variant: 'error' });
                navigate('/teams');
            });
    }, []);

    return (
        loading ? <div>Loading...</div> : <div>Invite</div>
    );
}