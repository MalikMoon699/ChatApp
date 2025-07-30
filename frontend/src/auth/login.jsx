import React, { useState } from "react";
import "../assets/styles/AuthForm.css";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router";

const login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("https://chat-app-backend-one-lemon.vercel.app/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
     if (res.ok) {
       setIsAuthenticated(true);
       navigate("/");
     } else {
       setError(data.msg || "Login failed");
     }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1 className="auth-title">
          login to Chat <span>App</span>
        </h1>
        {error && <p className="error-message">{error}</p>}
        <div className="auth-input-container">
          <label>Email Adress</label>
          <input
            type="email"
            className="auth-input"
            placeholder="Enter your email address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="auth-input-container">
          <label>Password</label>
          <div className="auth-password-input-container">
            <input
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
              className="auth-password-toggle"
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </div>
          </div>
        </div>
        <button onClick={handleLogin} className="submit-button">
          Login{" "}
          <span>
            <ArrowRight />
          </span>
        </button>
        <div className="or-line-container">
          <div className="or-line">OR</div>
        </div>
        <button className="create-account">
          Create an account?{" "}
          <span
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </span>
        </button>
      </div>
    </div>
  );
};

export default login;
