import { useContext } from 'react';

import { TeamDetailsContext } from './TeamDetailsProvider';

export default function useTeamDetails() {
    return useContext(TeamDetailsContext);
}