import React, { useState } from "react";
import "../assets/styles/AuthForm.css";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignUp = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://chat-app-gamma-sage.vercel.app/signUp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userId", data.user.id); // Store userId
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setError(data.msg || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1 className="auth-title">
          SignUp to Chat <span>App</span>
        </h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignUp}>
          <div className="auth-input-container">
            <label>Name</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-container">
            <label>Email Address</label>
            <input
              type="email"
              className="auth-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="auth-password-toggle"
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </div>
            </div>
          </div>
          <div className="auth-input-container">
            <label>Confirm Password</label>
            <div className="auth-password-input-container">
              <input
                className="auth-input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="auth-password-toggle"
              >
                {showConfirmPassword ? <Eye /> : <EyeClosed />}
              </div>
            </div>
          </div>
          <button type="submit" className="submit-button">
            SignUp{" "}
            <span>
              <ArrowRight />
            </span>
          </button>
        </form>
        <div className="or-line-container">
          <div className="or-line">OR</div>
        </div>
        <button className="create-account">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
