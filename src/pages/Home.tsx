import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Carousel from "../components/Carousel";
import { CarouselItem } from "../types";

const HomeContainer = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 20px;
  background-image: ${({ theme }) =>
    theme.background ? `url(${theme.background})` : "none"};
  background-color: ${({ theme }) =>
    theme.background ? "transparent" : theme.corBackground};
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 20px;
  background-color: transparent;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleCarouselItemClick = (item: CarouselItem) => {
    if (item.tipo === "video" && item.id) {
      navigate(`/videos/${item.id}`);
    }
  };

  return (
    <HomeContainer>
      <Header />

      <MainContent>
        <Carousel onItemClick={handleCarouselItemClick} />
      </MainContent>
    </HomeContainer>
  );
};

export default Home;
