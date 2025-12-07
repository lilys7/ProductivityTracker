import "./JoinFriends.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinFriends() {

  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (selected === "create") navigate("/create-group");
    if (selected === "join") navigate("/join-group");
  }

  return (
    <div className="join-page">

      <div className="join-card">

        <div className="join-steps">
          <div className="join-step active"></div>
          <div className="join-step active"></div>
          <div className="join-step active"></div>
          <div className="join-step"></div>
        </div>

        <h2>Join Your Friends</h2>
        <p className="join-sub">
          Create a group or join one with a code
        </p>

        <div className="join-grid">

          <div
            className={
              "join-box " +
              (selected === "create" ? "selected" : "")
            }
            onClick={() => setSelected("create")}
          >
            <span className="join-icon">👥</span>
            <h4>Create Group</h4>
            <p>Start a new group</p>
          </div>

          <div
            className={
              "join-box " +
              (selected === "join" ? "selected" : "")
            }
            onClick={() => setSelected("join")}
          >
            <span className="join-icon">⌘</span>
            <h4>Join Group</h4>
            <p>Use a group code</p>
          </div>
        </div>

        <button
          disabled={!selected}
          className={`join-continue ${selected ? "enabled" : ""}`}
          //clicks accoridng to the two routes defined above
          onClick={(handleContinue)}
        >
          Continue
        </button>

        <button
          className="join-back"
          onClick={() => navigate("/select-habits")}
        >
          ← Back
        </button>

      </div>
    </div>
  );
}
