import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="home-header">
        <div>
          <p className="home-welcome">Welcome back,</p>
          <h1 className="home-username">@habitmaster</h1>
        </div>
        <button
          className="home-profile-btn"
          onClick={() => navigate("/profile")}
        >
          Me
        </button>
      </header>

      <section className="home-card home-main-card">
        <div className="home-main-title">Today&apos;s streak</div>
        <div className="home-main-value">7 days 🔥</div>
        <p className="home-main-sub">
          Keep up the momentum by finishing your quests and duels.
        </p>
      </section>

      <section className="home-grid">
        <button
          className="home-card"
          onClick={() => navigate("/quests")}
        >
          <div className="home-card-title">Quests</div>
          <p className="home-card-sub">Finish daily tasks and earn XP.</p>
        </button>

        <button
          className="home-card"
          onClick={() => navigate("/duels")}
        >
          <div className="home-card-title">Duels</div>
          <p className="home-card-sub">Challenge friends to healthy battles.</p>
        </button>

        <button
          className="home-card"
          onClick={() => navigate("/groups")}
        >
          <div className="home-card-title">Groups</div>
          <p className="home-card-sub">See how your circle is doing.</p>
        </button>

        <button
          className="home-card"
          onClick={() => navigate("/ranks")}
        >
          <div className="home-card-title">Ranks</div>
          <p className="home-card-sub">Check the leaderboard.</p>
        </button>
      </section>
    </div>
  );
}