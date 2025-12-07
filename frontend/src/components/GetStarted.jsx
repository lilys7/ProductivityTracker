import "./getStarted.css";
import { useNavigate } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="gs-page">

      <div className="gs-card">

        {/*progress dots */}
        <div className="gs-steps">
          <div className="gs-step active"></div>
          <div className="gs-step"></div>
          <div className="gs-step"></div>
          <div className="gs-step"></div>
        </div>

        {/*icon box */}
        <div className="gs-icon">
          <span>🏋️</span>
        </div>

        {/* title */}
        <h2>Welcome to DuelHabit</h2>
        <p className="gs-desc">
          Transform your habits into exciting challenges. Compete with friends,
          track progress, and level up your life!
        </p>

        <button
          className="gs-btn"
          onClick={() => navigate("/select-habits")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
