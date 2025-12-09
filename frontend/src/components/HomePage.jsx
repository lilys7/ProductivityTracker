import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./homePage.css";

const API_BASE = "http://localhost:8000";

const fallbackQuests = [
  {
    id: 1,
    title: "Drink 5 cups of water",
    progressText: "3/5 completed",
    xp: 50,
    completed: false,
  },
  {
    id: 2,
    title: "Sleep 8 hours",
    progressText: "8/8 completed",
    xp: 100,
    completed: true,
  },
  {
    id: 3,
    title: "Study for 30 minutes",
    progressText: "15/30 completed",
    xp: 75,
    completed: false,
  },
  {
    id: 4,
    title: "Screen-free for 2 hours",
    progressText: "45/120 completed",
    xp: 80,
    completed: false,
  },
];

const fallbackDuels = [
  {
    id: "d1",
    title: "Sleep duel vs Sarah_K",
    opponent: "Sarah_K",
    status: "active",
    progress: 62,
    timeLeft: "6h left",
    habit: "Sleep",
    xp: 150,
  },
  {
    id: "d2",
    title: "Hydration duel vs Mike_T",
    opponent: "Mike_T",
    status: "pending",
    progress: 0,
    timeLeft: "Waiting for accept",
    habit: "Hydration",
    xp: 80,
  },
];

const groupSnapshot = {
  name: "Morning Risers",
  rank: 2,
  members: 5,
  trend: "+1 this week",
};

const rankSnapshot = {
  position: 12,
  total: 124,
  streak: 7,
};

function readStoredUser() {
  const raw = localStorage.getItem("duelhabit:user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse stored user", err);
    localStorage.removeItem("duelhabit:user");
    return null;
  }
}

function questProgress(quest) {
  if (quest.completed) return 100;
  const match = /(\d+)\s*\/\s*(\d+)/.exec(quest.progressText || "");
  if (!match) return 0;
  const current = Number(match[1]);
  const total = Number(match[2]) || 1;
  return Math.max(0, Math.min(100, Math.round((current / total) * 100)));
}

