import axios from './axiosInstance';
import useAuthStore from '../hooks/useAuth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_URL = `${BASE_URL}/api/templates`;

// GET all user templates
export const getUserTemplates = async () => {
  try {
    const { data } = await axios.get(API_URL);
    return data;
  } catch (error) {
    console.error('Error fetching templates:', error.response?.data?.message || error.message);
    throw error;
  }
};


// CREATE template
export const createTemplate = async (templateData) => {
  try {
    const { data } = await axios.post(API_URL, templateData, getAuthHeaders());
    return data;
  } catch (error) {
    console.error('Error creating template:', error.response?.data?.message || error.message);
    throw error;
  }
};


// DELETE template
export const deleteTemplate = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return data;
  } catch (error) {
    console.error('Error deleting template:', error.response?.data?.message || error.message);
    throw error;
  }
};

// UPDATE template name for custom templates
export const updateTemplateName = async (id, name) => {
  const { data } = await axios.put(
    `${API_URL}/${id}`,
    { name },
    getAuthHeaders()
  );
  return data;
};