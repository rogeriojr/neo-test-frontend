import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useVideoStore } from "../stores/videoStore";
import { Video } from "../types";
import { FaSearch } from "react-icons/fa";
import { decodeHtmlEntities } from "../utils/htmlUtils";

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text2};
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const BackButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.text};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
`;

const VideoCard = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
`;

const VideoThumbnail = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.7) 100%
    );
  }
`;

const VideoInfo = styled.div`
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const VideoTitle = styled.h3`
  color: ${({ theme }) => theme.text2};
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const VideoDescription = styled.p`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: auto;
  opacity: 0.8;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px 12px;
  width: 100%;
  max-width: 300px;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:focus-within {
    background-color: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  width: 100%;
  padding: 5px;
  outline: none;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    transition: color 0.3s ease;
  }

  &:focus::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const SearchIcon = styled.div`
  color: ${({ theme }) => theme.text};
  margin-right: 8px;
`;

const NoResults = styled.p`
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const VideoGallery = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videos = useVideoStore((state) => state.videos);
  const loading = useVideoStore((state) => state.isLoading);
  const error = useVideoStore((state) => state.error);
  const fetchVideos = useVideoStore((state) => state.fetchVideos);
  const [galleryTitle, setGalleryTitle] = useState("Galeria de Vídeos");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (id) {
      console.log("Buscando vídeos para categoria:", id);
      fetchVideos(id);
      setGalleryTitle(`Galeria de Vídeos - ${id}`);
    }
  }, [id, fetchVideos]);

  useEffect(() => {
    console.log("Estado atual:", { videos: videos.length, loading, error });

    if (videos.length > 0) {
      if (videos[0].categoria) {
        setGalleryTitle(videos[0].categoria);
      } else if (videos[0].titulo) {
        setGalleryTitle(`Galeria: ${videos[0].titulo}`);
      }
    } else if (!loading && !error) {
      setGalleryTitle("Galeria de Vídeos");
    }

    setFilteredVideos(videos);
  }, [videos, loading, error]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(
        (video) =>
          video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (video.descricao &&
            video.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredVideos(filtered);
    }
  }, [searchTerm, videos]);

  const handleVideoClick = (video: Video) => {
    if (video && video.url) {
      navigate(`/video/${video.id}`, { state: { video } });
    } else {
      console.error("Vídeo sem URL válida:", video);
      alert("Este vídeo não possui um link válido.");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  console.log("Renderizando VideoGallery:", {
    loading,
    error,
    videosLength: videos.length,
  });

  if (loading) {
    return (
      <GalleryContainer>
        <Header>
          <Title>Carregando...</Title>
          <BackButton onClick={handleBack}>Voltar</BackButton>
        </Header>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            width: "100%",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <img
            src="/assets/wait-unscreen.gif"
            alt="Carregando..."
            style={{ width: "80px", height: "80px" }}
          />
          <p style={{ color: "white", marginTop: "10px" }}>
            Carregando vídeos...
          </p>
        </div>
      </GalleryContainer>
    );
  }

  if (error) {
    return (
      <GalleryContainer>
        <Header>
          <Title>Erro</Title>
          <BackButton onClick={handleBack}>Voltar</BackButton>
        </Header>
        <p style={{ color: "white" }}>{error}</p>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <Header>
        <Title>{galleryTitle}</Title>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar vídeos..."
            value={searchTerm}
            onChange={handleSearch}
            autoComplete="off"
          />
        </SearchContainer>
        <BackButton onClick={handleBack}>Voltar</BackButton>
      </Header>

      {videos.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <p style={{ color: "white", fontSize: "16px", textAlign: "center" }}>
            Nenhum vídeo encontrado para esta categoria.
          </p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <NoResults>Nenhum vídeo encontrado para "{searchTerm}"</NoResults>
      ) : (
        <VideosGrid>
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} onClick={() => handleVideoClick(video)}>
              <div style={{ position: "relative" }}>
                <VideoThumbnail
                  src={video.thumbnail || "/placeholder-video.jpg"}
                  alt={video.titulo}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-video.jpg";
                  }}
                />
                {video.duracao && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      padding: "3px 6px",
                      borderRadius: "3px",
                      fontSize: "12px",
                    }}
                  >
                    {video.duracao}
                  </div>
                )}
              </div>
              <VideoInfo>
                <VideoTitle>{decodeHtmlEntities(video.titulo)}</VideoTitle>
                {video.descricao && (
                  <VideoDescription>
                    {decodeHtmlEntities(video.descricao)}
                  </VideoDescription>
                )}
                {video.categoria && (
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {video.categoria}
                  </div>
                )}
              </VideoInfo>
            </VideoCard>
          ))}
        </VideosGrid>
      )}
    </GalleryContainer>
  );
};

export default VideoGallery;
