import { FormData, FormField, ValidationError } from '../types';

export const validateField = (field: FormField, value: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const rule of field.validationRules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push({ fieldId: field.id, message: rule.message });
        }
        break;
      
      case 'minLength':
        if (value && typeof value === 'string' && value.length < (rule.value as number)) {
          errors.push({ fieldId: field.id, message: rule.message });
        }
        break;
      
      case 'maxLength':
        if (value && typeof value === 'string' && value.length > (rule.value as number)) {
          errors.push({ fieldId: field.id, message: rule.message });
        }
        break;
      
      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push({ fieldId: field.id, message: rule.message });
          }
        }
        break;
      
      case 'password':
        if (value && typeof value === 'string') {
          const hasNumber = /\d/.test(value);
          const isMinLength = value.length >= 8;
          if (!hasNumber || !isMinLength) {
            errors.push({ fieldId: field.id, message: rule.message });
          }
        }
        break;
    }
  }

  return errors;
};

export const validateForm = (fields: FormField[], formData: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  fields.forEach(field => {
    if (!field.isDerived) {
      const fieldErrors = validateField(field, formData[field.id]);
      errors.push(...fieldErrors);
    }
  });

  return errors;
};
