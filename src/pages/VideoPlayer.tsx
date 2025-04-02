import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVideoStore } from "../stores/videoStore";
import styled from "styled-components";
import { Video } from "../types";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaStepBackward,
  FaStepForward,
  FaArrowLeft,
} from "react-icons/fa";
import { BiCog } from "react-icons/bi";

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const VideoWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  max-height: 100vh;
  object-fit: contain;
`;

const YouTubeIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  max-height: 100vh;
`;

const Controls = styled.div<{ isVisible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 20px;
  display: flex;
  flex-direction: column;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  color: white;
  margin: 0;
  font-size: 18px;
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 20px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const TimeDisplay = styled.div`
  color: white;
  font-size: 14px;
  margin-right: 15px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  margin-bottom: 15px;
`;

const Progress = styled.div<{ width: string }>`
  height: 100%;
  background-color: #f00;
  border-radius: 5px;
  width: ${({ width }) => width};
`;

const Button = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const SpeedSelector = styled.select`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

interface LocationState {
  video: Video;
}

const getYouTubeVideoId = (url: string): string | null => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const isYouTubeUrl = (url: string): boolean => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { currentVideo, setCurrentVideo } = useVideoStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const [videoError, setVideoError] = useState(false);

  const state = location.state as LocationState | null;
  const video = state?.video;

  useEffect(() => {
    const videoData = location.state?.video as Video;
    if (videoData) {
      setCurrentVideo(videoData);
      setVideoError(false);

      if (videoData.url && isYouTubeUrl(videoData.url)) {
        setIsYouTubeVideo(true);
        const videoId = getYouTubeVideoId(videoData.url);
        setYoutubeVideoId(videoId);
        console.log("YouTube video ID:", videoId);
      } else {
        setIsYouTubeVideo(false);
        setYoutubeVideoId(null);
      }
    } else {
      const videoId = location.pathname.split("/").pop();
      if (!videoId) {
        navigate("/");
      }
    }

    if (!video) {
      navigate("/");
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("ended", handleEnded);

    const hideControls = () => {
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = window.setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    hideControls();

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("ended", handleEnded);

      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [video, navigate, isPlaying, location, setCurrentVideo]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    const video = videoRef.current;
    if (!progressBar || !video) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const speed = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const toggleFullscreen = () => {
    const videoContainer = document.documentElement;

    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    setIsFullscreen(!isFullscreen);
  };

  const handleMouseMove = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!video) {
    return null;
  }

  return (
    <PlayerContainer onMouseMove={handleMouseMove}>
      <BackButton onClick={handleBack}>
        <FaArrowLeft />
      </BackButton>

      <VideoWrapper>
        {isYouTubeVideo && youtubeVideoId ? (
          <YouTubeIframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentVideo?.titulo || "Vídeo do YouTube"}
          />
        ) : videoError ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "white",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <p>Não foi possível reproduzir este vídeo.</p>
            <button
              onClick={handleBack}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "4px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Voltar para a galeria
            </button>
          </div>
        ) : (
          <StyledVideo
            ref={videoRef}
            src={currentVideo?.url || ""}
            onClick={handlePlayPause}
            autoPlay
            controls={false}
            onError={() => setVideoError(true)}
          />
        )}

        {!isYouTubeVideo && (
          <Controls isVisible={showControls}>
            <ProgressBar ref={progressRef} onClick={handleProgressClick}>
              <Progress width={`${(currentTime / duration) * 100}%`} />
            </ProgressBar>

            <ControlsRow>
              <Button onClick={handlePlayPause}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </Button>

              <Button
                onClick={() => {
                  const video = videoRef.current;
                  if (video) {
                    video.currentTime = Math.max(0, video.currentTime - 10);
                  }
                }}
              >
                <FaStepBackward />
              </Button>

              <TimeDisplay>
                {formatTime(currentTime)} / {formatTime(duration)}
              </TimeDisplay>

              <Button
                onClick={() => {
                  const video = videoRef.current;
                  if (video) {
                    video.currentTime = Math.min(
                      duration,
                      video.currentTime + 10
                    );
                  }
                }}
              >
                <FaStepForward />
              </Button>

              <div style={{ position: "relative", marginLeft: "10px" }}>
                <Button onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                  <BiCog /> {playbackSpeed}x
                </Button>
                {showSpeedMenu && (
                  <SpeedSelector
                    value={playbackSpeed}
                    onChange={handleSpeedChange}
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </SpeedSelector>
                )}
              </div>

              <Button onClick={toggleFullscreen}>
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </Button>
            </ControlsRow>

            <Title>{currentVideo?.titulo || "Vídeo sem título"}</Title>
          </Controls>
        )}

        {isYouTubeVideo && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              background: "rgba(0, 0, 0, 0.7)",
              padding: "10px",
              borderRadius: "5px",
              zIndex: 10,
            }}
          >
            <Title>{currentVideo?.titulo || "Vídeo sem título"}</Title>
          </div>
        )}
      </VideoWrapper>
    </PlayerContainer>
  );
};

export default VideoPlayer;
