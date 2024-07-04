import { createContext, useMemo, useState } from 'react';

import type { TeamPopulated } from '@/services/team';

import InviteUserModal, { type InviteUserModalProps } from './InviteUserModal';

interface InviteUserModalContextConfig {
    isOpen: boolean;
    selectedTeam?: TeamPopulated;
    toggleModal: () => void;
    InviteUserModal: (data: InviteUserModalProps) => React.JSX.Element;
    updateTeamSelected: (data: TeamPopulated) => void;
}

export const InviteUserModalContext = createContext<InviteUserModalContextConfig>({
    isOpen: false,
    selectedTeam: undefined,
    InviteUserModal: () => <p></p>,
    toggleModal: () => null,
    updateTeamSelected: () => null
});

interface InviteUserModalProviderProps { children: React.JSX.Element; }
export default function InviteUserModalProvider({ children }: InviteUserModalProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<TeamPopulated>();

    const context = useMemo<InviteUserModalContextConfig>(() => ({
        isOpen,
        selectedTeam,
        InviteUserModal,
        toggleModal: () => { handleToggleModal(); },
        updateTeamSelected: (data) => { setSelectedTeam(data); }
    }), [isOpen, selectedTeam]);

    const handleToggleModal = () => { setIsOpen(prev => !prev); };

    return (
        <InviteUserModalContext.Provider value={context}>
            {children}
        </InviteUserModalContext.Provider>
    );
}