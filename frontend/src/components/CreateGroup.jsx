import "./createGroup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function CreateGroup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const canContinue = name.trim().length > 0;

  const handleContinue = async () => {
    if (!canContinue) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      const { data } = await api.post("/groups", {
        name,
        userId,
      });

      localStorage.setItem("groupId", data.id);
      localStorage.setItem("groupCode", data.code);
      localStorage.setItem("groupName", data.name);
      localStorage.setItem("duelhabit:onboardingComplete", "true");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Unable to create group right now.");
    }
  };

  return (
    <div className="cg-page">
      <div className="cg-card">

        <div className="cg-steps">
          <div className="cg-step active"></div>
          <div className="cg-step active"></div>
          <div className="cg-step active"></div>
          <div className="cg-step active"></div>
        </div>

        <h2>Join Your Friends</h2>
        <p className="cg-sub">
          Create a group or join one with a code
        </p>

        <label className="cg-label">Group Name</label>

        <input
          className="cg-input"
          placeholder="Morning Warriors"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />


        <button
          className={`cg-btn-light ${canContinue ? "enabled" : ""}`}
          disabled={!canContinue}
          onClick={handleContinue}
        >
          Continue
        </button>

        <button
          className="cg-back-link"
          onClick={() => navigate("/join-friends")}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
