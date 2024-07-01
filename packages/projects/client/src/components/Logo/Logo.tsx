import type { HTMLAttributes } from 'react';

import { useTheme } from '@mui/material/styles';

import './Logo.scss';

interface LogoProps extends HTMLAttributes<HTMLElement> {
    tag?: React.ElementType;
    color?: 'primary' | 'secondary' | 'contrast' | 'default';
}
export default function Logo({ tag = 'div', color = 'default', ...props }: LogoProps) {
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
            Sr
        </CustomTag>
    );
}