import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FaTimes, FaPlay, FaPause, FaSpinner } from "react-icons/fa";
import { CarouselItem } from "../types";
import { getPodcastData, getPodcastAudioUrl } from "../services/api";
import { decode } from "html-entities";

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
  max-width: 900px;
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

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
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

const PodcastInfo = styled.div`
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

  a {
    color: ${({ theme }) => theme.color};
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.color2};
      text-decoration: underline;
    }
  }
`;

const PodcastImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const PodcastDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const DetailLabel = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.color};
  margin-right: 10px;
  min-width: 80px;
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.text};
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: ${({ theme }) => theme.color2};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const TrackList = styled.div`
  width: 100%;
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TrackNumber = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.color};
  margin-right: 15px;
  min-width: 25px;
  text-align: center;
`;

const TrackInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TrackTitle = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
`;

const TrackDescription = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const TrackControls = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const TrackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.color2};
    transform: scale(1.1);
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const AudioPlayer = styled.div<{ visible: boolean }>`
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  display: ${(props) => (props.visible ? "block" : "none")};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

interface PodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  podcastItem: CarouselItem;
}

interface PodcastTrack {
  dis_ite_id: string;
  dis_id: string;
  dis_ite_faixa: string;
  dis_ite_autor: string;
  dis_ite_titulo: string;
  dis_ite_descricao: string;
  dis_ite_url: string;
  dis_ite_ficha: string;
  dis_ite_valor: string;
  file: string;
}

interface PodcastData {
  dis_id: string;
  dis_titulo: string;
  dis_ficha: string;
  file: string;
  files: { [key: string]: PodcastTrack };
}

const PodcastModal: React.FC<PodcastModalProps> = ({
  isOpen,
  onClose,
  podcastItem,
}) => {
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<PodcastTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isOpen && podcastItem && podcastItem.tipo === "audio") {
      fetchPodcastData();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setCurrentTrack(null);
    };
  }, [isOpen, podcastItem]);

  const fetchPodcastData = async () => {
    if (!podcastItem.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getPodcastData(podcastItem.id);
      setPodcastData(data);
    } catch (err) {
      console.error("Erro ao buscar dados do podcast:", err);
      setError(
        "Não foi possível carregar os dados do podcast. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track: PodcastTrack) => {
    if (currentTrack && currentTrack.dis_ite_id === track.dis_ite_id) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch((error) => {
            console.error("Erro ao reproduzir áudio:", error);
            setIsPlaying(false);
          });
        }
        setIsPlaying(!isPlaying);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.error("Erro ao reproduzir áudio:", error);
            setIsPlaying(false);
          });
        }
      }, 100);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    }
  }, []);

  const handleBuyClick = () => {
    if (podcastItem.url_compra) {
      window.open(podcastItem.url_compra, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Title>{decode(podcastItem.titulo)}</Title>

        {podcastItem.imagem && (
          <PodcastImage
            src={podcastItem.imagem}
            alt={decode(podcastItem.titulo)}
          />
        )}

        <PodcastDetails>
          {podcastItem.autor && (
            <DetailItem>
              <DetailLabel>Artista:</DetailLabel>
              <DetailValue>{decode(podcastItem.autor)}</DetailValue>
            </DetailItem>
          )}
          {podcastItem.categoria && (
            <DetailItem>
              <DetailLabel>Categoria:</DetailLabel>
              <DetailValue>{decode(podcastItem.categoria)}</DetailValue>
            </DetailItem>
          )}
        </PodcastDetails>

        {podcastItem.descricao && (
          <PodcastInfo>
            <div dangerouslySetInnerHTML={{ __html: podcastItem.descricao }} />
          </PodcastInfo>
        )}

        {loading ? (
          <LoadingSpinner>
            <FaSpinner size={24} />
          </LoadingSpinner>
        ) : error ? (
          <PodcastInfo>
            <div>{error}</div>
          </PodcastInfo>
        ) : podcastData ? (
          <>
            {podcastData.dis_ficha && (
              <PodcastInfo>
                <div
                  dangerouslySetInnerHTML={{ __html: podcastData.dis_ficha }}
                />
              </PodcastInfo>
            )}

            <TrackList>
              {Object.values(podcastData.files || {}).map((track) => (
                <TrackItem key={track.dis_ite_id}>
                  <TrackNumber>{track.dis_ite_faixa}</TrackNumber>
                  <TrackInfo>
                    <TrackTitle>{decode(track.dis_ite_titulo)}</TrackTitle>
                    {track.dis_ite_ficha && (
                      <TrackDescription
                        dangerouslySetInnerHTML={{
                          __html:
                            track.dis_ite_ficha.substring(0, 100) +
                            (track.dis_ite_ficha.length > 100 ? "..." : ""),
                        }}
                      />
                    )}
                  </TrackInfo>
                  <TrackControls>
                    <TrackButton onClick={() => handlePlayTrack(track)}>
                      {isPlaying &&
                      currentTrack &&
                      currentTrack.dis_ite_id === track.dis_ite_id ? (
                        <FaPause />
                      ) : (
                        <FaPlay />
                      )}
                    </TrackButton>
                  </TrackControls>
                </TrackItem>
              ))}
            </TrackList>

            <AudioPlayer visible={!!currentTrack}>
              {currentTrack && (
                <>
                  <audio
                    ref={audioRef}
                    src={getPodcastAudioUrl(
                      podcastData.dis_id,
                      currentTrack.dis_ite_id
                    )}
                    controls
                    style={{ width: "100%" }}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => {
                      console.error("Erro ao carregar o áudio");
                      setIsPlaying(false);
                    }}
                  />
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <strong>{decode(currentTrack.dis_ite_titulo)}</strong>
                  </div>
                </>
              )}
            </AudioPlayer>
          </>
        ) : (
          <PlayButton onClick={fetchPodcastData}>
            <FaPlay /> Carregar Podcast
          </PlayButton>
        )}

        {podcastItem.url_compra && (
          <PlayButton onClick={handleBuyClick} style={{ marginTop: "20px" }}>
            Comprar
          </PlayButton>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PodcastModal;
