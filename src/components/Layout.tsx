import React, { useState } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { useThemeStore } from "../stores/themeStore";
import { useAuthStore } from "../stores/authStore";
import { useModalStore } from "../stores/modalStore";
import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import ContactModal from "./ContactModal";
import PodcastModal from "./PodcastModal";
import EliveModal from "./EliveModal";
import CookieConsent from "./CookieConsent";
import { useProfileModalStore } from "../stores/profileModalStore";

// O store do modal de perfil foi movido para src/stores/profileModalStore.ts

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', 'Helvetica Neue', sans-serif;
  }
  
  body {
    background-color: ${({ theme }) => theme.corBackground};
    color: ${({ theme }) => theme.text};
    min-height: 100vh;
  }
  
  button {
    cursor: pointer;
  }
`;

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-image: ${({ theme }) =>
    theme.background ? `url(${theme.background})` : "none"};
  background-color: ${({ theme }) =>
    theme.background ? "transparent" : theme.corBackground};
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }

  & > * {
    position: relative;
  }
`;

const UserIconButton = styled.button`
  background: white;
  border: none;
  color: #aaaaaa;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 99999;

  &:hover {
    background-color: ${({ theme }) => theme.color};
    color: ${({ theme }) => theme.text};
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    top: 15px;
    right: 15px;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const layout = useThemeStore((state) => state.layout);
  const isLoading = useThemeStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const isProfileModalOpen = useProfileModalStore((state) => state.isOpen);
  const setProfileModalOpen = useProfileModalStore((state) => state.setOpen);

  const showContactModal = useModalStore((state) => state.showContactModal);
  const contactItem = useModalStore((state) => state.contactItem);
  const setContactModal = useModalStore((state) => state.setContactModal);

  const showPodcastModal = useModalStore((state) => state.showPodcastModal);
  const podcastItem = useModalStore((state) => state.podcastItem);
  const setPodcastModal = useModalStore((state) => state.setPodcastModal);

  const showEliveModal = useModalStore((state) => state.showEliveModal);
  const eliveItem = useModalStore((state) => state.eliveItem);
  const setEliveModal = useModalStore((state) => state.setEliveModal);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: layout.corBackground,
          color: layout.text,
        }}
      >
        <img src="/assets/wait-unscreen.gif" alt="Carregando" />
      </div>
    );
  }

  return (
    <ThemeProvider theme={layout}>
      <GlobalStyle />
      <MainContainer>
        {isAuthenticated && (
          <UserIconButton onClick={() => setProfileModalOpen(true)}>
            <FaUser />
          </UserIconButton>
        )}
        {children}
      </MainContainer>
      {isAuthenticated && (
        <>
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setProfileModalOpen(false)}
          />
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
          />
          <CookieConsent />
        </>
      )}

      {/* Modais do carrossel renderizados no nível raiz para cobrir toda a tela */}
      {showContactModal && contactItem && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setContactModal(false)}
          contactItem={contactItem}
        />
      )}
      {showPodcastModal && podcastItem && (
        <PodcastModal
          isOpen={showPodcastModal}
          onClose={() => setPodcastModal(false)}
          podcastItem={podcastItem}
        />
      )}
      {showEliveModal && eliveItem && (
        <EliveModal
          isOpen={showEliveModal}
          onClose={() => setEliveModal(false)}
          eliveItem={eliveItem}
        />
      )}
    </ThemeProvider>
  );
};

export default Layout;
