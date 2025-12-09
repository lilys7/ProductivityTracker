import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./createDuel.css";

const API_BASE = "http://localhost:8000";

const HABITS = [
  { id: "sleep", label: "Sleep", icon: "🌙" },
  { id: "hydration", label: "Hydration", icon: "💧" },
  { id: "study", label: "Study", icon: "📚" },
  { id: "screen", label: "Screen Detox", icon: "📵" },
  { id: "exercise", label: "Exercise", icon: "💪" },
];

const DURATIONS = [
  { id: "24h", label: "24 hours" },
  { id: "48h", label: "48 hours" },
  { id: "72h", label: "72 hours" },
  { id: "7d", label: "7 days" },
];

export default function CreateDuel() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedHabit, setSelectedHabit] = useState(HABITS[0].id);
  const [targetHours, setTargetHours] = useState(8);
  const [duration, setDuration] = useState(DURATIONS[0].id);
  const [groupId, setGroupId] = useState(localStorage.getItem("groupId") || "");
  const [groupName, setGroupName] = useState(localStorage.getItem("groupName") || "");
  const [groups, setGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [opponentId, setOpponentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [memberError, setMemberError] = useState("");

  // load all groups the user belongs to; any member can start a duel
  useEffect(() => {
    const loadGroups = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setMemberError("Log in first, then join or create a group.");
        return;
      }

      try {
        const resGroups = await fetch(`${API_BASE}/groups/${userId}`);
        if (!resGroups.ok) throw new Error("Could not load your groups");
        const groupsData = await resGroups.json();
        setGroups(groupsData);
        if (groupsData.length > 0) {
          const gid = groupId || groupsData[0].id;
          const gname = groupsData.find((g) => g.id === gid)?.name || groupsData[0].name || "";
          setGroupId(gid);
          setGroupName(gname);
          localStorage.setItem("groupId", gid);
          localStorage.setItem("groupName", gname);
        } else {
          setMemberError("Join or create a group before starting a duel.");
        }
      } catch (err) {
        console.error(err);
        setMemberError("Unable to load your groups.");
      }
    };

    loadGroups();
  }, []);

  // load members for the selected group (any member can challenge)
  useEffect(() => {
    const loadMembers = async () => {
      const userId = localStorage.getItem("userId");
      if (!groupId || !userId) return;
      try {
        const res = await fetch(`${API_BASE}/groups/${groupId}/members`);
        if (!res.ok) throw new Error("Failed to load group members");
        const data = await res.json();
        const me = userId;
        const filtered = (data.members || []).filter((m) => m.id !== me);
        setGroupMembers(filtered);
        setOpponentId(filtered?.[0]?.id || "");
        if (filtered.length === 0) {
          setMemberError("No other members in your group yet.");
        } else {
          setMemberError("");
        }
      } catch (e) {
        console.error(e);
        setMemberError("Unable to load group members.");
      }
    };
    loadMembers();
  }, [groupId]);

  const goBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      navigate("/duels");
    }
  };

  const handleContinue = async () => {
    if (step < 4) {
      setStep((s) => s + 1);
      return;
    }
    await handleCreate();
  };

  const handleCreate = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to create a duel.");
      return;
    }
    if (!groupId) {
      alert("You need to be in a group to create a duel.");
      return;
    }
    if (!opponentId) {
      alert("Select an opponent from your group.");
      return;
    }

    // find opponent name from fetched members
    const friend = groupMembers.find((m) => m.id === opponentId);

    const payload = {
      userId,
      habit: selectedHabit,
      targetHours,
      duration,
      groupId,
      opponentId,
      opponentName: friend?.email || "Friend",
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/duels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to create duel");
      }

      navigate("/duels");
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <header className="create-header">
        <button className="create-back" onClick={goBack}>
          ←
        </button>
        <div className="create-header-text">
          <div className="create-title">Create Duel</div>
          <div className="create-step-text">Step {step} of 4</div>
        </div>
      </header>

      <StepProgress step={step} />

      {step === 1 && (
        <StepHabit
          selectedHabit={selectedHabit}
          onSelectHabit={setSelectedHabit}
        />
      )}

      {step === 2 && (
        <StepGoal
          habitId={selectedHabit}
          targetHours={targetHours}
          onChangeTarget={setTargetHours}
        />
      )}

      {step === 3 && (
        <StepDuration duration={duration} onChangeDuration={setDuration} />
      )}

      {step === 4 && (
        <StepOpponent
          groupId={groupId}
          groupName={groupName}
          groups={groups}
          onChangeGroup={(gid) => {
            setGroupId(gid);
            const gname = groups.find((g) => g.id === gid)?.name || "";
            setGroupName(gname);
            localStorage.setItem("groupId", gid || "");
            localStorage.setItem("groupName", gname || "");
          }}
          opponentId={opponentId}
          onChangeOpponent={setOpponentId}
          members={groupMembers}
          error={memberError}
        />
      )}

      <button
        className="create-primary"
        onClick={handleContinue}
        disabled={loading}
      >
        {step < 4 ? "Continue" : loading ? "Creating..." : "Create Duel"}
      </button>
    </div>
  );
}

