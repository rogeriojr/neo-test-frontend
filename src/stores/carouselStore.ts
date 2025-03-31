import { create } from 'zustand';
import { getCarrosselExterno } from '../services/api';
import { CarouselItem } from '../types';

interface CarouselState {
  items: CarouselItem[];
  isLoading: boolean;
  error: string | null;
  fetchItems: (params?: { tipo?: string; id?: string }) => Promise<void>;
}

export const useCarouselStore = create<CarouselState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async (params?: { tipo?: string; id?: string }) => {
    try {
      const currentItems = useCarouselStore.getState().items;

      console.log('Estado atual antes de fetchItems:', currentItems.length, 'itens');

      set({ isLoading: currentItems.length === 0, error: null });

      const response = await getCarrosselExterno(params);
      console.log('Resposta da API do carrossel:', response);

      const dataToProcess = Array.isArray(response) ? response : (response && response.retorno && Array.isArray(response.dados) ? response.dados : null);

      if (dataToProcess) {
        const mappedItems = dataToProcess.map((item: any) => ({
          id: item.id || item.codigo || '',
          titulo: item.titulo || '',
          descricao: item.descricao || '',
          imagem: item.imagem || '',
          tipo: item.tipo || 'imagem',
          link: item.link || '',
          ordem: item.ordem || 0,
          categoria: item.categoria || '',
          autor: item.autor || '',
          favorito: item.favorito || false,
          url_compra: item.url_compra || null
        }));
        console.log('Itens mapeados do carrossel:', mappedItems);
        console.log('Atualizando estado do carrossel com', mappedItems.length, 'itens');

        if (mappedItems.length > 0) {
          set(state => ({
            ...state,
            items: mappedItems,
            isLoading: false
          }));

          window.setTimeout(() => {
            const storeState = useCarouselStore.getState();
            if (storeState.items.length === 0) {
              set({ items: mappedItems });
            }
          }, 500);

          setTimeout(() => {
            const currentState = useCarouselStore.getState();
            console.log('Estado atual após atualização:', currentState.items.length, 'itens');
          }, 100);
        } else if (currentItems.length > 0) {
          console.log('Sem novos itens, mantendo os', currentItems.length, 'itens existentes');
          set({ isLoading: false });
        } else {
          throw new Error('Nenhum item encontrado no carrossel');
        }
      } else {
        if (currentItems.length > 0) {
          console.log('Sem novos dados, mantendo os', currentItems.length, 'itens existentes');
          set({ isLoading: false });
        } else {
          throw new Error((response && (response.descricao || response.erro)) || 'Erro ao carregar itens do carrossel');
        }
      }
    } catch (err: any) {
      console.error('Erro ao carregar itens do carrossel:', err);
      set({
        isLoading: false,
        error: err.message || 'Não foi possível carregar os itens do carrossel.'
      });
    }
  },
}));