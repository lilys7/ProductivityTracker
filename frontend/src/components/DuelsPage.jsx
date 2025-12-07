import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./duelsPage.css";

//example initial duels (HARDCODED)
const INITIAL_DUELS = [
  {
    id: "1",
    title: "Sleep 8 Hours Challenge",
    habit: "Sleep",
    status: "active",
    opponent: "Lily",
    progressSelf: 60,
    progressOpponent: 40,
  },
  {
    id: "2",
    title: "Drink 8 Cups of Water",
    habit: "Hydration",
    status: "pending",
    opponent: "Kevin",
    progressSelf: 0,
    progressOpponent: 0,
  },
  {
    id: "3",
    title: "30 Min Study Sprint",
    habit: "Study",
    status: "completed",
    opponent: "Mark",
    progressSelf: 100,
    progressOpponent: 80,
  },
];

export default function DuelsPage() {
  const [duels] = useState(INITIAL_DUELS);
  const navigate = useNavigate();

  const active = duels.filter((d) => d.status === "active");
  const pending = duels.filter((d) => d.status === "pending");
  const completed = duels.filter((d) => d.status === "completed");

  return (
    <div className="duels-page">
      <header className="duels-header">
        <div>
          <h1 className="duels-title">Duels</h1>
          <p className="duels-subtitle">
            Challenge friends to build healthy habits together.
          </p>
        </div>
        <button
          className="primary-btn"
          onClick={() => navigate("/duels/new")}
        >
          + New Duel
        </button>
      </header>

      <section className="duels-section">
        <h2 className="section-label">Active</h2>
        {active.length === 0 && (
          <p className="empty-text">No active duels yet.</p>
        )}
        <div className="duel-list">
          {active.map((duel) => (
            <DuelCard key={duel.id} duel={duel} />
          ))}
        </div>
      </section>

      <section className="duels-section">
        <h2 className="section-label">Pending</h2>
        {pending.length === 0 && (
          <p className="empty-text">No pending invitations.</p>
        )}
        <div className="duel-list">
          {pending.map((duel) => (
            <DuelCard key={duel.id} duel={duel} />
          ))}
        </div>
      </section>

      <section className="duels-section">
        <h2 className="section-label">Completed</h2>
        {completed.length === 0 && (
          <p className="empty-text">Finish a duel to see results here.</p>
        )}
        <div className="duel-list">
          {completed.map((duel) => (
            <DuelCard key={duel.id} duel={duel} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DuelCard({ duel }) {
  return (
    <button className="duel-card">
      <div className="duel-card-main">
        <div>
          <div className="duel-card-title">{duel.title}</div>
          <div className="duel-card-meta">
            vs {duel.opponent} • {duel.habit}
          </div>
        </div>
        <span className={`status-pill status-${duel.status}`}>
          {duel.status}
        </span>
      </div>

      {duel.status === "active" && (
        <div className="duel-progress-row">
          <ProgressBar label="You" value={duel.progressSelf} accent="self" />
          <ProgressBar
            label={duel.opponent}
            value={duel.progressOpponent}
            accent="opponent"
          />
        </div>
      )}
    </button>
  );
}

function ProgressBar({ label, value, accent }) {
  return (
    <div className="progress-row">
      <div className="progress-label">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="progress-track">
        <div
          className={
            "progress-fill " +
            (accent === "self" ? "progress-self" : "progress-opponent")
          }
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
