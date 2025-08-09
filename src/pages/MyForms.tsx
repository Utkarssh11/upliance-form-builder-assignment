import { Add, Edit, Visibility } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Grid,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadForm } from '../store/formSlice';
import { RootState } from '../types';

const MyForms: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedForms } = useSelector((state: RootState) => state.form);

  const handlePreviewForm = (formId: string) => {
    navigate(`/preview/${formId}`);
  };

  const handleEditForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/create');
  };

  const handleCreateNewForm = () => {
    navigate('/create');
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          My Forms
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateNewForm}
        >
          Create New Form
        </Button>
      </Box>

      {savedForms.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert severity="info" sx={{ mb: 4 }}>
            You haven't created any forms yet.
          </Alert>
          <Typography variant="h6" gutterBottom>
            Get started by creating your first form
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Build dynamic forms with validation, derived fields, and more.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleCreateNewForm}
          >
            Create Your First Form
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {savedForms.length} form{savedForms.length !== 1 ? 's' : ''} saved
          </Typography>

          <Grid container spacing={3}>
            {savedForms
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((form) => (
                <Grid item xs={12} sm={6} md={4} key={form.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {form.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Created: {formatDate(form.createdAt)}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}
                          size="small"
                          variant="outlined"
                        />
                        {form.fields.some(f => f.required) && (
                          <Chip
                            label="Has required fields"
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        )}
                        {form.fields.some(f => f.isDerived) && (
                          <Chip
                            label="Has derived fields"
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        {form.fields.length === 0
                          ? 'No fields added yet'
                          : `Field types: ${Array.from(new Set(form.fields.map(f => f.type))).join(', ')}`
                        }
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handlePreviewForm(form.id)}
                      >
                        Preview
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditForm(form.id)}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default MyForms;
