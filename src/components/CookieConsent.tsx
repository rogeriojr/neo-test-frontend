import React from "react";
import styled from "styled-components";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
      name: "cookie-consent-storage",
    }
  )
);

const CookieConsentContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 9998;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 15px;
    gap: 10px;
  }
`;

const CookieText = styled.p`
  margin: 0;
  font-size: 14px;
  flex: 1;
`;

const CookieLink = styled.a`
  color: ${({ theme }) => theme.color};
  text-decoration: underline;
  cursor: pointer;
  margin-left: 5px;
`;

const AcceptButton = styled.button`
  background-color: ${({ theme }) => theme.color};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.color2};
  }
`;

const CookieConsent: React.FC = () => {
  const { accepted, setAccepted } = useCookieConsentStore();

  if (accepted) {
    return null;
  }

  return (
    <CookieConsentContainer>
      <CookieText>
        Ao utilizar nossos serviços, você aceita a política de cookies.
        <CookieLink href="#">Mais informações</CookieLink>
      </CookieText>
      <AcceptButton onClick={() => setAccepted(true)}>Aceitar!</AcceptButton>
    </CookieConsentContainer>
  );
};

export default CookieConsent;
