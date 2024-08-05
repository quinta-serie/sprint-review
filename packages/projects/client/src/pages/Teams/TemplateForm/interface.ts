import { TemplateWithEditableData } from '@/services/template';

export type TemplateFormData = Omit<TemplateWithEditableData, 'id' | 'teamId' | 'isDefault'> & { timer: number };