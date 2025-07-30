import { useState, useEffect } from "react";
import Home from "./pages/ChatPage";
import Login from "./auth/login";
import SignUp from "./auth/signUp";
import "./assets/styles/Style.css";
import "./assets/styles/Model.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Loader from "./components/Loader";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/check`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <Loader loading={true} />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Home
              setIsAuthenticated={setIsAuthenticated}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/signUp"
        element={
          !isAuthenticated ? (
            <SignUp setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;
