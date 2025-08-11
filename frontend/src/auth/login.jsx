// Login.jsx
import React, { useEffect, useState } from "react";
import "../assets/styles/AuthForm.css";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState([]);
  const [note, setNote] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setFadeOut(true);
    }, 4500);

    const timeout2 = setTimeout(() => {
      setNote(false);
    }, 5000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://chat-app-gamma-sage.vercel.app/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setError(data.errors || [{ msg: data.msg || "Login failed" }]);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError([{ msg: "An error occurred. Please try again." }]);
    }
  };

  return (
    <div className="auth-container">
      {note && (
        <div className={`note ${fadeOut ? "fade-out" : "fade-in"}`}>
          Due to high traffic on our site, we have temporarily taken the server
          offline. We appreciate your patience and are working to restore
          service as soon as possible.
        </div>
      )}
      <div className="auth-form-container">
        <h1 className="auth-title">
          Login to Chat <span>App</span>
        </h1>
        {error.length > 0 && (
          <div className="error-message">
            {error.map((err, index) => (
              <p key={index}>{err.msg}</p>
            ))}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="auth-input-container">
            <label>Email Address</label>
            <input
              type="email"
              className="auth-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="auth-input-container">
            <label>Password</label>
            <div className="auth-password-input-container">
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="auth-password-toggle"
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </div>
            </div>
          </div>
          <button type="submit" className="submit-button">
            Login{" "}
            <span>
              <ArrowRight />
            </span>
          </button>
        </form>
        <div className="or-line-container">
          <div className="or-line">OR</div>
        </div>
        <button className="create-account">
          Create an account?{" "}
          <span onClick={() => navigate("/signUp")}>Sign Up</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
