import dayjs from 'dayjs';
import { DerivedFieldFormula, FormData, FormField } from '../types';

export const calculateDerivedValue = (
  formula: DerivedFieldFormula,
  formData: FormData,
  allFields: FormField[]
): any => {
  const { parentFields, type, formula: formulaString } = formula;

  const parentValues = parentFields.map(fieldId => formData[fieldId]).filter(val => val !== undefined && val !== null && val !== '');

  if (parentValues.length === 0) {
    return '';
  }

  switch (type) {
    case 'age':
      if (parentValues.length === 1 && parentValues[0]) {
        const birthDate = dayjs(parentValues[0]);
        const today = dayjs();
        return today.diff(birthDate, 'year');
      }
      return '';

    case 'sum':
      return parentValues.reduce((sum, val) => {
        const num = parseFloat(val);
        return isNaN(num) ? sum : sum + num;
      }, 0);

    case 'custom':
      try {
        let expression = formulaString;
        
        parentFields.forEach((fieldId, index) => {
          const field = allFields.find(f => f.id === fieldId);
          const fieldName = field ? field.label.toLowerCase().replace(/\s+/g, '_') : `field_${index}`;
          const value = formData[fieldId] || 0;
          const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
          expression = expression.replace(new RegExp(`\\b${fieldName}\\b`, 'g'), numValue.toString());
        });

        expression = expression.replace(/[^0-9+\-*/().\s]/g, '');
        
        // eslint-disable-next-line no-new-func
        const result = Function('"use strict"; return (' + expression + ')')();
        return isNaN(result) ? '' : result;
      } catch {
        return '';
      }

    default:
      return '';
  }
};

export const updateDerivedFields = (
  fields: FormField[],
  formData: FormData
): FormData => {
  const updatedData = { ...formData };

  fields.forEach(field => {
    if (field.isDerived && field.derivedFormula) {
      updatedData[field.id] = calculateDerivedValue(field.derivedFormula, updatedData, fields);
    }
  });

  return updatedData;
};
