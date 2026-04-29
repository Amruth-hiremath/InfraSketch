import { create } from 'zustand';
import axios from "../api/axiosInstance";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_URL = `${BASE_URL}/api/auth`;

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('infrasketch_token') || null,
  isAuthenticated: !!localStorage.getItem('infrasketch_token'),
  loading: false,

  firebaseLogin: async (firebaseToken) => {
    set({ loading: true });
    try {
      // Sending the Firebase token to the real backend
      const { data } = await axios.post(`${API_URL}/firebase`, { token: firebaseToken });

      localStorage.setItem('infrasketch_token', data.token);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false
      });

      return true;
    } catch (err) {
      console.error('Login Error:', err.response?.data?.message || err.message);
      set({ loading: false });
      return false;
    }
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;

    try {
      // Fetching the user using the saved local JWT token
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ user: data.user, isAuthenticated: true });
    } catch (err) {
      console.error('Session expired or invalid token');
      get().logout();
    }
  },

  logout: () => {
    localStorage.removeItem('infrasketch_token');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

export default useAuthStore;