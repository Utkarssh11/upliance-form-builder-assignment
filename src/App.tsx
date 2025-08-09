import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import FormBuilder from './pages/FormBuilder';
import FormPreview from './pages/FormPreview';
import MyForms from './pages/MyForms';
import { store } from './store';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <Layout>
              <Routes>
                <Route path="/create" element={<FormBuilder />} />
                <Route path="/preview" element={<FormPreview />} />
                <Route path="/preview/:formId" element={<FormPreview />} />
                <Route path="/myforms" element={<MyForms />} />
                <Route path="/" element={<MyForms />} />
              </Routes>
            </Layout>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
