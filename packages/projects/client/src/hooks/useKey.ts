import { useEffect } from 'react';

type LetterKey =
    'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' |
    'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' |
    'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' |
    'v' | 'x' | 'y' | 'z';

type KeyAction = 'Enter' | 'Escape' | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

type Key = LetterKey | KeyAction;

type KeyData = { [k in Key]?: () => void; }

export default function useKey(data: KeyData, deps: any[] = []) {
    useEffect(() => {
        connectListener();
        return () => { disconnectListener(); };
    }, deps);

    const connectListener = () => { window.addEventListener('keyup', exec, false); };
    const disconnectListener = () => { window.removeEventListener('keyup', exec, false); };

    const exec = (e: KeyboardEvent) => { if (data[e.key]) { data[e.key](); } };
}