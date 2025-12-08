import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./duelsPage.css";

const API_BASE = "http://localhost:8000";
const HABIT_ICONS = {
  sleep: "🌙",
  hydration: "💧",
  study: "📚",
  screen: "📵",
  exercise: "💪",
};

export default function DuelsPage() {
  const [tab, setTab] = useState("pending");
  const [duels, setDuels] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDuels() {
      const storedUser = localStorage.getItem("duelhabit:user");
      let parsedUser = null;

      if (storedUser) {
        try {
          parsedUser = JSON.parse(storedUser);
        } catch {
          parsedUser = null;
        }
      }
      const userId = localStorage.getItem("userId") || parsedUser?.id;

      if (userId && !localStorage.getItem("userId")) {
        localStorage.setItem("userId", userId);
      }

      if (!userId) {
        setError("You must be logged in to view duels.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/duels/${userId}`);
        if (!res.ok) throw new Error("Failed to load duels");
        const data = await res.json();
        setDuels(data);
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    }

    loadDuels();
  }, []);

  const activeDuels = duels.filter((d) => d.status === "active");
  const pendingDuels = duels.filter((d) => d.status === "pending");
  const completedDuels = duels.filter((d) => d.status === "completed");

  let duelsToShow = activeDuels;
  if (tab === "pending") duelsToShow = pendingDuels;
  if (tab === "completed") duelsToShow = completedDuels;

  return (
    <div className="duelhub-wrapper">
      <div className="duelhub-card">
        <header className="duelhub-header">
          <h1 className="duelhub-title">Duel Hub</h1>
          <p className="duelhub-subtitle">
            Challenge friends and track your duels
          </p>
        </header>

        <div className="duelhub-tabs">
          <button
            className={
              "duelhub-tab-btn " + (tab === "active" ? "duelhub-tab-active" : "")
            }
            onClick={() => setTab("active")}
          >
            Active
          </button>
          <button
            className={
              "duelhub-tab-btn " +
              (tab === "pending" ? "duelhub-tab-active" : "")
            }
            onClick={() => setTab("pending")}
          >
            Pending
          </button>
          <button
            className={
              "duelhub-tab-btn " +
              (tab === "completed" ? "duelhub-tab-active" : "")
            }
            onClick={() => setTab("completed")}
          >
            Completed
          </button>
        </div>

        {error && <p className="duelhub-empty">{error}</p>}

        <div className="duelhub-list">
          {duelsToShow.length === 0 && !error && (
            <p className="duelhub-empty">No duels in this tab yet.</p>
          )}

          {tab === "active" &&
            activeDuels.map((duel) => (
              <ActiveDuelCard key={duel.id} duel={duel} />
            ))}

          {tab === "pending" &&
            pendingDuels.map((duel) => (
              <PendingDuelCard key={duel.id} duel={duel} />
            ))}

          {tab === "completed" &&
            completedDuels.map((duel) => (
              <CompletedDuelCard key={duel.id} duel={duel} />
            ))}
        </div>
      </div>

      <button
        className="duelhub-fab"
        onClick={() => navigate("/duels/new")}
        aria-label="Create duel"
      >
        +
      </button>
    </div>
  );
}

function ActiveDuelCard({ duel }) {
  const icon = HABIT_ICONS[duel.habit?.toLowerCase()] || "⚔️";
  return (
    <div className="duel-card">
      <div className="duel-card-top">
        <div className="duel-card-left">
          <div className="duel-icon-circle">{icon}</div>
          <div>
            <div className="duel-title">{duel.title}</div>
            <div className="duel-subline">vs {duel.opponent}</div>
          </div>
        </div>
        <div className="duel-card-right">
          <div className="duel-time">{duel.timeLeft}</div>
          <div className="duel-xp">{duel.xp} XP</div>
        </div>
      </div>

      <div className="duel-progress-label">Your progress</div>
      <div className="duel-progress-bar">
        <div
          className="duel-progress-inner duel-progress-green"
          style={{ width: `${duel.youPct ?? 0}%` }}
        />
      </div>

      <div className="duel-progress-label">Opponent progress</div>
      <div className="duel-progress-bar">
        <div
          className="duel-progress-inner duel-progress-red"
          style={{ width: `${duel.oppPct ?? 0}%` }}
        />
      </div>
    </div>
  );
}

function PendingDuelCard({ duel }) {
  const icon = HABIT_ICONS[duel.habit?.toLowerCase()] || "⌛";
  return (
    <div className="duel-card duel-card-pending">
      <div className="duel-card-top">
        <div className="duel-card-left">
          <div className="duel-icon-circle duel-icon-pending">{icon}</div>
          <div>
            <div className="duel-title">{duel.title}</div>
            <div className="duel-subline">Waiting for {duel.opponent}</div>
          </div>
        </div>
        <div className="duel-card-right">
          <div className="duel-time">{duel.timeLeft}</div>
          <div className="duel-xp">{duel.xp} XP</div>
        </div>
      </div>

      <div className="duel-pending-banner">
        Pending acceptance. You&apos;ll be notified when it starts.
      </div>
    </div>
  );
}

function CompletedDuelCard({ duel }) {
  const icon = HABIT_ICONS[duel.habit?.toLowerCase()] || "🏁";
  const won = duel.result === "won";

  return (
    <div
      className={
        "duel-card duel-card-completed " + (won ? "duel-card-win" : "duel-card-loss")
      }
    >
      <div className="duel-card-top">
        <div className="duel-card-left">
          <div className="duel-icon-circle">{icon}</div>
          <div>
            <div className="duel-title">{duel.title}</div>
            <div className="duel-subline">vs {duel.opponent}</div>
          </div>
        </div>
        <div className="duel-card-right">
          <div className="duel-time">{duel.timeLeft}</div>
          <div className="duel-xp">{duel.xp} XP</div>
        </div>
      </div>

      <div className="duel-versus-row">
        <div>
          <div className="duel-versus-label">You</div>
          <div className="duel-versus-value">{duel.youPct}%</div>
        </div>
        <div className="duel-versus-middle">vs</div>
        <div>
          <div className="duel-versus-label">{duel.opponent}</div>
          <div className="duel-versus-value">{duel.oppPct}%</div>
        </div>
      </div>

      <div className="duel-card-result">
        Result:{" "}
        <span className={won ? "result-text-win" : "result-text-loss"}>
          {won ? "You won!" : "You lost"}
        </span>
      </div>
    </div>
  );
}
