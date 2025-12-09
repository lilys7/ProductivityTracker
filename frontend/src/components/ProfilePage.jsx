import { useNavigate } from "react-router-dom";
import "../profile.css";   // go up one level because file is in /components/
export default function ProfilePageNEW() {
  const navigate = useNavigate();

  // For now, dummy data. Later we connect it to backend.
  const user = {
    name: "Kimber Gonzalez Lopez",
    avatar: "https://ca.slack-edge.com/T05TJ6YUXUM-U06AACWF31D-98feebfd5082-512",
    level: 7,
    xp: 1450,
    streak: 12,
    habits: ["Hydration", "Coding", "Exercise", "Sleep"]
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img src={user.avatar} alt="avatar" className="avatar" />

        <div className="username">{user.name}</div>
        <div className="level">Level {user.level} · {user.xp} XP</div>

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label">Daily Streak</div>
            <div className="stat-value">{user.streak}🔥</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Habits</div>
            <div className="stat-value">{user.habits.length}</div>
          </div>
        </div>

        <div className="habits-title">Favorite Habits</div>
        <div className="habits-list">
          {user.habits.map((h) => (
            <div key={h} className="habit-chip">
              {h}
            </div>
          ))}
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("duelhabit:user");
            localStorage.removeItem("duelhabit:onboardingComplete");
            localStorage.clear();
            navigate("/");
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
