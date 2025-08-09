import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, FormSchema, FormState, ValidationError } from '../types';

const loadSavedForms = (): FormSchema[] => {
  try {
    const saved = localStorage.getItem('savedForms');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveForms = (forms: FormSchema[]) => {
  localStorage.setItem('savedForms', JSON.stringify(forms));
};

const initialState: FormState = {
  currentForm: null,
  savedForms: loadSavedForms(),
  formData: {},
  validationErrors: [],
  isEditing: false,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    createNewForm: (state, action: PayloadAction<string>) => {
      const newForm: FormSchema = {
        id: Date.now().toString(),
        name: action.payload,
        fields: [],
        createdAt: new Date().toISOString(),
      };
      state.currentForm = newForm;
      state.isEditing = true;
      state.formData = {};
      state.validationErrors = [];
    },
    
    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>) => {
      if (!state.currentForm) return;
      
      const newField: FormField = {
        ...action.payload,
        id: Date.now().toString(),
        order: state.currentForm.fields.length,
      };
      
      state.currentForm.fields.push(newField);
    },
    
    updateField: (state, action: PayloadAction<{ fieldId: string; updates: Partial<FormField> }>) => {
      if (!state.currentForm) return;
      
      const fieldIndex = state.currentForm.fields.findIndex(f => f.id === action.payload.fieldId);
      if (fieldIndex !== -1) {
        state.currentForm.fields[fieldIndex] = {
          ...state.currentForm.fields[fieldIndex],
          ...action.payload.updates,
        };
      }
    },
    
    deleteField: (state, action: PayloadAction<string>) => {
      if (!state.currentForm) return;
      
      state.currentForm.fields = state.currentForm.fields
        .filter(f => f.id !== action.payload)
        .map((f, index) => ({ ...f, order: index }));
    },
    
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      if (!state.currentForm) return;
      
      const { fromIndex, toIndex } = action.payload;
      const fields = [...state.currentForm.fields];
      const [movedField] = fields.splice(fromIndex, 1);
      fields.splice(toIndex, 0, movedField);
      
      state.currentForm.fields = fields.map((f, index) => ({ ...f, order: index }));
    },
    
    saveForm: (state) => {
      if (!state.currentForm) return;
      
      const existingIndex = state.savedForms.findIndex(f => f.id === state.currentForm!.id);
      if (existingIndex !== -1) {
        state.savedForms[existingIndex] = { ...state.currentForm };
      } else {
        state.savedForms.push({ ...state.currentForm });
      }
      
      saveForms(state.savedForms);
      state.isEditing = false;
    },
    
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = { ...form };
        state.formData = {};
        state.validationErrors = [];
        state.isEditing = false;
      }
    },
    
    updateFormData: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      state.formData[action.payload.fieldId] = action.payload.value;
    },
    
    setValidationErrors: (state, action: PayloadAction<ValidationError[]>) => {
      state.validationErrors = action.payload;
    },
    
    clearForm: (state) => {
      state.currentForm = null;
      state.formData = {};
      state.validationErrors = [];
      state.isEditing = false;
    },
  },
});

export const {
  createNewForm,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadForm,
  updateFormData,
  setValidationErrors,
  clearForm,
} = formSlice.actions;

export default formSlice.reducer;
