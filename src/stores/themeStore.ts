import { create } from 'zustand';
import { getLayoutExterno } from '../services/api';
import { LayoutData } from '../types';

interface ThemeState {
  layout: LayoutData;
  isLoading: boolean;
  error: string | null;
  fetchLayout: () => Promise<void>;
}


const defaultTheme: LayoutData = {
  nome: "Neo Idea",
  background: "",
  corBackground: "#000000",
  logo: "",
  text: "#ffffff",
  text2: "#f5f5f5",
  color: "#333333",
  color2: "#444444",
  box: "#1e1e1e",
};

export const useThemeStore = create<ThemeState>((set) => {
  const fetchLayoutOnInit = async () => {
    try {
      const data = await getLayoutExterno();
      if (data && data.retorno && data.dados) {
        set({ layout: data.dados, isLoading: false, error: null });
      } else {
        throw new Error(data.descricao || data.erro || 'Erro ao carregar layout');
      }
    } catch (err: any) {
      console.error("Erro ao carregar layout:", err);
      set({
        isLoading: false,
        error: err.message || "Não foi possível carregar o layout do sistema.",
        layout: defaultTheme
      });
    }
  };

  fetchLayoutOnInit();

  return {
    layout: defaultTheme,
    isLoading: true,
    error: null,

    fetchLayout: async () => {
      try {
        set({ isLoading: true });
        const data = await getLayoutExterno();
        if (data && data.retorno && data.dados) {
          set({ layout: data.dados, isLoading: false, error: null });
        } else {
          throw new Error(data.descricao || data.erro || 'Erro ao carregar layout');
        }
      } catch (err: any) {
        console.error("Erro ao carregar layout:", err);
        set({
          isLoading: false,
          error: err.message || "Não foi possível carregar o layout do sistema."
        });
      }
    },
  };
});