import type { HTMLAttributes } from 'react';

import { useTheme } from '@mui/material/styles';

import './Logo.scss';

interface LogoProps extends HTMLAttributes<HTMLElement> {
    tag?: React.ElementType;
    onlyInitials?: boolean;
    color?: 'primary' | 'secondary' | 'contrast' | 'default';
}
export default function Logo({ tag = 'div', color = 'default', onlyInitials = false, ...props }: LogoProps) {
    const { palette } = useTheme();

    const CustomTag = tag;

    const COLOR_MAP = {
        primary: palette.primary.main,
        secondary: palette.secondary.main,
        default: palette.text.primary,
        contrast: palette.primary.contrastText,
    };

    return (
        <CustomTag
            {...props}
            style={{ ...props.style, color: COLOR_MAP[color] }}
            className={[props.className, 'pacifico-regular'].join(' ')}
        >
            {onlyInitials ? 'Sr!' : 'Sprint Review!'}
        </CustomTag>
    );
}