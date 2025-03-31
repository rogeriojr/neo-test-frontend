import axios from 'axios';
import CryptoJS from 'crypto-js';
import { AuthData, Auth2ValidateData, Auth2ValidateWithEmailData, ApiResponse } from '../types';

const getEnv = (key: string, defaultValue: string = ''): string => {
  if (import.meta && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return defaultValue;
};

const MDI_ID = getEnv('VITE_MDI_ID', '172'); // Valor padrão para o Biquini Cavadão

const api = axios.create({
  baseURL: 'https://app.neoidea.com.br/sistema/index.php?r=outlet/services',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@NeoIdea:token');
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

    const response = await api.post('/getLayoutExterno', formData, config);
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
    formData.append('metodo', 'sha1');
    formData.append('email', emailEncriptado);
    formData.append('senha', senhaEncriptada);
    formData.append('mdi_id', MDI_ID);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post('/autenticaFaExterno', formData, config);

    if (response.data && response.data.retorno && response.data.dados && response.data.dados.token) {
      localStorage.setItem('@NeoIdea:token', response.data.dados.token);

      const userData = {
        id: response.data.dados.codigo,
        nome: response.data.dados.nome,
        email: response.data.dados.email
      };
      localStorage.setItem('@NeoIdea:user', JSON.stringify(userData));
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
    const url = '/getCarrosselExterno';

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

    const response = await api.post('/verificaAutenticacaoExterno', formData, config);
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

    const response = await api.post('/recuperarSenhaFaExterno', formData, config);
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

    const response = await api.post('/auth2Externo', formData, config);
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

    const response = await api.post('/validarAuth2Externo', formData, config);
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

    const response = await api.post('/gerarDesafioAuth2Externo', formData, config);
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

    const response = await api.post('/validarDesafioAuth2Externo', formData, config);
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

    const response = await api.post('/getContatoExterno', formData, config);
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

    const response = await api.post('/enviarMensagemContatoExterno', formData, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem de contato:', error);
    throw error;
  }
};

/**
 * Busca a lista de transmissões ao vivo
 * @param eliveId ID opcional da transmissão
 * @param userTz Fuso horário do usuário (padrão: America/Sao_Paulo)
 * @returns Lista de transmissões ao vivo
 */
export const getListaTransmissao = async (eliveId: string = '', userTz: string = 'America/Sao_Paulo'): Promise<any> => {
  try {
    const response = await axios.get(`https://elive.neoidea.com.br/services.php?a=getListaTransmissao&elive_id=${eliveId}&user_tz=${encodeURIComponent(userTz)}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter lista de transmissões:', error);
    throw error;
  }
};

export const getPodcastData = async (id: string | number): Promise<any> => {
  try {
    const token = localStorage.getItem('@NeoIdea:token');
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const params = new URLSearchParams();
    params.append('action', 'music');
    params.append('id', id.toString());
    params.append('mdi_id', MDI_ID);
    params.append('lang', 'ptbr');
    params.append('serial', 'web version');

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    const url = 'https://app.neoidea.com.br/sistema/neowebservice/servercontent_cloudfront.php';
    const response = await axios.post(url, params, config);

    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados do podcast:', error);
    throw error;
  }
};

export const getPodcastAudioUrl = (podcastId: string, trackId: string): string => {
  return `https://app.neoidea.com.br/sistema/neowebservice/servercontent_cloudfront.php?action=music&id=${podcastId}&track=${trackId}`;
};

export const logout = () => {
  localStorage.removeItem('@NeoIdea:token');
  localStorage.removeItem('@NeoIdea:user');
};

export default api;