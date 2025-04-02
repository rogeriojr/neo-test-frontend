import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";
import { CarouselItem } from "../types";
import { useCarouselStore } from "../stores/carouselStore";
import { useModalStore } from "../stores/modalStore";
import { TbHandClick } from "react-icons/tb";
import { useProfileModalStore } from "../stores/profileModalStore";
import ProfileModal from "./ProfileModal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CarouselContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 20px 0 60px 0;
  position: relative;
  perspective: 1000px;
  overflow: hidden;

  .slick-track {
    display: flex;
    align-items: center;
  }

  .slick-slide {
    transition: all 0.4s ease;
  }
`;

interface SlideItemProps {
  active?: boolean;
  position?: string;
}

const SlideItem = styled.div<SlideItemProps>`
  position: relative;
  height: auto;
  margin: 0 15px;
  border-radius: 12px;
  overflow: visible;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: ${(props) =>
    props.active
      ? "rotateY(0deg) scale(1.1)"
      : props.position === "left"
      ? "rotateY(15deg) scale(0.85)"
      : props.position === "right"
      ? "rotateY(-15deg) scale(0.85)"
      : "rotateY(0deg) scale(0.85)"};
  z-index: ${(props) => (props.active ? 10 : 1)};
  perspective: 1000px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    height: auto;
    margin: 0 10px;
  }
`;

const SlideImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: all 0.4s ease;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);

  ${SlideItem}:hover & {
    transform: scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
  }
`;

const ClickIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  opacity: 0.9;

  &:hover {
    transform: scale(1.1);
    opacity: 1;
  }

  svg {
    font-size: 26px;
    color: #333;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    right: 8px;
    top: 30px;

    svg {
      font-size: 22px;
    }
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    right: 5px;
    top: 20px;

    svg {
      font-size: 20px;
    }
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.text};
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #ff6b6b;
  font-size: 18px;
`;

interface CarouselProps {
  onItemClick?: (item: CarouselItem) => void;
}

interface SlideReflectionProps {
  image?: string;
}

const SlideReflection = styled.div<SlideReflectionProps>`
  position: absolute;
  bottom: -80%;
  left: 0;
  width: 100%;
  height: 80%;
  background-image: ${(props) => `url(${props.image})`};
  background-size: cover;
  transform: rotateX(180deg);
  opacity: 0.6;
  filter: blur(1px);
  border-radius: 12px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.9),
    rgba(0, 0, 0, 0)
  );
  z-index: -1;
  transition: all 0.3s ease;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  max-width: 500px;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
  z-index: 20;
  background-color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }

  @media (max-width: 768px) {
    width: 80%;
    height: 16px;
    bottom: 8px;
  }

  @media (max-width: 480px) {
    width: 90%;
    height: 12px;
    bottom: 5px;
  }
`;

interface ProgressIndicatorProps {
  progress?: number;
}

const ProgressIndicator = styled.div<ProgressIndicatorProps>`
  position: relative;
  height: 100%;
  width: ${(props) => props.progress}%;
  border-radius: 10px;
  transition: width 0.3s ease;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
    width: 40px;
    height: 40px;
    background-image: url("https://app.neoidea.com.br/neoidea/images/btn_deslizante.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: all 0.2s ease;
  }

  &:hover::after {
    transform: translate(50%, -50%) scale(1.1);
  }

  @media (max-width: 768px) {
    &::after {
      width: 32px;
      height: 32px;
    }
  }

  @media (max-width: 480px) {
    &::after {
      width: 24px;
      height: 24px;
    }
  }
