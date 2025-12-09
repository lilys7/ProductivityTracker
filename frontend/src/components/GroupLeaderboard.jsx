import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./leaderboard.css";

export default function GroupLeaderboard() {
  const { groupId } = useParams();
  const [users, setUsers] = useState([]);
  const userId = localStorage.getItem("userId");
  const fetchData = async () => {
    const res = await fetch(`http://localhost:8000/leaderboard/${groupId}`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchData();
    const handleUserUpdated = () => fetchData();
    window.addEventListener("duelhabit:user-updated", handleUserUpdated);
    return () => window.removeEventListener("duelhabit:user-updated", handleUserUpdated);
  }, [groupId]);

  const myRank = users.findIndex(u => u._id === userId) + 1;
  const me = users.find(u => u._id === userId);

  return (
    <div className="leaderboard-page">

      <h1 className="lb-title">Group Leaderboard</h1>
      <p className="lb-subtitle">
        Competing with {users.length} friends
      </p>

      <div className="lb-rank-card">
        <div className="lb-rank-left">
          <span className="lb-trophy">🏆</span>
          <div>Your Rank</div>
          <div className="lb-rank-number">#{myRank}</div>
        </div>
        <div className="lb-rank-right">
          <div>Total XP</div>
          <div className="lb-rank-xp">{me?.xp ?? 0} XP</div>
        </div>
      </div>

      <div className="lb-top3">
        {users.slice(0, 3).map((u, i) => (
          <div key={u._id} className={`lb-top-card position-${i}`}>
            <span className="lb-avatar">🙂</span>
            <div className="lb-user-name">{u.email.split("@")[0]}</div>
            <div className="lb-level">Level {Math.floor(u.xp / 150)}</div>
            <div className="lb-xp">{u.xp} XP</div>
          </div>
        ))}
      </div>

      <div className="lb-list">
        {users.slice(3).map((u, i) => (
          <div key={u._id} className="lb-row">
            <div className="lb-rank">#{i + 4}</div>
            <div className="lb-email">{u.email}</div>
            <div className="lb-xp">{u.xp} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
}
