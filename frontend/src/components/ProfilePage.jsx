import "../profile.css";   // go up one level because file is in /components/
export default function ProfilePageNEW() {

  // For now, dummy data. Later we connect it to backend.
  const user = {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=12",
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

        <button className="edit-btn">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
