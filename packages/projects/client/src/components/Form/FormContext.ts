import React from 'react';

import FormGroup from './formGroup';

export interface IFormContext {
    formGroup: FormGroup<any>;
}

export default React.createContext<IFormContext>({
    formGroup: new FormGroup({})
});