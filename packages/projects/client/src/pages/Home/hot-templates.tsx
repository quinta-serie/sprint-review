import React from 'react';

import AddIcon from '@mui/icons-material/Add';

import DefaultRetroImg from '@/assets/home/template_retro.png';

export type State = 'new' | 'existing';

interface New {
    icon: React.JSX.Element;
}

interface Existing {
    img: string;
}

export type HotTemplates<S extends State> = {
    [K in S]: {
        state: K;
        name: string;
    } & (
        K extends 'new' ? New :
        K extends 'existing' ? Existing :
        never
    );
}[S];

export default [
    {
        name: 'Nova retrô',
        state: 'new',
        icon: <AddIcon color="primary" sx={{ fontSize: 40 }} />
    },
    {
        name: 'Retrô padrão',
        state: 'existing',
        img: DefaultRetroImg
    }
] satisfies Array<HotTemplates<State>>;