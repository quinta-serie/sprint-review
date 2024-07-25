import type { TemplateData } from '@/services/template';
import { FormControl, useForm } from '@/components/Form';

import type { TemplateFormData } from './interface';

export default function useTemplateForm(template: TemplateData, submit?: (data: TemplateFormData) => void) {
    const {
        name,
        columns,
        maxVotesPerCard,
        maxVotesPerUser,
        shouldShowCardsAutor,
        shouldHideCardsInitially
    } = template;

    const [formGroup] = useForm<TemplateFormData>({
        form: {
            name: new FormControl({ value: name, required: true }),
            columns: new FormControl({ value: columns }),
            maxVotesPerCard: new FormControl({ value: maxVotesPerCard }),
            maxVotesPerUser: new FormControl({ value: maxVotesPerUser }),
            shouldShowCardsAutor: new FormControl({ value: shouldShowCardsAutor }),
            shouldHideCardsInitially: new FormControl({ value: shouldHideCardsInitially }),
        },
        handle: {
            submit: (form) => { submit && submit(form.values); }
        },
        validator: {
            columns: (form) => {
                const { columns } = form.values;

                if (!columns.length) { return 'É necessário ao menos uma coluna'; }
            }
        }
    }, []);

    return formGroup;
}