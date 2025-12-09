import React, { useEffect, useState } from "react";
import "./groupsPage.css";
import api from "./api";
import { useNavigate } from "react-router-dom";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Please log in to manage groups.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/groups/${userId}`);
        setGroups(data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load groups right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const userId = localStorage.getItem("userId");

  const handleCreate = async () => {
    if (!groupName.trim() || !userId) return;
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post("/groups", {
        name: groupName,
        userId,
      });
      setGroups((prev) => [data, ...prev]);
      localStorage.setItem("groupId", data.id);
      localStorage.setItem("groupCode", data.code);
      localStorage.setItem("groupName", data.name);
      setGroupName("");
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "Unable to create group.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim() || !userId) return;
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post("/groups/join", {
        userId,
        code: joinCode.trim().toUpperCase(),
      });
      setGroups((prev) => {
        const exists = prev.find((g) => g.id === data.id);
        return exists ? prev : [data, ...prev];
      });
      localStorage.setItem("groupId", data.id);
      localStorage.setItem("groupCode", data.code);
      localStorage.setItem("groupName", data.name);
      setJoinCode("");
      setShowJoin(false);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "Invalid group code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="groups-container">
      <h1>Groups</h1>
      <p className="subtitle">Create or join a group with friends</p>

      <div className="top-buttons">
        <button
          className="create-btn"
          onClick={() => {
            setShowCreate(true);
            setShowJoin(false);
          }}
        >
          + Create Group
        </button>
        <button
          className="join-btn"
          onClick={() => {
            setShowJoin(true);
            setShowCreate(false);
          }}
        >
          Join Group
        </button>
      </div>

      {error && <div className="group-error">{error}</div>}

      {showCreate && (
        <div className="group-form">
          <h3>Name your group</h3>
          <input
            className="group-input"
            placeholder="Morning Warriors"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            className="create-btn"
            onClick={handleCreate}
            disabled={!groupName.trim() || submitting}
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </div>
      )}

      {showJoin && (
        <div className="group-form">
          <h3>Enter group code</h3>
          <input
            className="group-input"
            placeholder="ABCDE"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button
            className="join-btn"
            onClick={handleJoin}
            disabled={joinCode.trim().length !== 5 || submitting}
          >
            {submitting ? "Joining..." : "Join"}
          </button>
        </div>
      )}

      <h3 className="your-groups-title">Your Groups ({groups.length})</h3>

      <div className="group-list">
        {loading && <p className="subtitle">Loading groups…</p>}
        {!loading && groups.length === 0 && (
          <p className="subtitle">You are not in any groups yet.</p>
        )}
        {groups.map((g) => (
          <div className="group-card" key={g.id}>
            <div className="group-header">
              <div className="icon"></div>

              <div className="group-info">
                <h2>{g.name}</h2>
                <p>Members: {g.members?.length ?? 1}</p>

                <p className="meta">
                  👥 {g.members?.length ?? 1} members
                </p>
              </div>

              <div className="avg-xp">
                <p>Owner</p>
                <span>{g.ownerId === userId ? "You" : g.ownerId}</span>
              </div>
            </div>

            <div className="code-box">
              <p>Group Code</p>
              <div className="code">{g.code}</div>
            </div>

            <button className="leaderboard-btn"onClick={() => navigate(`/leaderboard/${g.id}`)}>
              View Leaderboard
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
