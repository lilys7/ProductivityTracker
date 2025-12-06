import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    //call backend login here
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
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />

          <button type="submit" className="login-btn">
            Login
          </button>

        </form>

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
