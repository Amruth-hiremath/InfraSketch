import { create } from 'zustand';

export const useModal = create((set) => ({
  modal: null,

  openModal: (modalConfig) => set({ modal: modalConfig }),

  closeModal: () => set({ modal: null }),
}));