import axios from 'axios';
import CryptoJS from 'crypto-js';
import { AuthData, Auth2ValidateData, Auth2ValidateWithEmailData, ApiResponse } from '../types';

const getEnv = (key: string, defaultValue: string = ''): string => {
  if (import.meta && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return defaultValue;
};

// Configurações principais
const MDI_ID = getEnv('VITE_MDI_ID', '172'); // Valor padrão para o Biquini Cavadão
const AUTH_TOKEN_KEY = getEnv('VITE_AUTH_TOKEN_KEY', '@NeoIdea:token');
const USER_DATA_KEY = getEnv('VITE_USER_DATA_KEY', '@NeoIdea:user');

// URLs base
const API_BASE_URL = getEnv('VITE_API_BASE_URL', 'https://app.neoidea.com.br/sistema/index.php?r=outlet/services');
const ELIVE_API_URL = getEnv('VITE_ELIVE_API_URL', 'https://elive.neoidea.com.br/services.php');
const PODCAST_API_URL = getEnv('VITE_PODCAST_API_URL', 'https://app.neoidea.com.br/sistema/neowebservice/servercontent_cloudfront.php');

// Endpoints
const ENDPOINTS = {
  AUTH: getEnv('VITE_ENDPOINT_AUTH', 'autenticaFaExterno'),
  GET_LAYOUT: getEnv('VITE_ENDPOINT_GET_LAYOUT', 'getLayoutExterno'),
  GET_CAROUSEL: getEnv('VITE_ENDPOINT_GET_CAROUSEL', 'getCarrosselExterno'),
  VERIFY_AUTH: getEnv('VITE_ENDPOINT_VERIFY_AUTH', 'verificaAutenticacaoExterno'),
  RECOVER_PASSWORD: getEnv('VITE_ENDPOINT_RECOVER_PASSWORD', 'recuperarSenhaFaExterno'),
  AUTH2: getEnv('VITE_ENDPOINT_AUTH2', 'auth2Externo'),
  VALIDATE_AUTH2: getEnv('VITE_ENDPOINT_VALIDATE_AUTH2', 'validarAuth2Externo'),
  GENERATE_AUTH2_CHALLENGE: getEnv('VITE_ENDPOINT_GENERATE_AUTH2_CHALLENGE', 'gerarDesafioAuth2Externo'),
  VALIDATE_AUTH2_CHALLENGE: getEnv('VITE_ENDPOINT_VALIDATE_AUTH2_CHALLENGE', 'validarDesafioAuth2Externo'),
  GET_CONTACT: getEnv('VITE_ENDPOINT_GET_CONTACT', 'getContatoExterno'),
  SEND_CONTACT: getEnv('VITE_ENDPOINT_SEND_CONTACT', 'enviarMensagemContatoExterno'),
};

// Configurações adicionais
const DEFAULT_TIMEZONE = getEnv('VITE_DEFAULT_TIMEZONE', 'America/Sao_Paulo');
const CRYPTO_METHOD = getEnv('VITE_CRYPTO_METHOD', 'sha1');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getLayoutExterno = async () => {
  try {
    const formData = new FormData();
    formData.append('mdi_id', MDI_ID);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post(`/${ENDPOINTS.GET_LAYOUT}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter layout:', error);
    throw error;
  }
};

export const autenticaFaExterno = async (data: AuthData) => {
  try {
    const senhaEncriptada = CryptoJS.SHA1(data.senha).toString();
    const emailEncriptado = CryptoJS.SHA1(data.email).toString();

    const formData = new FormData();
    formData.append('metodo', CRYPTO_METHOD);
    formData.append('email', emailEncriptado);
    formData.append('senha', senhaEncriptada);
    formData.append('mdi_id', MDI_ID);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post(`/${ENDPOINTS.AUTH}`, formData, config);

    if (response.data && response.data.retorno && response.data.dados && response.data.dados.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.dados.token);

      const userData = {
        id: response.data.dados.codigo,
        nome: response.data.dados.nome,
        email: response.data.dados.email
      };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } else if (response.data && !response.data.retorno) {
      throw new Error(response.data.descricao || response.data.erro || 'Falha na autenticação');
    }

    return response.data;
  } catch (error) {
    console.error('Erro na autenticação:', error);
    throw error;
  }
};

export const getCarrosselExterno = async (params?: { tipo?: string; id?: string; mdi_id?: string }) => {
  try {
    const url = `/${ENDPOINTS.GET_CAROUSEL}`;

    const formData = new FormData();
    formData.append('mdi_id', params?.mdi_id || MDI_ID);

    if (params?.tipo) {
      formData.append('tipo', params.tipo);
    }

    if (params?.id) {
      formData.append('id', params.id);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    console.log('Fazendo requisição para:', url, 'com parâmetros:', {
      mdi_id: params?.mdi_id || MDI_ID,
      tipo: params?.tipo,
      id: params?.id
    });

    const response = await api.post(url, formData, config);
    console.log('Resposta da API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter itens do carrossel:', error);
    throw error;
  }
};

export const verificaAutenticacaoExterno = async (lang?: string): Promise<ApiResponse> => {
  try {
    const formData = new FormData();

    if (lang) {
      formData.append('lang', lang);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post(`/${ENDPOINTS.VERIFY_AUTH}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    throw error;
  }
};

export const recuperarSenhaFaExterno = async (email: string, lang?: string): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('email', email);

    if (lang) {
      formData.append('lang', lang);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post(`/${ENDPOINTS.RECOVER_PASSWORD}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao recuperar senha:', error);
    throw error;
  }
};

export const auth2Externo = async (email: string, lang?: string): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('email', email);

    if (lang) {
      formData.append('lang', lang);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post(`/${ENDPOINTS.AUTH2}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar desafio de autenticação:', error);
    throw error;
  }
};

export const validarAuth2Externo = async (data: Auth2ValidateData): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('desafio', data.desafio);
    formData.append('numero_serie', data.numero_serie);

    if (data.lang) {
      formData.append('lang', data.lang);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post(`/${ENDPOINTS.VALIDATE_AUTH2}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao validar desafio de autenticação:', error);
    throw error;
  }
};

export const gerarDesafioAuth2Externo = async (mdi: number | string, numero_serie: string, lang?: string): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('mdi', mdi.toString());
    formData.append('numero_serie', numero_serie);

    if (lang) {
      formData.append('lang', lang);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post(`/${ENDPOINTS.GENERATE_AUTH2_CHALLENGE}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar desafio de autenticação para aplicativo:', error);
    throw error;
  }
};

export const validarDesafioAuth2Externo = async (data: Auth2ValidateWithEmailData): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('desafio', data.desafio);
    formData.append('email', data.email);
    formData.append('mdi', data.mdi.toString());

    if (data.lang) {
      formData.append('lang', data.lang);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post(`/${ENDPOINTS.VALIDATE_AUTH2_CHALLENGE}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao validar desafio de autenticação para aplicativo:', error);
    throw error;
  }
};

export const getContactInfo = async (): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('mdi_id', MDI_ID);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post(`/${ENDPOINTS.GET_CONTACT}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter informações de contato:', error);
    throw error;
  }
};

export const sendContactMessage = async (data: { nome: string; email: string; mensagem: string }): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('mdi_id', MDI_ID);
    formData.append('nome', data.nome);
    formData.append('email', data.email);
    formData.append('mensagem', data.mensagem);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post(`/${ENDPOINTS.SEND_CONTACT}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem de contato:', error);
    throw error;
  }
};

/**
 * Busca a lista de transmissões ao vivo
 * @param eliveId ID opcional da transmissão
 * @param userTz Fuso horário do usuário (padrão definido em .env)
 * @returns Lista de transmissões ao vivo
 */
export const getListaTransmissao = async (eliveId: string = '', userTz: string = DEFAULT_TIMEZONE): Promise<any> => {
  try {
    const response = await axios.get(`${ELIVE_API_URL}?a=getListaTransmissao&elive_id=${eliveId}&user_tz=${encodeURIComponent(userTz)}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter lista de transmissões:', error);
    throw error;
  }
};

export const getPodcastData = async (id: string | number): Promise<any> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const params = new URLSearchParams();
    params.append('action', 'music');
    params.append('id', id.toString());
    params.append('mdi_id', MDI_ID);
    params.append('lang', getEnv('VITE_DEFAULT_LANG', 'ptbr'));
    params.append('serial', 'web version');

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    const response = await axios.post(PODCAST_API_URL, params, config);

    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados do podcast:', error);
    throw error;
  }
};

export const getPodcastAudioUrl = (podcastId: string, trackId: string): string => {
  return `${PODCAST_API_URL}?action=music&id=${podcastId}&track=${trackId}`;
};



export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

export default api;