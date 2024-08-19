import React, {
    Children,
    useEffect,
    ReactElement,
    CSSProperties,
    FormHTMLAttributes,
    JSXElementConstructor,
} from 'react';

import FormGroup from './formGroup';
import FormContext from './FormContext';

type ChildrenElem = ReactElement<any, string | JSXElementConstructor<any>>[];

const validateChildren = <T,>(arrayChildren: ChildrenElem, formGroup: FormGroup<T>) => {
    const validatedControls: string[] = [];

    Children.map(arrayChildren, (child) => {
        const isControl = child.type['name'] === 'Control';

        if (isControl) {
            const controlName = child.props.controlName;

            if (!controlName) { throw new Error('Control must have a controlName prop'); }

            const keys = Object.keys(formGroup.controls);

            if (!keys.includes(controlName)) {
                throw new Error(`Control "${controlName}" not found in formGroup. Try use: [${keys}]`);
            }

            if (validatedControls.includes(controlName)) {
                throw new Error(`Control "${controlName}" already exists`);
            }

            validatedControls.push(controlName);
        }
    });
};

function Log<T,>({ formGroup }: Readonly<{ formGroup: FormGroup<T> }>) {
    const style: CSSProperties = {
        height: 350,
        padding: 15,
        borderRadius: 4,
        overflow: 'auto',
        color: '#333',
        background: '#e5e5e5',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    };
    return (
        <pre style={style}>
            {JSON.stringify(formGroup, null, 2)}
        </pre>
    );
}

interface NewFormProps extends FormHTMLAttributes<HTMLFormElement> {
    debug?: boolean;
    formGroup: FormGroup<any>;
    children: React.ReactNode;
}
export default function NewForm({ children, formGroup, debug = false, ...props }: Readonly<NewFormProps>) {
    const arrayChildren = Children.toArray(children) as ChildrenElem;

    useEffect(() => { validateChildren(arrayChildren, formGroup); }, []);

    useEffect(() => { change(); }, [formGroup]);

    const change = () => {
        if (formGroup.handle?.change) {
            formGroup.isValid && formGroup.handle.change(formGroup);
        }

        formGroup.validate();
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        formGroup.dirty();

        if (formGroup.handle?.submit) {
            formGroup.isValid && formGroup.handle.submit(formGroup);
        }
    };

    return (
        <FormContext.Provider value={{ formGroup }}>
            <form {...props} onSubmit={submit}>
                {children}
            </form>
            {debug && <Log formGroup={formGroup} />}
        </FormContext.Provider>
    );
}
