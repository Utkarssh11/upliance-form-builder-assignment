import { Add, Delete } from '@mui/icons-material';
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DerivedFieldFormula, FieldType, FormField, SelectOption, ValidationRule } from '../types';

interface FieldConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (field: Omit<FormField, 'id' | 'order'>) => void;
  field?: FormField;
  existingFields: FormField[];
}

const fieldTypes: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
];

const validationTypes = [
  { value: 'required', label: 'Required' },
  { value: 'minLength', label: 'Minimum Length' },
  { value: 'maxLength', label: 'Maximum Length' },
  { value: 'email', label: 'Email Format' },
  { value: 'password', label: 'Password (8+ chars with number)' },
];

const FieldConfigModal: React.FC<FieldConfigModalProps> = ({
  open,
  onClose,
  onSave,
  field,
  existingFields,
}) => {
  const [formData, setFormData] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    required: false,
    defaultValue: '',
    validationRules: [],
    options: [],
    isDerived: false,
  });

  const [options, setOptions] = useState<SelectOption[]>([]);
  const [newOption, setNewOption] = useState({ label: '', value: '' });
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [derivedFormula, setDerivedFormula] = useState<DerivedFieldFormula>({
    parentFields: [],
    formula: '',
    type: 'age',
  });

  useEffect(() => {
    if (field) {
      setFormData(field);
      setOptions(field.options || []);
      setValidationRules(field.validationRules || []);
      setDerivedFormula(field.derivedFormula || {
        parentFields: [],
        formula: '',
        type: 'age',
      });
    } else {
      setFormData({
        type: 'text',
        label: '',
        required: false,
        defaultValue: '',
        validationRules: [],
        options: [],
        isDerived: false,
      });
      setOptions([]);
      setValidationRules([]);
      setDerivedFormula({
        parentFields: [],
        formula: '',
        type: 'age',
      });
    }
  }, [field, open]);

  const handleSave = () => {
    const fieldData: Omit<FormField, 'id' | 'order'> = {
      ...formData,
      validationRules,
      options: ['select', 'radio'].includes(formData.type!) ? options : undefined,
      derivedFormula: formData.isDerived ? derivedFormula : undefined,
    } as Omit<FormField, 'id' | 'order'>;

    onSave(fieldData);
    onClose();
  };

  const addOption = () => {
    if (newOption.label && newOption.value) {
      setOptions([...options, newOption]);
      setNewOption({ label: '', value: '' });
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const addValidationRule = (type: string) => {
    const rule: ValidationRule = {
      type: type as ValidationRule['type'],
      message: `${type} validation failed`,
      value: type === 'minLength' || type === 'maxLength' ? 1 : undefined,
    };
    setValidationRules([...validationRules, rule]);
  };

  const removeValidationRule = (index: number) => {
    setValidationRules(validationRules.filter((_, i) => i !== index));
  };

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    const updated = [...validationRules];
    updated[index] = { ...updated[index], ...updates };
    setValidationRules(updated);
  };

  const availableParentFields = existingFields.filter(f => !f.isDerived && f.id !== field?.id);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{field ? 'Edit Field' : 'Add Field'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Field Label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            fullWidth
          />

          <FormControl fullWidth>
            <FormLabel>Field Type</FormLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as FieldType })}
            >
              {fieldTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              />
            }
            label="Required Field"
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isDerived}
                onChange={(e) => setFormData({ ...formData, isDerived: e.target.checked })}
              />
            }
            label="Derived Field"
          />

          {!formData.isDerived && (
            <TextField
              label="Default Value"
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
              fullWidth
            />
          )}

          {formData.isDerived && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Derived Field Configuration
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>Formula Type</FormLabel>
                <Select
                  value={derivedFormula.type}
                  onChange={(e) => setDerivedFormula({ ...derivedFormula, type: e.target.value as any })}
                >
                  <MenuItem value="age">Age from Date of Birth</MenuItem>
                  <MenuItem value="sum">Sum of Numbers</MenuItem>
                  <MenuItem value="custom">Custom Formula</MenuItem>
                </Select>
              </FormControl>

              <Autocomplete
                multiple
                options={availableParentFields}
                getOptionLabel={(option) => option.label}
                value={availableParentFields.filter(f => derivedFormula.parentFields.includes(f.id))}
                onChange={(_, newValue) => {
                  setDerivedFormula({
                    ...derivedFormula,
                    parentFields: newValue.map(f => f.id),
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Parent Fields" />
                )}
                sx={{ mb: 2 }}
              />

              {derivedFormula.type === 'custom' && (
                <TextField
                  label="Custom Formula"
                  value={derivedFormula.formula}
                  onChange={(e) => setDerivedFormula({ ...derivedFormula, formula: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
                  helperText="Use field names in lowercase with underscores (e.g., first_name + last_name)"
                />
              )}
            </Box>
          )}

          {['select', 'radio'].includes(formData.type!) && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Options
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Option Label"
                  value={newOption.label}
                  onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                />
                <TextField
                  label="Option Value"
                  value={newOption.value}
                  onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                />
                <Button onClick={addOption} startIcon={<Add />}>
                  Add
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {options.map((option, index) => (
                  <Chip
                    key={index}
                    label={`${option.label} (${option.value})`}
                    onDelete={() => removeOption(index)}
                  />
                ))}
              </Box>
            </Box>
          )}

          {!formData.isDerived && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Validation Rules
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {validationTypes.map((type) => (
                  <Button
                    key={type.value}
                    size="small"
                    onClick={() => addValidationRule(type.value)}
                    disabled={validationRules.some(rule => rule.type === type.value)}
                  >
                    Add {type.label}
                  </Button>
                ))}
              </Box>

              {validationRules.map((rule, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                  <TextField
                    label="Error Message"
                    value={rule.message}
                    onChange={(e) => updateValidationRule(index, { message: e.target.value })}
                    size="small"
                    fullWidth
                  />
                  {(rule.type === 'minLength' || rule.type === 'maxLength') && (
                    <TextField
                      label="Value"
                      type="number"
                      value={rule.value || ''}
                      onChange={(e) => updateValidationRule(index, { value: parseInt(e.target.value) })}
                      size="small"
                      sx={{ width: 100 }}
                    />
                  )}
                  <IconButton onClick={() => removeValidationRule(index)} size="small">
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldConfigModal;
