import React from "react";
import "./groupsPage.css";

export default function GroupsPage() {
  const groups = [
    {
        title: "Morning Risers",
        category: "Sleep",
        members: 5,
        rank: 2,
        avgXp: 1250,
        code: "MR–A3F9"
      },
      {
        title: "Study Squad",
        category: "Study",
        members: 8,
        rank: 5,
        avgXp: 980,
        code: "SS–98K1"
      }
  ];

  return (
    <div className="groups-container">
      <h1>Groups</h1>
      <p className="subtitle">Create or join a group with friends</p>

      <div className="top-buttons">
        <button className="create-btn">+ Create Group</button>
        <button className="join-btn">Join Group</button>
      </div>

      <h3 className="your-groups-title">Your Groups ({groups.length})</h3>

      <div className="group-list">
        {groups.map((g, index) => (
          <div className="group-card" key={index}>
            <div className="group-header">
              <div className="icon"></div>

              <div className="group-info">
                <h2>{g.title}</h2>
                <p>{g.category}</p>

                <p className="meta">
                  👥 {g.members} members &nbsp; &nbsp; Rank #{g.rank}
                </p>
              </div>

              <div className="avg-xp">
                <p>Avg XP</p>
                <span>{g.avgXp}</span>
              </div>
            </div>

            <div className="code-box">
              <p>Group Code</p>
              <div className="code">{g.code}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
