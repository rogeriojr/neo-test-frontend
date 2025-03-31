import { create } from 'zustand';
import { getCarrosselExterno } from '../services/api';
import { Video } from '../types';
import { decodeHtmlEntities } from '../utils/htmlUtils';

interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  isLoading: boolean;
  error: string | null;
  fetchVideos: (categoria?: string) => Promise<void>;
  setCurrentVideo: (video: Video) => void;
  searchVideos: (term: string) => Video[];
}

const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return '';
};

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  currentVideo: null,
  isLoading: false,
  error: null,

  fetchVideos: async (categoria?: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getCarrosselExterno({
        tipo: 'video',
        ...(categoria ? { id: categoria } : {}),
        mdi_id: '172'
      });
      console.log('Resposta da API:', response);

      const dataToProcess = Array.isArray(response) ? response :
        (response && response.retorno && Array.isArray(response.dados) ? response.dados : null);

      if (dataToProcess && dataToProcess.length > 0) {
        const videosData = dataToProcess.map((item: any) => {
          const url = item.link || item.url || '';
          const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

          return {
            id: item.id || item.codigo || '',
            titulo: decodeHtmlEntities(item.titulo || ''),
            descricao: decodeHtmlEntities(item.descricao || ''),
            thumbnail: isYouTube ? getYouTubeThumbnail(url) : (item.imagem || ''),
            url: url,
            duracao: item.duracao || '',
            categoria: decodeHtmlEntities(item.categoria || '')
          };
        });

        console.log('Dados de vídeos processados:', videosData);

        set({ videos: videosData, isLoading: false });
        console.log('Vídeos carregados com sucesso:', videosData);
      } else {
        console.warn('Nenhum dado válido retornado da API para categoria:', categoria);
        set({ videos: [], isLoading: false });
      }
    } catch (err: any) {
      console.error('Erro ao carregar vídeos:', err);
      set({
        isLoading: false,
        error: err.message || 'Não foi possível carregar os vídeos.'
      });
    }
  },

  setCurrentVideo: (video: Video) => {
    set({ currentVideo: video });
  },

  searchVideos: (term: string) => {
    const state = get();
    if (!term.trim()) return state.videos;

    return state.videos.filter(
      (video) =>
        video.titulo.toLowerCase().includes(term.toLowerCase()) ||
        (video.descricao &&
          video.descricao.toLowerCase().includes(term.toLowerCase()))
    );
  }
}));