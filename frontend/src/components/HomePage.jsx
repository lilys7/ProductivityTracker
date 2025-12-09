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
  
  return (
    <div>
      <p>HomePage loading…</p>
    </div>
  );
}

