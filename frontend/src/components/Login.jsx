import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import api from "./api";


export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password: pw,
      });
      localStorage.setItem("duelhabit:user", JSON.stringify(data));
      localStorage.setItem("duelhabit:onboardingComplete", "false");
      navigate("/get-started");
    } catch (err) {
      setError("Unable to login right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-icon">
          <span>⚔️</span>
        </div>

        <h2>DuelHabit</h2>
        <p className="subtitle">
          Build habits through friendly competition
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>
          <input
            type="email"
            placeholder="  your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="   ••••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {error && <p className="error-text">{error}</p>}

        <button className="google-btn">
          Continue with Google
        </button>

        <div className="links">
          <a href="#">Don't have an account? <b>Sign up</b></a>
          <a href="#">Forgot Password?</a>
        </div>

      </div>
    </div>
  );
}
