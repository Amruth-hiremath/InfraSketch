import axios from 'axios';
import useAuthStore from '../hooks/useAuth';

const API_URL = 'http://localhost:5000/api/diagrams';

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const getPublicDiagram = async (id) => {
  const { data } = await axios.get(`${API_URL}/public/${id}`);
  return data;
};

export const toggleDiagramVisibility = async (id) => {
  const { data } = await axios.patch(
    `${API_URL}/${id}/visibility`,
    {},
    getAuthHeaders()
  );
  return data;
};

export const saveDiagram = async (diagramData) => {
  try {
    if (
      diagramData.id &&
      typeof diagramData.id === "string" &&
      !diagramData.id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      diagramData.id = null;
    }

    if (diagramData.id) {
      // FIX: Update existing diagram
      const { data } = await axios.put(`${API_URL}/${diagramData.id}`, diagramData, getAuthHeaders());
      return data;
    } else {
      // Create new diagram
      const { data } = await axios.post(API_URL, diagramData, getAuthHeaders());
      return data;
    }
  } catch (error) {
    console.error('Error saving diagram:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getUserDiagrams = async () => {
  try {
    const { data } = await axios.get(API_URL, getAuthHeaders());
    return data;
  } catch (error) {
    console.error('Error fetching diagrams:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getDiagramById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return data;
  } catch (error) {
    console.error(`Error fetching diagram ${id}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

export const updateDiagramName = async (id, name) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/${id}`,
      { name },
      getAuthHeaders()
    );
    return data;
  } catch (error) {
    console.error('Error renaming diagram:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteDiagram = async (id) => {
  try {
    const { data } = await axios.delete(
      `${API_URL}/${id}`,
      getAuthHeaders()
    );
    return data;
  } catch (error) {
    console.error('Error deleting diagram:', error.response?.data?.message || error.message);
    throw error;
  }
};