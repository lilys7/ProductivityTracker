import { useState } from "react";
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

const GROUPS = [
  {
    id: "g1",
    name: "Room 412 Grind Squad",
    members: [
      { id: "sarah", name: "Sarah_K", level: 15, emoji: "👩‍🦱" },
      { id: "mike", name: "Mike_T", level: 12, emoji: "👨‍🦱" },
    ],
  },
  {
    id: "g2",
    name: "CS Freshman Focus",
    members: [
      { id: "alex", name: "Alex_R", level: 18, emoji: "🧑‍💻" },
      { id: "mark", name: "Mark_S", level: 9, emoji: "🧑‍🎓" },
    ],
  },
];


export default function CreateDuel() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedHabit, setSelectedHabit] = useState(HABITS[0].id);
  const [targetHours, setTargetHours] = useState(8);
  const [duration, setDuration] = useState(DURATIONS[0].id);
  const [groupId, setGroupId] = useState(GROUPS[0].id);
  const [opponentId, setOpponentId] = useState(GROUPS[0].members[0].id);
  const [loading, setLoading] = useState(false);

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

    // find opponent name from the selected group
    const activeGroup = GROUPS.find((g) => g.id === groupId) ?? GROUPS[0];
    const friend =
      activeGroup.members.find((m) => m.id === opponentId) ??
      activeGroup.members[0];

    const payload = {
      userId,
      habit: selectedHabit,
      targetHours,
      duration,
      groupId,
      opponentId,
      opponentName: friend?.name || "Friend",
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
        opponentId={opponentId}
        onChangeGroup={setGroupId}
        onChangeOpponent={setOpponentId}
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

function StepOpponent({
  groupId,
  opponentId,
  onChangeGroup,
  onChangeOpponent,
}) {
  const groups = GROUPS;
  const activeGroup =
    groups.find((g) => g.id === groupId) ?? groups[0];

  const members = activeGroup.members;

  return (
    <section className="create-section">
      <h2 className="create-section-title">Choose Opponent</h2>
      <p className="create-section-sub">
        Pick a group and then select who you want to challenge.
      </p>

      {/* group tabs */}
      <div className="opponent-group-tabs">
        {groups.map((g) => (
          <button
            key={g.id}
            className={
              "opponent-group-pill " +
              (g.id === activeGroup.id
                ? "opponent-group-pill-active"
                : "")
            }
            onClick={() => {
              onChangeGroup(g.id);
              onChangeOpponent(g.members[0]?.id);
            }}
          >
            {g.name}
          </button>
        ))}
      </div>

      <input
        type="text"
        className="opponent-search"
        placeholder="Search friends (visual only)..."
        readOnly
      />

      <div className="opponent-list">
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
                <div className="opponent-avatar">{friend.emoji}</div>
                <div>
                  <div className="opponent-name">{friend.name}</div>
                  <div className="opponent-level">
                    Level {friend.level}
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
