import React, { createContext, useState, useContext, ReactNode } from "react";
import Notification, { NotificationType } from "../components/Notification";

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    message: string,
    duration?: number
  ) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
    isVisible: boolean;
    duration: number;
  }>({ type: "info", message: "", isVisible: false, duration: 5000 });

  const showNotification = (
    type: NotificationType,
    message: string,
    duration = 5000
  ) => {
    setNotification({ type, message, isVisible: true, duration });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={notification.duration}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
