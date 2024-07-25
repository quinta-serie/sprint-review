import FormControl from './formControl';

export type AbstractControl<T> = { [key in keyof T]: FormControl<T[key]> }

export type Validator<T> = { [key in keyof Partial<T>]: (form: FormGroup<T>) => string | undefined; }
export interface Handle<T> { change?: (form: FormGroup<T>) => void; submit?: (form: FormGroup<T>) => void; }

export default class FormGroup<F> {
    private _valid = false;
    private _update!: (values: Partial<F>) => void;

    public lastUpdated!: keyof F;

    constructor(
        public controls: AbstractControl<F>,
        public handle: Handle<F> = {},
        public validator: Validator<F> = {} as Validator<F>
    ) { this.validate(); }

    public get update() { return this._update; }
    public set update(fn: (values: Partial<F>) => any) {
        this._update = fn;
    }

    public get isValid(): boolean { return this._valid; }
    public set isValid(validity: boolean) { this._valid = validity; }

    public get errors() {
        return Object.values<FormControl<any>>(this.controls).filter(c => c.error);
    }

    public get values(): F {
        const values = {};

        this.eachControl((control, key) => ({ [key as string]: control.value }))
            .forEach(control => { for (const prop in control) { values[prop] = control[prop]; } });

        return values as F;
    }

    private eachControl(fn: (control: FormControl<F>, key?: string) => any) {
        return Object.keys(this.controls).map(k => fn(this.controls[k], k));
    }

    public submit() { this.isValid && this.handle.submit && this.handle.submit(this); }

    public setValues(partialForm: Partial<F>) { this.update(partialForm); }

    public dirty(): void {
        this.eachControl((control) => control.dirty = true);
        this.update(this.values);
    }

    public validate() {
        Object.keys(this.validator).forEach((key) => {
            this.controls[key].dirty = true;
            this.controls[key].error = this.validator[key](this);
        });

        this.isValid = !this.errors.length;
    }
}