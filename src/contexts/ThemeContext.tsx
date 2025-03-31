import React, { createContext, useState, useEffect, ReactNode } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { getLayoutExterno } from "../services/api";
import { LayoutData, ThemeContextType } from "../types";

const defaultTheme: LayoutData = {
  nome: "Neo Idea",
  background: "",
  corBackground: "#000000",
  logo: "",
  text: "#ffffff",
  text2: "#f5f5f5",
  color: "#333333",
  color2: "#444444",
  box: "#1e1e1e",
};

const defaultContext: ThemeContextType = {
  layout: defaultTheme,
  isLoading: true,
  error: null,
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [layout, setLayout] = useState<LayoutData>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        setIsLoading(true);
        const data = await getLayoutExterno();
        setLayout(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar layout:", err);
        setError("Não foi possível carregar o layout do sistema.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLayout();
  }, []);

  return (
    <ThemeContext.Provider value={{ layout, isLoading, error }}>
      <StyledThemeProvider theme={layout}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
