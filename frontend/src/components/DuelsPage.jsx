import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./duelsPage.css";

//HARDCODED 
const ALL_DUELS = [
  {
    id: "1",
    title: "Sleep Duel",
    habit: "Sleep",
    opponent: "Sarah_K",
    xp: 250,
    timeLeft: "18h 42m",
    status: "active",
    youPct: 75,
    oppPct: 60,
  },
  {
    id: "2",
    title: "Study Duel",
    habit: "Study",
    opponent: "Mike_T",
    xp: 500,
    timeLeft: "2d 6h",
    status: "active",
    youPct: 45,
    oppPct: 55,
  },
  {
    id: "3",
    title: "Hydration Duel",
    habit: "Hydration",
    opponent: "Alex_R",
    xp: 300,
    status: "pending",
  },
  {
    id: "4",
    title: "Exercise Duel",
    habit: "Exercise",
    opponent: "Chris_P",
    xp: 400,
    status: "completed",
    result: "won",
    youPct: 95,
    oppPct: 80,
  },
  {
    id: "5",
    title: "Screen Detox Duel",
    habit: "Screen Detox",
    opponent: "Jordan_L",
    xp: 200,
    status: "completed",
    result: "lost",
    youPct: 70,
    oppPct: 85,
  },
];

export default function DuelsPage() {
  const [tab, setTab] = useState("active");
  const navigate = useNavigate();

  const activeDuels = ALL_DUELS.filter((d) => d.status === "active");
  const pendingDuels = ALL_DUELS.filter((d) => d.status === "pending");
  const completedDuels = ALL_DUELS.filter((d) => d.status === "completed");

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

        {/* Tabs */}
        <div className="duelhub-tabs">
          <button
            className={
              "duelhub-tab-btn " +
              (tab === "active" ? "duelhub-tab-active" : "")
            }
            onClick={() => setTab("active")}
          >
            Active ({activeDuels.length})
          </button>
          <button
            className={
              "duelhub-tab-btn " +
              (tab === "pending" ? "duelhub-tab-active" : "")
            }
            onClick={() => setTab("pending")}
          >
            Pending ({pendingDuels.length})
          </button>
          <button
            className={
              "duelhub-tab-btn " +
              (tab === "completed" ? "duelhub-tab-active" : "")
            }
            onClick={() => setTab("completed")}
          >
            Completed ({completedDuels.length})
          </button>
        </div>

        {/* Cards */}
        <div className="duelhub-list">
          {duelsToShow.length === 0 && (
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

      {/* Floating + */}
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
  return (
    <div className="duel-card">
      <div className="duel-card-top">
        <div className="duel-card-left">
          <div className="duel-icon-circle">⏰</div>
          <div>
            <div className="duel-title">{duel.title}</div>
            <div className="duel-subline">vs {duel.opponent}</div>
          </div>
        </div>
        <div className="duel-card-right">
          <div className="duel-time">{duel.timeLeft}</div>
          <div className="duel-xp">+{duel.xp} XP</div>
        </div>
      </div>

      <div className="duel-progress-label">You</div>
      <ProgressBar color="green" value={duel.youPct} />
      <div className="duel-progress-label">Opponent</div>
      <ProgressBar color="red" value={duel.oppPct} />
    </div>
  );
}

function PendingDuelCard({ duel }) {
  return (
    <div className="duel-card duel-card-pending">
      <div className="duel-card-top">
        <div className="duel-card-left">
          <div className="duel-icon-circle duel-icon-pending">💧</div>
          <div>
            <div className="duel-title">{duel.title}</div>
            <div className="duel-subline">vs {duel.opponent}</div>
          </div>
        </div>
        <div className="duel-card-right">
          <div className="duel-xp">+{duel.xp} XP</div>
        </div>
      </div>
      <div className="duel-pending-banner">Waiting for acceptance</div>
    </div>
  );
}

function CompletedDuelCard({ duel }) {
  const isWin = duel.result === "won";
  return (
    <div
      className={
        "duel-card duel-card-completed " +
        (isWin ? "duel-card-win" : "duel-card-loss")
      }
    >
      <div className="duel-card-top">
        <div className="duel-card-left">
          <div className="duel-icon-circle">
            {duel.habit === "Exercise" ? "💪" : "📱"}
          </div>
          <div>
            <div className="duel-title">{duel.title}</div>
            <div className="duel-subline">vs {duel.opponent}</div>
          </div>
        </div>
        <div className="duel-card-right duel-card-result">
          <span className={isWin ? "result-text-win" : "result-text-loss"}>
            {isWin ? "Won" : "Lost"}
          </span>
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

      <div className="duel-xp-earned">
        {isWin ? `+${duel.xp} XP earned` : `${duel.xp} XP earned`}
      </div>
    </div>
  );
}

function ProgressBar({ value, color }) {
  return (
    <div className="duel-progress-bar">
      <div
        className={
          "duel-progress-inner " +
          (color === "green" ? "duel-progress-green" : "duel-progress-red")
        }
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
