import axios from 'axios';
import { ApiResponse } from '../types';

/**
 * Serviço para gerenciar operações relacionadas ao perfil do usuário
 */

/**
 * Interface para os dados do perfil do usuário
 */
export interface ProfileData {
  codigo?: number;
  nome?: string;
  sobrenome?: string;
  email?: string;
  nascimento?: string;
  sexo?: string;
  celular_ddi?: string;
  celular_numero?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  [key: string]: any;
}

/**
 * Obtém os dados do perfil do usuário
 */
export const getProfile = async (): Promise<ApiResponse> => {
  try {
    const token = localStorage.getItem('@NeoIdea:token');

    if (!token) {
      throw new Error('Token não encontrado');
    }

    const api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const endpoint = import.meta.env.VITE_ENDPOINT_GET_PROFILE || 'obterPerfilExterno';
    const formData = new FormData();
    const response = await api.post(`/${endpoint}`, formData);

    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados do perfil:', error);
    throw error;
  }
};

/**
 * Atualiza os dados do perfil do usuário
 */
export const updateProfile = async (profileData: ProfileData): Promise<ApiResponse> => {
  try {
    const token = localStorage.getItem('@NeoIdea:token');

    if (!token) {
      throw new Error('Token não encontrado');
    }

    const api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const endpoint = import.meta.env.VITE_ENDPOINT_UPDATE_PROFILE || 'gravarPerfilExterno';
    const formData = new FormData();

    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post(`/${endpoint}`, formData);

    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar dados do perfil:', error);
    throw error;
  }
};