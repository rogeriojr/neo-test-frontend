import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  autenticaFaExterno,
  logout as apiLogout,
  verificaAutenticacaoExterno,
  recuperarSenhaFaExterno,
  auth2Externo,
  validarAuth2Externo,
  gerarDesafioAuth2Externo,
  validarDesafioAuth2Externo,
} from '../services/api';

interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, senha: string) => Promise<any>;
  logout: () => void;
  verificarAutenticacao: (lang?: string) => Promise<boolean>;
  recuperarSenha: (email: string, lang?: string) => Promise<any>;
  gerarDesafioQRCode: (email: string, lang?: string) => Promise<{ desafio: string }>;
  validarDesafioQRCode: (desafio: string, numero_serie: string, lang?: string) => Promise<boolean>;
  gerarDesafioApp: (mdi: number | string, numero_serie: string, lang?: string) => Promise<{ desafio: string }>;
  validarDesafioApp: (desafio: string, email: string, mdi: number | string, lang?: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, senha: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await autenticaFaExterno({ email, senha });

          if (response && response.retorno && response.dados && response.dados.token) {
            const userData = {
              id: response.dados.codigo,
              nome: response.dados.nome,
              email: response.dados.email,
            };

            set({
              token: response.dados.token,
              isAuthenticated: true,
              user: userData,
              isLoading: false,
            });

            return response;
          } else {
            throw new Error(response.descricao || response.erro || 'Credenciais inválidas');
          }
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Erro ao realizar login' });
          throw err;
        }
      },

      logout: () => {
        try {
          apiLogout();
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            error: null,
          });
        } catch (err: any) {
          set({ error: err.message || 'Erro ao realizar logout' });
        }
      },

      verificarAutenticacao: async (lang?: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await verificaAutenticacaoExterno(lang);
          set({ isLoading: false });
          return response.retorno;
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Erro ao verificar autenticação' });
          return false;
        }
      },

      recuperarSenha: async (email: string, lang?: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await recuperarSenhaFaExterno(email, lang);
          set({ isLoading: false });
          return response;
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Erro ao recuperar senha' });
          throw err;
        }
      },

      gerarDesafioQRCode: async (email: string, lang?: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await auth2Externo(email, lang);
          set({ isLoading: false });
          return { desafio: response.dados?.desafio || '' };
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Erro ao gerar desafio QR Code' });
          throw err;
        }
      },

      validarDesafioQRCode: async (desafio: string, numero_serie: string, lang?: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await validarAuth2Externo({ desafio, numero_serie, lang });
          set({ isLoading: false });
          return response.retorno;
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Erro ao validar desafio QR Code' });
          return false;
        }
      },

      gerarDesafioApp: async (mdi: number | string, numero_serie: string, lang?: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await gerarDesafioAuth2Externo(mdi, numero_serie, lang);
          set({ isLoading: false });
          return { desafio: response.dados?.desafio || '' };
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Erro ao gerar desafio para aplicativo' });
          throw err;
        }
      },

      validarDesafioApp: async (desafio: string, email: string, mdi: number | string, lang?: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await validarDesafioAuth2Externo({ desafio, email, mdi, lang });
          set({ isLoading: false });
          return response.retorno;
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Erro ao validar desafio para aplicativo' });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: '@NeoIdea:auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);