import React, { useState ,useEffect} from "react";
import "../assets/styles/AuthForm.css";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [noteVisible, setNoteVisible] = useState(true);
  const [fadeClass, setFadeClass] = useState("fade-in");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
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
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
     const fadeOutTimer = setTimeout(() => {
       setFadeClass("fade-out");
     }, 4000); // Start fade out at 4s

     const hideTimer = setTimeout(() => {
       setNoteVisible(false);
     }, 5000); // Fully hide at 5s

     return () => {
       clearTimeout(fadeOutTimer);
       clearTimeout(hideTimer);
     };
   }, []);

  return (
    <div className="auth-container">
      {noteVisible && (
        <div className={`note ${fadeClass}`}>
          The server has been temporarily taken offline as a precautionary
          measure to address security concerns.
        </div>
      )}
      <div className="auth-form-container">
        <h1 className="auth-title">
          Login to Chat <span>App</span>
        </h1>
        {error && <p className="error-message">{error}</p>}
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
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}{" "}
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
