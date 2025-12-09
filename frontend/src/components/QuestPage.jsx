import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./quests.css";

const API_BASE = "http://localhost:8000";

const initialQuests = [
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
  {
    id: 5,
    title: "Exercise for 20 minutes",
    progressText: "0/20 completed",
    xp: 90,
    completed: false,
  },
];

export default function QuestsPage() {
  const [quests, setQuests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuests = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch(`${API_BASE}/quests/${userId}`);
      const data = await res.json();
      setQuests(data);
    };

    fetchQuests();
  }, []);

  /**const handleComplete = async (_id) => {
    setQuests(prev =>
      prev.map(q =>
        q._id === _id 
          ? { ...q, completed: true }
          : q
      )
    );
  };**/
  const applyUserUpdate = (latest) => {
    if (!latest) return;
    const raw = localStorage.getItem("duelhabit:user");
    let current = null;
    try {
      current = raw ? JSON.parse(raw) : null;
    } catch {
      current = null;
    }
    const merged = { ...(current || {}), ...latest };
    localStorage.setItem("duelhabit:user", JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent("duelhabit:user-updated", { detail: merged }));
  };

  const handleComplete = async (questId) => {
    const userId = localStorage.getItem("userId");
    await fetch(`${API_BASE}/quests/complete/${questId}`, {
      method: "POST",
    }).then((res) => res.json().catch(() => ({})))
      .then((data) => {
        if (data?.user) {
          applyUserUpdate(data.user);
        }
      })
      .catch((err) => console.error(err));

    // re-fetch quests to update UI
    const res = await fetch(`${API_BASE}/quests/${userId}`);
    const updated = await res.json();
    setQuests(updated);
  };
  

  const completedCount = quests.filter((q) => q.completed).length;
  const totalQuests = quests.length;
  const totalXP = quests
    .filter((q) => q.completed)
    .reduce((sum, q) => sum + q.xp, 0);

  return (
    <div className="quests-page">
      <div className="quests-wrapper">
      <h1 className="title">Quests</h1>
      <p className="subtitle">Complete quests to earn XP and level up</p>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Completed Today</div>
          <div className="stat-value">
            {completedCount}/{totalQuests}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">XP Earned</div>
          <div className="stat-value">{totalXP} XP</div>
        </div>
        
      </div>

      <div className="tabs-row">
        <button className="tab tab-active">Daily Quests</button>
      </div>

      
      <div className="tabs-row">
      <button className="tab tab-active" onClick={()=>navigate("/add-quests")}>Add New Quest</button>
            </div>


      <div className="quests-list">
        {quests.map((quest) => (
          <div
            key={quest._id}
            className={
              "quest-card " +
              (quest.completed ? "quest-card-completed" : "")
            }
          >
            <div className="quest-header">
              <div>
                <div className="quest-title">
                  {quest.completed ? (
                    <s>{quest.title}</s>
                  ) : (
                    quest.title
                  )}
                </div>
                <div className="quest-progress">
                  {quest.progressText}
                </div>
              </div>
              <div className="quest-xp">+{quest.xp} XP</div>
            </div>

            {/* simple progress bar placeholder */}
            <div className="progress-bar">
              <div
                className={
                  "progress-inner " +
                  (quest.completed ? "progress-inner-completed" : "")
                }
              />
            </div>

            {quest.completed ? (
              <button className="completed-button" disabled>
                ✓ Completed
              </button>
            ) : (
              <button
                className="complete-button"
                onClick={() => handleComplete(quest._id)}
              >
                Mark Complete
              </button>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
