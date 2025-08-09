import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import React from 'react';
import { FormField } from '../types';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const handleChange = (event: any) => {
    const newValue = event.target ? event.target.value : event;
    onChange(newValue);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const commonProps = {
    fullWidth: true,
    margin: 'normal' as const,
    error: !!error,
    helperText: error,
  };

  switch (field.type) {
    case 'text':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          disabled={field.isDerived}
        />
      );

    case 'number':
      return (
        <TextField
          {...commonProps}
          type="number"
          label={field.label}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          disabled={field.isDerived}
        />
      );

    case 'textarea':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          multiline
          rows={4}
          disabled={field.isDerived}
        />
      );

    case 'select':
      return (
        <FormControl {...commonProps}>
          <FormLabel>{field.label}</FormLabel>
          <Select
            value={value || ''}
            onChange={handleChange}
            displayEmpty
            disabled={field.isDerived}
          >
            <MenuItem value="">
              <em>Select an option</em>
            </MenuItem>
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      );

    case 'radio':
      return (
        <FormControl {...commonProps}>
          <FormLabel>{field.label}</FormLabel>
          <RadioGroup
            value={value || ''}
            onChange={handleChange}
          >
            {field.options?.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio disabled={field.isDerived} />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      );

    case 'checkbox':
      return (
        <Box sx={{ mt: 2, mb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={value || false}
                onChange={handleCheckboxChange}
                disabled={field.isDerived}
              />
            }
            label={field.label}
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </Box>
      );

    case 'date':
      return (
        <DatePicker
          label={field.label}
          value={value ? dayjs(value) : null}
          onChange={(newValue) => onChange(newValue ? newValue.format('YYYY-MM-DD') : '')}
          disabled={field.isDerived}
          slotProps={{
            textField: {
              ...commonProps,
              required: field.required,
            },
          }}
        />
      );

    default:
      return null;
  }
};

export default FormFieldRenderer;
