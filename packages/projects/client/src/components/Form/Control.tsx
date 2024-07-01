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

const validateChildren = (arrayChildren: ChildrenElem) => {
    if (!arrayChildren.length || arrayChildren.length > 1) {
        throw new Error('Control must have only one child');
    }
};

interface ControlProps<Form> extends FormHTMLAttributes<InputHTMLAttributes<any>> {
    controlName: keyof Form;
    children: React.ReactNode;
    action?: 'onBlur' | 'onChange' | 'onInput';
}
export default function Control<Form>({ controlName, children, action = 'onInput' }: ControlProps<Form>) {
    const { update } = useControl<Form>(controlName);
    const arrayChildren = Children.toArray(children) as ChildrenElem;

    useEffect(() => { validateChildren(arrayChildren); }, []);

    const renderChildren = (child: ReactElement<ControlProps<Form>>) => {
        return cloneElement(child, {
            [action]: (e: any) => update(e.target['value']),
        });
    };

    return (
        renderChildren(arrayChildren[0])
    );
}