function StepProgress({ step }) {
  const segments = [1, 2, 3, 4];
  return (
    <div className="create-progress">
      {segments.map((s) => (
        <div
          key={s}
          className={
            "create-progress-seg " +
            (s <= step ? "create-progress-active" : "")
          }
        />
      ))}
    </div>
  );
}

function StepHabit({ selectedHabit, onSelectHabit }) {
  return (
    <section className="create-section">
      <h2 className="create-section-title">Select Habit Category</h2>
      <p className="create-section-sub">
        Choose the habit you want to compete on
      </p>

      <div className="habit-grid">
        {HABITS.map((habit) => (
          <button
            key={habit.id}
            className={
              "habit-card " +
              (habit.id === selectedHabit ? "habit-card-active" : "")
            }
            onClick={() => onSelectHabit(habit.id)}
          >
            <div className="habit-icon">{habit.icon}</div>
            <div className="habit-label">{habit.label}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function StepGoal({ habitId, targetHours, onChangeTarget }) {
  const habit = HABITS.find((h) => h.id === habitId);
  return (
    <section className="create-section">
      <h2 className="create-section-title">Set Your Goal</h2>
      <p className="create-section-sub">
        How much do you want to commit to?
      </p>

      <div className="goal-card">
        <div className="goal-header">
          <div className="habit-icon">{habit?.icon}</div>
          <div>
            <div className="goal-habit-label">{habit?.label}</div>
            <div className="goal-habit-sub">
              {habit?.label || "Habit"} ≥ X hours
            </div>
          </div>
        </div>

        <label className="goal-label">Target hours</label>
        <input
          type="range"
          min="4"
          max="12"
          value={targetHours}
          onChange={(e) => onChangeTarget(Number(e.target.value))}
          className="goal-slider"
        />

        <div className="goal-summary">
          Your goal:{" "}
          <span className="goal-summary-value">
            {targetHours} hours
          </span>
        </div>
      </div>
    </section>
  );
}

function StepDuration({ duration, onChangeDuration }) {
  return (
    <section className="create-section">
      <h2 className="create-section-title">Choose Duration</h2>
      <p className="create-section-sub">
        How long should this duel last?
      </p>

      <div className="duration-grid">
        {DURATIONS.map((d) => (
          <button
            key={d.id}
            className={
              "duration-card " +
              (d.id === duration ? "duration-card-active" : "")
            }
            onClick={() => onChangeDuration(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function StepOpponent({ groupId, groupName, opponentId, onChangeOpponent, members, error, groups, onChangeGroup }) {
  return (
    <section className="create-section">
      <h2 className="create-section-title">Choose Opponent</h2>
      <p className="create-section-sub">
        Only members of your group can be challenged.
      </p>

      <div className="goal-summary">
        <label className="goal-label" htmlFor="groupSelect">Group</label>
        <select
          id="groupSelect"
          className="jg-input"
          value={groupId}
          onChange={(e) => onChangeGroup(e.target.value)}
        >
          {groups.length === 0 && <option value="">No groups yet</option>}
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name || g.code || g.id}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="goal-summary">{error}</div>}

      <div className="opponent-list">
        {members.length === 0 && (
          <div className="goal-summary">No members found in your group.</div>
        )}
        {members.map((friend) => {
          const selected = friend.id === opponentId;
          return (
            <button
              key={friend.id}
              className={
                "opponent-row " +
                (selected ? "opponent-row-active" : "")
              }
              onClick={() => onChangeOpponent(friend.id)}
            >
              <div className="opponent-left">
                <div className="opponent-avatar">👤</div>
                <div>
                  <div className="opponent-name">{friend.email}</div>
                  <div className="opponent-level">
                    Group member
                  </div>
                </div>
              </div>
              <div className="opponent-radio">
                {selected ? "●" : "○"}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
