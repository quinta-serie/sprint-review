import React from 'react';

export interface IProps {
    children: React.ReactElement;
}

export interface IButton {
    path: string;
    label: string;
    open?: boolean;
    internal: boolean;
    icon: React.ReactNode;
    children?: Omit<IButton, 'children' | 'open'>[];
}

export interface IButtonDetail {
    btn: IButton;
    goTo: (path: string, internal: boolean) => void;
}