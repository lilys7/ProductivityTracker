import "./selectHabits.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectHabits() {

  const navigate = useNavigate();

  const habitsList = [
    { id: 1, name: "Sleep", icon: "🌙" },
    { id: 2, name: "Hydration", icon: "💧" },
    { id: 3, name: "Study/Focusing", icon: "📘" },
    { id: 4, name: "Screen Time Detox", icon: "📵" },
    { id: 5, name: "Exercise", icon: "🏋️" },
    { id: 6, name: "Coding / LeetCode", icon: "💻" }
  ];

  const [selected, setSelected] = useState([]);

  const toggleHabit = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="habits-page">

      <div className="habits-card">

        {/*steps */}
        <div className="habits-steps">
          <div className="habits-step active"></div>
          <div className="habits-step active"></div>
          <div className="habits-step"></div>
          <div className="habits-step"></div>
        </div>

        <h2>Choose Your Core Habits</h2>
        <p className="sub">
          Select the habits you want to focus on
        </p>

        <div className="habits-grid">
          {habitsList.map((h) => (
            <div
              key={h.id}
              className={
                "habit-box " +
                (selected.includes(h.id) ? "selected" : "")
              }
              onClick={() => toggleHabit(h.id)}
            >
              <span className="habit-icon">{h.icon}</span>
              <span>{h.name}</span>
              {selected.includes(h.id) && (
                <span className="check">✓</span>
              )}
            </div>
          ))}
        </div>

        <button
          className="continue-btn"
          onClick={() => navigate("/next")}
        >
          Continue
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/get-started")}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
