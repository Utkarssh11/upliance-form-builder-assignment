import {
    Add,
    Delete,
    DragIndicator,
    Edit,
    Preview,
    Save,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FieldConfigModal from '../components/FieldConfigModal';
import {
    addField,
    createNewForm,
    deleteField,
    reorderFields,
    saveForm,
    updateField,
} from '../store/formSlice';
import { FormField, RootState } from '../types';

const FormBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm, isEditing } = useSelector((state: RootState) => state.form);

  const [fieldConfigOpen, setFieldConfigOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | undefined>();
  const [formNameDialogOpen, setFormNameDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleCreateForm = () => {
    setFormNameDialogOpen(true);
  };

  const handleFormNameSubmit = () => {
    if (formName.trim()) {
      dispatch(createNewForm(formName.trim()));
      setFormNameDialogOpen(false);
      setFormName('');
    }
  };

  const handleAddField = () => {
    setEditingField(undefined);
    setFieldConfigOpen(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setFieldConfigOpen(true);
  };

  const handleSaveField = (fieldData: Omit<FormField, 'id' | 'order'>) => {
    if (editingField) {
      dispatch(updateField({ fieldId: editingField.id, updates: fieldData }));
    } else {
      dispatch(addField(fieldData));
    }
    setFieldConfigOpen(false);
  };

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId));
  };

  const handleSaveForm = () => {
    dispatch(saveForm());
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      dispatch(reorderFields({ fromIndex: draggedIndex, toIndex: dropIndex }));
    }
    setDraggedIndex(null);
  };

  if (!currentForm) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Form Builder
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Create a new form to get started
        </Typography>
        <Button variant="contained" size="large" onClick={handleCreateForm}>
          Create New Form
        </Button>

        <Dialog open={formNameDialogOpen} onClose={() => setFormNameDialogOpen(false)}>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="Form Name"
              fullWidth
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormNameDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleFormNameSubmit} variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Editing: {currentForm.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Preview />}
            onClick={handlePreview}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveForm}
            disabled={!isEditing}
          >
            Save Form
          </Button>
        </Box>
      </Box>

      {currentForm.fields.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No fields added yet. Click "Add Field" to start building your form.
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddField}
        >
          Add Field
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {currentForm.fields
          .sort((a, b) => a.order - b.order)
          .map((field, index) => (
            <Card
              key={field.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              sx={{
                cursor: 'move',
                opacity: draggedIndex === index ? 0.5 : 1,
                '&:hover': { boxShadow: 2 },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DragIndicator color="action" />
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {field.label}
                  </Typography>
                  <Chip label={field.type} size="small" />
                  {field.required && <Chip label="Required" size="small" color="error" />}
                  {field.isDerived && <Chip label="Derived" size="small" color="secondary" />}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Type: {field.type}
                  {field.defaultValue && ` • Default: ${field.defaultValue}`}
                  {field.validationRules.length > 0 && ` • ${field.validationRules.length} validation rules`}
                  {field.options && ` • ${field.options.length} options`}
                </Typography>

                {field.isDerived && field.derivedFormula && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Derived from: {field.derivedFormula.parentFields.length} field(s) • 
                    Type: {field.derivedFormula.type}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEditField(field)} size="small">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteField(field.id)} size="small" color="error">
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          ))}
      </Box>

      <FieldConfigModal
        open={fieldConfigOpen}
        onClose={() => setFieldConfigOpen(false)}
        onSave={handleSaveField}
        field={editingField}
        existingFields={currentForm.fields}
      />
    </Box>
  );
};

export default FormBuilder;
