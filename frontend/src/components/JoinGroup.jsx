import "./joinGroup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinGroup() {

  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const validCode = code.trim().length === 6;

  const handleContinue = () => {
    if (!validCode) return;

    // TODO: validate with backend
    navigate("/group-joined");
  };

  return (
    <div className="jg-page">

      <div className="jg-card">

        <div className="jg-steps">
          <div className="jg-step active"></div>
          <div className="jg-step active"></div>
          <div className="jg-step active"></div>
          <div className="jg-step active"></div>
        </div>

        <h2>Join Your Friends</h2>
        <p className="jg-sub">
          Create a group or join one with a code
        </p>

        <label className="jg-label">Group Code</label>

        <input
          className="jg-input"
          placeholder="GRP-XXXX"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
        //the code entered must have six characters or its invalid. show errors once backend implemented
          className={`jg-btn-light ${validCode ? "enabled" : ""}`}
          disabled={!validCode}
          onClick={handleContinue}
        >
          Continue
        </button>

        <button
          className="jg-back-link"
          onClick={() => navigate("/join-friends")}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
