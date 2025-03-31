import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { CarouselItem } from "../types";
import { getListaTransmissao } from "../services/api";
import { decodeHtmlEntities } from "../utils/htmlUtils";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.box};
  border-radius: 12px;
  width: 95%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  padding: 30px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(0);
  animation: modalFadeIn 0.3s ease-out;
  margin: 0 auto;
  z-index: 100000;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color};
    border-radius: 4px;
  }

  @media (max-height: 700px) {
    max-height: 75vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 20px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  z-index: 10001;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.color};
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
  width: 100%;
`;

const LiveStreamContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const LiveStreamIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const LiveStreamInfo = styled.div`
  margin-bottom: 20px;
  width: 100%;

  div {
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  p {
    color: ${({ theme }) => theme.text};
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1.5;
  }
`;

const NoLiveMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: ${({ theme }) => theme.text};
  font-size: 18px;
  width: 100%;

  h3 {
    color: ${({ theme }) => theme.color};
    margin-bottom: 15px;
    font-size: 22px;
  }

  p {
    margin-bottom: 15px;
    line-height: 1.5;
  }
`;

interface EliveModalProps {
  isOpen: boolean;
  onClose: () => void;
  eliveItem?: CarouselItem;
}

interface Transmissao {
  id: string;
  titulo: string;
  descricao?: string;
  url?: string;
  data_inicio?: string;
  data_fim?: string;
}

const EliveModal: React.FC<EliveModalProps> = ({
  isOpen,
  onClose,
  eliveItem,
}) => {
  const [transmissoes, setTransmissoes] = useState<Transmissao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchTransmissoes = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getListaTransmissao();
          setTransmissoes(Array.isArray(data) ? data : []);
        } catch (err: any) {
          console.error("Erro ao buscar transmissões:", err);
          setError(err.message || "Erro ao buscar transmissões ao vivo");
        } finally {
          setLoading(false);
        }
      };

      fetchTransmissoes();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (eliveItem && eliveItem.url) {
    return (
      <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>

          <Title>{decodeHtmlEntities(eliveItem.titulo)}</Title>

          <LiveStreamContainer>
            <LiveStreamIframe
              src={eliveItem.url}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </LiveStreamContainer>

          {eliveItem.descricao && (
            <LiveStreamInfo>
              <div dangerouslySetInnerHTML={{ __html: eliveItem.descricao }} />
            </LiveStreamInfo>
          )}
        </ModalContainer>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Title>Transmissões ao Vivo</Title>

        {loading ? (
          <NoLiveMessage>
            <p>Carregando transmissões...</p>
          </NoLiveMessage>
        ) : error ? (
          <NoLiveMessage>
            <h3>Erro</h3>
            <p>{error}</p>
          </NoLiveMessage>
        ) : transmissoes.length === 0 ? (
          <NoLiveMessage>
            <h3>Nenhuma Live encontrada!</h3>
            <p>No momento não há transmissões ao vivo disponíveis.</p>
            <p>Por favor, volte mais tarde para conferir novas transmissões.</p>
          </NoLiveMessage>
        ) : (
          transmissoes.map((transmissao) => (
            <div
              key={transmissao.id}
              style={{ width: "100%", marginBottom: "20px" }}
            >
              <h3 style={{ color: "#fff", marginBottom: "10px" }}>
                {decodeHtmlEntities(transmissao.titulo)}
              </h3>

              {transmissao.url && (
                <LiveStreamContainer>
                  <LiveStreamIframe
                    src={transmissao.url}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </LiveStreamContainer>
              )}

              {transmissao.descricao && (
                <LiveStreamInfo>
                  <div
                    dangerouslySetInnerHTML={{ __html: transmissao.descricao }}
                  />
                </LiveStreamInfo>
              )}
            </div>
          ))
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EliveModal;
