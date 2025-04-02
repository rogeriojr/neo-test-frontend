import { create } from "zustand";

// Store para gerenciar o estado do modal de perfil globalmente
export const useProfileModalStore = create<{
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));