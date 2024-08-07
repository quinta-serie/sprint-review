import type { TemplateData } from '@/services/template';
import { FormControl, useForm } from '@/components/Form';

import type { TemplateFormData } from './interface';

export default function useTemplateForm(template: TemplateData, submit?: (data: TemplateFormData) => void) {
    const {
        name,
        columns,
        maxVotesPerCard,
        maxVotesPerUser,
        hideCardsAutor,
        hideCardsInitially
    } = template;

    const [formGroup] = useForm<TemplateFormData>({
        form: {
            columns: new FormControl({ value: columns }),
            timer: new FormControl({ value: 0 }),
            name: new FormControl({ value: name, required: true }),
            hideCardsAutor: new FormControl({ value: hideCardsAutor }),
            maxVotesPerCard: new FormControl({ value: maxVotesPerCard }),
            maxVotesPerUser: new FormControl({ value: maxVotesPerUser }),
            hideCardsInitially: new FormControl({ value: hideCardsInitially }),
        },
        handle: {
            submit: (form) => { submit && submit(form.values); }
        },
        validator: {
            maxVotesPerCard(form) {
                const { maxVotesPerCard, maxVotesPerUser } = form.values;

                if (maxVotesPerCard > maxVotesPerUser) {
                    // eslint-disable-next-line max-len
                    return 'A quantidade de votos individuais por card deve ser menor que a quantidade de votos por pessoa';
                }
            },
            columns: (form) => {
                const { columns } = form.values;

                if (!columns.length) { return 'É necessário ao menos uma coluna'; }

                if (columns.length > 3) { return 'Máximo de 3 colunas'; }
            }
        }
    }, []);

    return formGroup;
}