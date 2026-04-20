import { create } from 'zustand';

// Simulated API (only Firebase now)
const mockApi = {
  post: async (path, payload) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (path === '/api/auth/firebase') {
          resolve({
            data: {
              token: 'mock-jwt-token',
              user: {
                name: 'Firebase User',
                email: 'firebase@example.com',
                id: 'firebase123'
              }
            }
          });
        }
      }, 500);
    });
  },

  get: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: {
              name: 'Demo User',
              email: 'demo@example.com',
              id: 'demo123'
            }
          }
        });
      }, 500);
    });
  }
};

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('infrasketch_token') || null,
  isAuthenticated: !!localStorage.getItem('infrasketch_token'),
  loading: false,

  firebaseLogin: async (firebaseToken) => {
    set({ loading: true });
    try {
      const { data } = await mockApi.post('/api/auth/firebase', { token: firebaseToken });

      localStorage.setItem('infrasketch_token', data.token);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false
      });

      return true;
    } catch {
      set({ loading: false });
      return false;
    }
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;

    try {
      const { data } = await mockApi.get('/api/auth/me');
      set({ user: data.user, isAuthenticated: true });
    } catch {
      get().logout();
    }
  },

  logout: () => {
    localStorage.removeItem('infrasketch_token');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

export default useAuthStore;