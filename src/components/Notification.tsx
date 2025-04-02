import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationProps {
  type: NotificationType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div<{
  type: NotificationType;
  isClosing: boolean;
}>`
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 450px;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: ${(props) => (props.isClosing ? slideOut : slideIn)} 0.3s
    ease-in-out;

  background-color: ${(props) => {
    switch (props.type) {
      case "success":
        return "rgba(46, 125, 50, 0.95)";
      case "error":
        return "rgba(211, 47, 47, 0.95)";
      case "warning":
        return "rgba(237, 108, 2, 0.95)";
      case "info":
        return "rgba(2, 136, 209, 0.95)";
      default:
        return "rgba(33, 33, 33, 0.95)";
    }
  }};

  @media (max-width: 768px) {
    min-width: calc(100% - 40px);
    max-width: calc(100% - 40px);
    top: 10px;
    right: 10px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const IconWrapper = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
`;

const Message = styled.p`
  color: white;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  flex: 1;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin-left: 12px;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isVisible && !isClosing) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle />;
      case "error":
        return <FaExclamationTriangle />;
      case "warning":
        return <FaExclamationTriangle />;
      case "info":
        return <FaInfoCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <NotificationContainer type={type} isClosing={isClosing}>
      <ContentWrapper>
        <IconWrapper>{getIcon()}</IconWrapper>
        <Message>{message}</Message>
      </ContentWrapper>
      <CloseButton onClick={handleClose}>
        <FaTimes size={16} />
      </CloseButton>
    </NotificationContainer>
  );
};

export default Notification;
