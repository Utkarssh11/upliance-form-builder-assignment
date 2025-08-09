export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password';
  value?: number | string;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DerivedFieldFormula {
  parentFields: string[];
  formula: string;
  type: 'age' | 'sum' | 'custom';
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: any;
  validationRules: ValidationRule[];
  options?: SelectOption[];
  isDerived?: boolean;
  derivedFormula?: DerivedFieldFormula;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormData {
  [fieldId: string]: any;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}

export interface FormState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
  formData: FormData;
  validationErrors: ValidationError[];
  isEditing: boolean;
}

export interface RootState {
  form: FormState;
}
