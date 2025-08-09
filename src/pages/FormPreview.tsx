import { ArrowBack, CheckCircle } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Paper,
    Snackbar,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import FormFieldRenderer from '../components/FormFieldRenderer';
import { loadForm, setValidationErrors, updateFormData } from '../store/formSlice';
import { RootState } from '../types';
import { updateDerivedFields } from '../utils/derivedFields';
import { validateForm } from '../utils/validation';

const FormPreview: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formId } = useParams();
  const { currentForm, formData, validationErrors } = useSelector((state: RootState) => state.form);
  
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (formId) {
      dispatch(loadForm(formId));
    }
  }, [formId, dispatch]);

  useEffect(() => {
    if (currentForm) {
      const updatedData = updateDerivedFields(currentForm.fields, formData);
      
      Object.keys(updatedData).forEach(fieldId => {
        if (formData[fieldId] !== updatedData[fieldId]) {
          dispatch(updateFormData({ fieldId, value: updatedData[fieldId] }));
        }
      });
    }
  }, [currentForm, formData, dispatch]);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updateFormData({ fieldId, value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentForm) return;

    const errors = validateForm(currentForm.fields, formData);
    dispatch(setValidationErrors(errors));

    if (errors.length === 0) {
      setSubmitSuccess(true);
      console.log('Form submitted successfully:', formData);
    }
  };

  const getFieldError = (fieldId: string) => {
    return validationErrors.find(error => error.fieldId === fieldId)?.message;
  };

  if (!currentForm) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Form Preview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          No form selected for preview. Please create a form first or select one from My Forms.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={() => navigate('/myforms')}>
            My Forms
          </Button>
          <Button variant="contained" onClick={() => navigate('/create')}>
            Create Form
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/myforms')}
          sx={{ mr: 2 }}
        >
          Back to My Forms
        </Button>
        <Typography variant="h4">
          {currentForm.name}
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {currentForm.fields
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  error={getFieldError(field.id)}
                />
              ))}

            {currentForm.fields.length === 0 && (
              <Alert severity="info">
                This form has no fields yet. Add some fields in the form builder.
              </Alert>
            )}

            {currentForm.fields.length > 0 && (
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<CheckCircle />}
                >
                  Submit Form
                </Button>
              </Box>
            )}
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={submitSuccess}
        autoHideDuration={6000}
        onClose={() => setSubmitSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSubmitSuccess(false)} severity="success">
          Form submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormPreview;
