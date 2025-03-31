import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  autenticaFaExterno,
  logout as apiLogout,
  verificaAutenticacaoExterno,
  recuperarSenhaFaExterno,
  auth2Externo,
  validarAuth2Externo,
  gerarDesafioAuth2Externo,
  validarDesafioAuth2Externo,
} from "../services/api";
import {
  AuthContextType,
  Auth2ValidateData,
  Auth2ValidateWithEmailData,
} from "../types";

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
  error: null,
  verificarAutenticacao: async () => true,
  recuperarSenha: async () => {},
  gerarDesafioQRCode: async () => ({ desafio: "" }),
  validarDesafioQRCode: async () => true,
  gerarDesafioApp: async () => ({ desafio: "" }),
  validarDesafioApp: async () => true,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("@NeoIdea:token");
    const storedUser = localStorage.getItem("@NeoIdea:user");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await autenticaFaExterno({ email, senha });

      if (
        response &&
        response.retorno &&
        response.dados &&
        response.dados.token
      ) {
        setToken(response.dados.token);
        setIsAuthenticated(true);

        const userData = {
          id: response.dados.codigo,
          nome: response.dados.nome,
          email: response.dados.email,
        };
        setUser(userData);

        return response;
      } else {
        throw new Error(
          response.descricao ||
            response.erro ||
            response.erro ||
            "Credenciais inválidas"
        );
      }
    } catch (err: any) {
      setError(err.message || "Erro ao realizar login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const verificarAutenticacao = async (lang?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await verificaAutenticacaoExterno(lang);
      return response.retorno;
    } catch (err: any) {
      setError(err.message || "Erro ao verificar autenticação");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const recuperarSenha = async (
    email: string,
    lang?: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await recuperarSenhaFaExterno(email, lang);

      if (!response.retorno) {
        throw new Error(
          response.descricao ||
            response.erro ||
            response.erro ||
            "Erro ao recuperar senha"
        );
      }
    } catch (err: any) {
      setError(err.message || "Erro ao recuperar senha");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const gerarDesafioQRCode = async (
    email: string,
    lang?: string
  ): Promise<{ desafio: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await auth2Externo(email, lang);

      if (response.retorno && response.dados && response.dados.desafio) {
        return { desafio: response.dados.desafio };
      } else {
        throw new Error(
          response.descricao || response.erro || "Erro ao gerar desafio QR Code"
        );
      }
    } catch (err: any) {
      setError(err.message || "Erro ao gerar desafio QR Code");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const validarDesafioQRCode = async (
    desafio: string,
    numero_serie: string,
    lang?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const data: Auth2ValidateData = {
        desafio,
        numero_serie,
        lang,
      };

      const response = await validarAuth2Externo(data);
      return response.retorno;
    } catch (err: any) {
      setError(err.message || "Erro ao validar desafio QR Code");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const gerarDesafioApp = async (
    mdi: number | string,
    numero_serie: string,
    lang?: string
  ): Promise<{ desafio: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await gerarDesafioAuth2Externo(mdi, numero_serie, lang);

      if (response.retorno && response.dados && response.dados.desafio) {
        return { desafio: response.dados.desafio };
      } else {
        throw new Error(
          response.descricao ||
            response.erro ||
            "Erro ao gerar desafio para aplicativo"
        );
      }
    } catch (err: any) {
      setError(err.message || "Erro ao gerar desafio para aplicativo");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const validarDesafioApp = async (
    desafio: string,
    email: string,
    mdi: number | string,
    lang?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const data: Auth2ValidateWithEmailData = {
        desafio,
        email,
        mdi,
        lang,
      };

      const response = await validarDesafioAuth2Externo(data);
      return response.retorno;
    } catch (err: any) {
      setError(err.message || "Erro ao validar desafio para aplicativo");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
        isLoading,
        error,
        verificarAutenticacao,
        recuperarSenha,
        gerarDesafioQRCode,
        validarDesafioQRCode,
        gerarDesafioApp,
        validarDesafioApp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
