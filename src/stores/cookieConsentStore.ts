import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CookieConsentState {
  accepted: boolean;
  setAccepted: (value: boolean) => void;
}

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set) => ({
      accepted: false,
      setAccepted: (value: boolean) => set({ accepted: value }),
    }),
    {
      name: 'cookie-consent-storage',
    }
  )
);