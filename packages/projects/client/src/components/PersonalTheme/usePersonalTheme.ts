import { useContext } from 'react';

import { PersonalThemeContext } from './PersonalThemeProvider';

export default function usePersonalTheme() {
    return useContext(PersonalThemeContext);
}