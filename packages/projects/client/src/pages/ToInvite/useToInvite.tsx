import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { enqueueSnackbar } from 'notistack';

import log from '@/utils/log';
import useTeams from '@/pages/Teams/useTeams';
import { user, team } from '@/services/core';
import { removeDuplicate } from '@/utils/array';

export default function useToInvite() {
    const navigate = useNavigate();
    const { addTeam } = useTeams();
    const { email } = user.current;
    const [loading, setLoading] = useState(true);

    const toInvite = async (teamId: string) => {
        setLoading(true);

        return team.getTeam(teamId)
            .then(t => {
                if (!t) { throw new Error('Team not found'); }

                const mappedMembers = removeDuplicate([...t.members, email]);

                team.updateTeam({ ...t, members: mappedMembers })
                    .then(async () => {
                        const populatedTeam = await team.pupulateTeam([t], user);

                        populatedTeam[0].members.push(user.current);

                        addTeam(populatedTeam[0]);

                        enqueueSnackbar(`Você foi adicionado ao time: ${t.name}`, { variant: 'success' });
                        navigate('/teams');
                    });
            })
            .catch(e => {
                log.error(e);
                enqueueSnackbar('Time não encontrado', { variant: 'error' });
                navigate('/teams');
            })
            .finally(() => setTimeout(() => { setLoading(false); }, 500));
    };

    return { loading, toInvite };
}