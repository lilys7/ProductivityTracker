import { useEffect, useState } from "react";
import "./leaderboard.css";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8000/leaderboard");
      const data = await res.json();
      setUsers(data);
    };

    fetchData();
  }, []);

  // Rank of logged-in user
  const myRank = users.findIndex(u => u._id === userId) + 1;
  const me = users.find(u => u._id === userId);

  return (
    <div className="leaderboard-page">
      <h1 className="lb-title">Friends Leaderboard</h1>
      <p className="lb-subtitle">Compete with your friends</p>

      {/* rank banner */}
      <div className="lb-rank-card">
        <div className="lb-rank-left">
          <span className="lb-trophy">🏆</span>
          <div>Your Rank</div>
          <div className="lb-rank-number">#{myRank}</div>
        </div>
        <div className="lb-rank-right">
          <div>This Week</div>
          <div className="lb-rank-xp">{me?.xp ?? 0} XP</div>
        </div>
      </div>

      {/* Top 3 display */}
      <div className="lb-top3">
        {users.slice(0,3).map((u, i) => (
          <div key={u._id} className={`lb-top-card position-${i}`}>
            <span className="lb-avatar">{i===1 ? "👸" : i===2 ? "👱‍♂️" : "🙂"}</span>
            <div className="lb-user-name">{u.email.split("@")[0]}</div>
            <div className="lb-level">Level {Math.floor(u.xp / 150)}</div>
            <div className="lb-xp">{u.xp} XP</div>
          </div>
        ))}
      </div>

      {/* list of the rest */}
      <div className="lb-list">
        {users.slice(3).map((u, index) => (
          <div key={u._id} className="lb-row">
            <div className="lb-rank">#{index+4}</div>
            <div className="lb-email">{u.email}</div>
            <div className="lb-xp">{u.xp} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
}
