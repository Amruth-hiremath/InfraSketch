import { create } from 'zustand';

export const useToast = create((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Date.now();

    set((state) => ({
      toasts: [...state.toasts, { id, type: 'info', ...toast }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));