import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";       //reuse same styles
import api from "./api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", {
        email,
        password: pw,
      });

      // Save user + mark onboarding not complete yet
      localStorage.setItem("userId", data.id);
      localStorage.setItem("email", data.email);
      localStorage.setItem("duelhabit:user", JSON.stringify(data));
      localStorage.setItem("duelhabit:onboardingComplete", "false");

      navigate("/get-started");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Unable to create account. Please try again.";
      setError(msg);
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

        <h2>Create your DuelHabit account</h2>
        <p className="subtitle">
          Start building habits through friendly competition
        </p>

        <form onSubmit={handleSignup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="  your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="   ••••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <div className="links">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="link-button"
          >
            Already have an account? <b>Log in</b>
          </button>
        </div>
      </div>
    </div>
  );
}
