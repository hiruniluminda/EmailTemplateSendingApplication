import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8080';
const TEMPLATE_API_URL = 'http://localhost:8082/api';
const EMAIL_API_URL = 'http://localhost:8082/api';

const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

const templateApi = axios.create({
  baseURL: TEMPLATE_API_URL,
});

const emailApi = axios.create({
  baseURL: EMAIL_API_URL,
});

const setupInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      if (error.response && error.response.status === 401) {
        console.error('Authentication token expired or invalid');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );
};

// Apply interceptors to all API instances
setupInterceptors(authApi);
setupInterceptors(templateApi);
setupInterceptors(emailApi);

// Template services
const templateService = {
  getAllTemplates: () => templateApi.get('/templates'),
  getTemplateById: (id) => templateApi.get(`/templates/${id}`),
  createTemplate: (templateData) => templateApi.post('/templates', templateData),
  updateTemplate: (id, templateData) => templateApi.put(`/templates/${id}`, templateData),
  deleteTemplate: (id) => templateApi.delete(`/templates/${id}`),
  searchTemplates: (name) => templateApi.get(`/templates/search?name=${name}`),
  
  sendEmail: (templateId, emailData) => {
    console.log(`Sending email using template ID: ${templateId}`, emailData);
    console.log(`Request URL: ${EMAIL_API_URL}/emails/send/${templateId}`);
    
    return emailApi.post(`/emails/send/${templateId}`, emailData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  getTemplateWithFallback: async (id) => {
    try {
      const response = await templateApi.get(`/templates/${id}`);
      console.log('Template found in TempService:', response.data);
      return response;
    } catch (tempErr) {
      console.log('Template not found in TempService, trying EmailService...', tempErr);
      
      try {
        const response = await emailApi.get(`/templates/${id}`);
        console.log('Template found in EmailService:', response.data);
        return response;
      } catch (emailErr) {
        console.error('Template not found in EmailService either:', emailErr);
        throw new Error('Template not found in either service');
      }
    }
  }
};

// Auth services
const authService = {
  login: (credentials) => authApi.post('/auth/login', credentials),
  register: (userData) => authApi.post('/auth/create', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  validateToken: () => authApi.get('/auth/validate-token'),
};

export { 
  templateApi,
  emailApi,
  templateService, 
  authService 
};