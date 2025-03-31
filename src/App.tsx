import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VideoGallery from "./pages/VideoGallery";
import VideoPlayer from "./pages/VideoPlayer";
import { useThemeStore } from "./stores/themeStore";
import { useAuthStore } from "./stores/authStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const fetchLayout = useThemeStore((state) => state.fetchLayout);

  useEffect(() => {
    fetchLayout();
  }, [fetchLayout]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos/:id"
            element={
              <ProtectedRoute>
                <VideoGallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video/:id"
            element={
              <ProtectedRoute>
                <VideoPlayer />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
