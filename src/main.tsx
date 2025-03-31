import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VideoGallery from "./pages/VideoGallery";
import VideoPlayer from "./pages/VideoPlayer";
import "./index.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("@NeoIdea:token") !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: (
        <Layout>
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/videos/:id",
      element: (
        <Layout>
          <ProtectedRoute>
            <VideoGallery />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/video/:id",
      element: (
        <Layout>
          <ProtectedRoute>
            <VideoPlayer />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
