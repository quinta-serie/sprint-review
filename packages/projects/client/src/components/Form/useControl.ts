import { useContext } from 'react';

import debounce from './debounce';
import FormContext from './FormContext';

function sanitize(value: string) {
    const regex = /[\WA-Z]/g;
    return value.replace(regex, '');
}

export default function useControl<T>(controlName: keyof T, delay = 0) {
    const { formGroup } = useContext(FormContext);
    const control = formGroup.controls[controlName];

    const shouldSanitize = ['tel', 'cpf'].includes(control.type);

    const update = (value: any) => {
        debounce.delay(() => {
            control.value = value;
            control.dirty = true;

            formGroup.update({ [controlName]: shouldSanitize ? sanitize(value) : value });
        }, delay);
    };

    return { control, update };
}