function duelProgress(duel) {
  if (typeof duel.progress === "number") {
    return Math.max(0, Math.min(100, Math.round(duel.progress)));
  }
  if (duel.status === "completed") return 100;
  return 40;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [quests, setQuests] = useState(fallbackQuests);
  const [duels, setDuels] = useState(fallbackDuels);
  const user = useMemo(readStoredUser, []);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const loadData = async () => {
      try {
        const questRes = await fetch(`${API_BASE}/quests/${userId}`);
        if (questRes.ok) {
          const questData = await questRes.json();
          if (Array.isArray(questData) && questData.length) {
            setQuests(questData);
          }
        }
      } catch (err) {
        console.error("Could not load quests", err);
      }

      try {
        const duelRes = await fetch(`${API_BASE}/duels/${userId}`);
        if (duelRes.ok) {
          const duelData = await duelRes.json();
          if (Array.isArray(duelData) && duelData.length) {
            setDuels(duelData);
          }
        }
      } catch (err) {
        console.error("Could not load duels", err);
      }
    };

    loadData();
  }, []);

  const openQuests = quests.filter((q) => !q.completed);
  const completedQuests = quests.length - openQuests.length;
  const xpEarned = quests.filter((q) => q.completed).reduce((s, q) => s + (q.xp || 0), 0);
  const xpReady = openQuests.reduce((s, q) => s + (q.xp || 0), 0);

  const activeDuels = duels.filter((d) => d.status === "active");
  const pendingDuels = duels.filter((d) => d.status === "pending");
  const spotlightDuels = [...activeDuels, ...pendingDuels].slice(0, 3);
  const spotlightQuests = openQuests.slice(0, 3);

  const displayName = user?.username || user?.name || user?.email || "@habitmaster";
  const streakDays = Number(localStorage.getItem("streakDays")) || rankSnapshot.streak;
  
  const handleQuestComplete = (questId) => {
    setQuests(prev =>
      prev.map(q =>
        q.id === questId
          ? { ...q, completed: true, progressText: "Done for today" }
          : q
      )
    );
  };

  return (
    <div className="home-page">
      <div className="home-shell">
        <section className="home-hero">
          <div className="home-hero-top">
            <div>
              <p className="home-eyebrow">Dashboard</p>
              <h1 className="home-title">Welcome back, {displayName}</h1>
              <p className="home-sub">
                You have {openQuests.length} quests and {activeDuels.length}{" "}
                active duels waiting.
              </p>
            </div>
            <div className="home-hero-actions">
              <button
                className="home-btn ghost"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
              <button
                className="home-btn solid"
                onClick={() => navigate("/duels/new")}
              >
                New duel
              </button>
            </div>
          </div>

          <div className="home-metrics">
            <div className="home-pill">
              <p className="pill-label">Streak</p>
              <p className="pill-value">{streakDays} days</p>
              <span className="pill-sub">Keep the chain alive</span>
            </div>
            <div className="home-pill">
              <p className="pill-label">Quests</p>
              <p className="pill-value">
                {completedQuests}/{quests.length}
              </p>
              <span className="pill-sub">{xpEarned} XP earned</span>
            </div>
            <div className="home-pill">
              <p className="pill-label">Duels</p>
              <p className="pill-value">{activeDuels.length} active</p>
              <span className="pill-sub">
                {pendingDuels.length} waiting for a reply
              </span>
            </div>
            <div className="home-pill">
              <p className="pill-label">XP ready</p>
              <p className="pill-value">{xpReady} XP</p>
              <span className="pill-sub">Complete your open quests</span>
            </div>
          </div>
        </section>

        <div className="home-grid-two">
          <section className="home-panel">
            <header className="home-panel-head">
              <div>
                <p className="home-eyebrow">Today&apos;s quests</p>
                <h2 className="home-panel-title">Finish these next</h2>
              </div>
              <button
                className="home-link-btn"
                onClick={() => navigate("/quests")}
              >
                View quests
              </button>
            </header>

            <div className="home-list">
              {spotlightQuests.length === 0 && (
                <p className="home-empty">You are all caught up for today.</p>
              )}
              {spotlightQuests.map((quest) => (
                <div key={quest.id} className="home-card-row">
                  <div>
                    <p className="row-title">{quest.title}</p>
                    <p className="row-sub">{quest.progressText}</p>
                    <div className="home-progress">
                      <div
                        className="home-progress-fill"
                        style={{ width: `${questProgress(quest)}%` }}
                      />
                    </div>
                  </div>
                  <div className="row-right">
                    <span className="row-xp">+{quest.xp} XP</span>
                    <button
                      className="home-mini-btn"
                      onClick={() => handleQuestComplete(quest.id)}
                    >
                      Mark done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="home-panel">
            <header className="home-panel-head">
              <div>
                <p className="home-eyebrow">Duels</p>
                <h2 className="home-panel-title">Active & pending</h2>
              </div>
              <button
                className="home-link-btn"
                onClick={() => navigate("/duels")}
              >
                Go to duels
              </button>
            </header>

            <div className="home-list">
              {spotlightDuels.length === 0 && (
                <p className="home-empty">
                  No active duels yet. Start one!
                </p>
              )}

              {spotlightDuels.map((duel) => (
                <div key={duel.id || duel.title} className="home-card-row">
                  <div>
                    <p className="row-title">{duel.title}</p>
                    <p className="row-sub">
                      {duel.status === "pending"
                        ? "Awaiting response"
                        : duel.timeLeft || "In progress"}
                    </p>
                    <div className="home-progress subtle">
                      <div
                        className="home-progress-fill"
                        style={{ width: `${duelProgress(duel)}%` }}
                      />
                    </div>
                  </div>
                  <div className="row-right">
                    <span className="row-pill">{duel.status}</span>
                    <span className="row-xp">{duel.xp || 0} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="home-panel home-panel-wide">
          <header className="home-panel-head">
            <div>
              <p className="home-eyebrow">Groups & ranks</p>
              <h2 className="home-panel-title">
                Stay connected with your friends
              </h2>
            </div>
            <div className="home-links">
              <button
                className="home-link-btn"
                onClick={() => navigate("/groups")}
              >
                Groups
              </button>
              <button
                className="home-link-btn"
                onClick={() => navigate("/leaderboard")}
              >
                Leaderboard
              </button>
            </div>
          </header>

          <div className="home-grid-split">
            <div className="home-stat-card">
              <p className="row-sub">Group</p>
              <p className="stat-title">{groupSnapshot.name}</p>
              <p className="stat-subline">
                Rank #{groupSnapshot.rank} | {groupSnapshot.members} members
              </p>
              <span className="stat-chip">{groupSnapshot.trend}</span>
            </div>
            <div className="home-stat-card">
              <p className="row-sub">Leaderboard</p>
              <p className="stat-title">
                #{rankSnapshot.position} of {rankSnapshot.total}
              </p>
              <p className="stat-subline">
                Streak: {streakDays} days | keep finishing quests
              </p>
              <span className="stat-chip neutral">Next goal: top 10</span>
            </div>
          </div>
        </section>

        <section className="home-panel home-panel-wide">
          <header className="home-panel-head">
            <div>
              <p className="home-eyebrow">Navigate</p>
              <h2 className="home-panel-title">Jump to any tab</h2>
            </div>
          </header>
          <div className="home-nav-grid">
            <button
              className="home-nav-card"
              onClick={() => navigate("/quests")}
            >
              <span className="nav-icon">Q</span>
              <div>
                <p className="nav-title">Quests</p>
                <p className="nav-sub">Finish tasks, earn XP</p>
              </div>
            </button>
            <button
              className="home-nav-card"
              onClick={() => navigate("/duels")}
            >
              <span className="nav-icon">D</span>
              <div>
                <p className="nav-title">Duels</p>
                <p className="nav-sub">Check active battles</p>
              </div>
            </button>
            <button
              className="home-nav-card"
              onClick={() => navigate("/groups")}
            >
              <span className="nav-icon">G</span>
              <div>
                <p className="nav-title">Groups</p>
                <p className="nav-sub">See how your friends are doing</p>
              </div>
            </button>
            <button
              className="home-nav-card"
              onClick={() => navigate("/leaderboard")}
            >
              <span className="nav-icon">R</span>
              <div>
                <p className="nav-title">Ranks</p>
                <p className="nav-sub">Climb the leaderboard</p>
              </div>
            </button>
            <button
              className="home-nav-card"
              onClick={() => navigate("/add-quests")}
            >
              <span className="nav-icon">+</span>
              <div>
                <p className="nav-title">Add quest</p>
                <p className="nav-sub">Set a new target</p>
              </div>
            </button>
            <button
              className="home-nav-card"
              onClick={() => navigate("/profile")}
            >
              <span className="nav-icon">P</span>
              <div>
                <p className="nav-title">Profile</p>
                <p className="nav-sub">Adjust your settings</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

