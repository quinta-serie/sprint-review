import React, {
    Children,
    useEffect,
    ReactElement,
    cloneElement,
    FormHTMLAttributes,
    InputHTMLAttributes,
    JSXElementConstructor,
} from 'react';

import useControl from './useControl';

type ChildrenElem = ReactElement<any, string | JSXElementConstructor<any>>[];

type ActionParams = {
    text: React.FormEvent<HTMLDivElement>;
    number: React.FormEvent<HTMLDivElement>;
    radio: React.ChangeEvent<HTMLInputElement>;
    checkbox: React.ChangeEvent<HTMLInputElement>;
}

const validateChildren = (arrayChildren: ChildrenElem) => {
    if (!arrayChildren.length || arrayChildren.length > 1) {
        throw new Error('Control must have only one child');
    }
};

interface ControlProps<Form> extends FormHTMLAttributes<InputHTMLAttributes<any>> {
    controlName: keyof Form;
    children: React.ReactNode;
    action?: 'onBlur' | 'onChange' | 'onInput';
    type?: 'text' | 'checkbox' | 'radio' | 'number';
}
export default function Control<Form>({
    children,
    controlName,
    type = 'text',
    action = 'onInput',
}: ControlProps<Form>) {
    const { update } = useControl<Form>(controlName);
    const arrayChildren = Children.toArray(children) as ChildrenElem;

    useEffect(() => { validateChildren(arrayChildren); }, []);

    const renderChildren = (child: ReactElement<ControlProps<Form>>) => {
        return cloneElement(child, {
            [action]: (e: ActionParams[typeof type]) => update(
                ['radio', 'checkbox'].includes(type)
                    ? e.target['checked']
                    : e.target['value']
            ),
        });
    };

    return (
        renderChildren(arrayChildren[0])
    );
}
