import { useEffect, useState } from 'react';

import FormGroup, { AbstractControl, Handle, Validator } from './formGroup';

interface UseForm<T> { form: AbstractControl<T>; handle?: Handle<T>; validator?: Validator<T>; }
export default function useForm<Form>({ form, handle, validator }: UseForm<Form>, deps: any[]) {
    const [formGroup, setFormGroup] = useState<FormGroup<Form>>(new FormGroup(form, handle, validator));

    useEffect(() => { setFormGroup(new FormGroup(form, handle, validator)); }, deps);

    const updateForm = (values: Partial<Form>) => {
        setFormGroup(prevForm => {
            let lastUpdated!: keyof Form;

            const controls = prevForm.controls;

            for (const key of Object.keys(values)) {
                controls[key].value = values[key];
                lastUpdated = key as keyof Form;
            }

            const newFormGroup = new FormGroup(controls, handle, validator);

            newFormGroup.update = prevForm.update;
            newFormGroup.lastUpdated = lastUpdated;

            return newFormGroup;
        });
    };

    formGroup.update = updateForm;

    return [formGroup];
}