`;

const Carousel: React.FC<CarouselProps> = () => {
  const items = useCarouselStore((state) => state.items);
  const isLoading = useCarouselStore((state) => state.isLoading);
  const error = useCarouselStore((state) => state.error);
  const fetchItems = useCarouselStore((state) => state.fetchItems);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  // Usar o store global para o modal de perfil
  const isProfileModalOpen = useProfileModalStore((state) => state.isOpen);
  const setProfileModalOpen = useProfileModalStore((state) => state.setOpen);

  // Função para fechar o modal de perfil
  const handleCloseProfileModal = () => setProfileModalOpen(false);

  const setContactModal = useModalStore((state) => state.setContactModal);
  const setPodcastModal = useModalStore((state) => state.setPodcastModal);
  const setEliveModal = useModalStore((state) => state.setEliveModal);

  const carouselItems = items;
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleItemClick = (item: CarouselItem) => {
    console.log("Item clicado:", item);
    if (item.tipo === "video" && item.id) {
      navigate(`/videos/${item.id}`);
    } else if (item.tipo === "podcast" && item.id) {
      setPodcastModal(true, item);
    } else if (item.tipo === "contato") {
      setContactModal(true, item);
    } else if (item.tipo === "elive" && item.url) {
      setEliveModal(true, item);
    } else if (item.link) {
      window.open(item.link, "_blank");
    }
  };
  useEffect(() => {
    const totalSlides = carouselItems.length;
    const progressValue =
      totalSlides > 0 ? (currentSlide / (totalSlides - 1)) * 100 : 0;
    setProgress(progressValue);
  }, [currentSlide, carouselItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) =>
          prev > 0 ? prev - 1 : carouselItems.length - 1
        );
      } else if (e.key === "ArrowRight") {
        setCurrentSlide((prev) =>
          prev < carouselItems.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [carouselItems.length]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    autoplay: false,
    pauseOnHover: true,
    arrows: false,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    swipeToSlide: true,
    touchThreshold: 5,
    draggable: true,
    useCSS: true,
    useTransform: true,
    beforeChange: (_: number, next: number) => {
      setCurrentSlide(next);
    },
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "40px",
          speed: 400,
          touchThreshold: 8,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "20px",
          speed: 300,
          touchThreshold: 10,
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <img src="/assets/wait-unscreen.gif" alt="Carregando" />
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (carouselItems.length === 0) {
    return <ErrorMessage>Nenhum item encontrado no carrossel</ErrorMessage>;
  }

  console.log("Itens do carrossel:", carouselItems);

  const Tooltip = styled.div<{ active: boolean }>`
    position: absolute;
    top: 40px;
    right: 60px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    white-space: nowrap;
    opacity: ${(props) => (props.active ? 1 : 0)};
    visibility: ${(props) => (props.active ? "visible" : "hidden")};
    transition: opacity 0.3s ease, visibility 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    z-index: 30;
    pointer-events: none;
    font-weight: 500;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      right: -6px;
      transform: translateY(-50%);
      border-width: 6px 0 6px 6px;
      border-style: solid;
      border-color: transparent transparent transparent rgba(0, 0, 0, 0.8);
    }

    @media (max-width: 768px) {
      top: 30px;
      right: 55px;
      padding: 6px 10px;
      font-size: 12px;
    }

    @media (max-width: 480px) {
      display: none; /* Ocultar em telas muito pequenas para evitar sobreposição */
    }
  `;

  return (
    <CarouselContainer>
      {/* @ts-ignore */}
      <Slider {...settings}>
        {carouselItems.map((item, index) => {
          const isActive = index === currentSlide;
          const position =
            index < currentSlide
              ? "left"
              : index > currentSlide
              ? "right"
              : "center";

          return (
            <SlideItem key={item.id} active={isActive} position={position}>
              <SlideImage src={item.imagem} alt={item.titulo} />
              <SlideReflection image={item.imagem} />
              <ClickIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(item);
                }}
              >
                <TbHandClick />
              </ClickIcon>
              <Tooltip active={isActive}>Clique para ver os detalhes!</Tooltip>
            </SlideItem>
          );
        })}
      </Slider>
      <ProgressBar
        onClick={(e) => {
          const bar = e.currentTarget;
          const rect = bar.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percent = (x / rect.width) * 100;
          const slideIndex = Math.round(
            (percent / 100) * (carouselItems.length - 1)
          );
          setCurrentSlide(slideIndex);
        }}
      >
        <ProgressIndicator progress={progress} />
      </ProgressBar>
      {/* Os modais foram movidos para o Layout.tsx para cobrir toda a tela */}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
        />
      )}
    </CarouselContainer>
  );
};

export default Carousel;
