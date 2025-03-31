import { create } from 'zustand';
import { CarouselItem } from '../types';

interface ModalState {
  showContactModal: boolean;
  contactItem: CarouselItem | null;
  setContactModal: (show: boolean, item?: CarouselItem | null) => void;

  showPodcastModal: boolean;
  podcastItem: CarouselItem | null;
  setPodcastModal: (show: boolean, item?: CarouselItem | null) => void;

  showEliveModal: boolean;
  eliveItem: CarouselItem | null;
  setEliveModal: (show: boolean, item?: CarouselItem | null) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showContactModal: false,
  contactItem: null,
  showPodcastModal: false,
  podcastItem: null,
  showEliveModal: false,
  eliveItem: null,

  setContactModal: (show, item = null) => set({
    showContactModal: show,
    contactItem: show ? item : null
  }),

  setPodcastModal: (show, item = null) => set({
    showPodcastModal: show,
    podcastItem: show ? item : null
  }),

  setEliveModal: (show, item = null) => set({
    showEliveModal: show,
    eliveItem: show ? item : null
  })
}));