import { useContext } from 'react';

import { TeamContext } from './TeamProvider';

export default function useTeams() {
    return useContext(TeamContext);
}