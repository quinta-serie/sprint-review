import { useContext } from 'react';

import { TeamsContext } from './TeamsProvider';

export default function useTeams() {
    return useContext(TeamsContext);
}