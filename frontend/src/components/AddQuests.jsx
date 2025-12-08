import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddQuest() {
  const [title, setTitle] = useState("");
  const [xp, setXp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); // saved from login

    await fetch("http://localhost:8000/quests", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        userId,
        title,
        xp: Number(xp)
      })
    });

    navigate("/quests"); // go back to quests page
  };

  return (
    <div style={{padding:"40px"}}>
      <h2>Add New Quest</h2>

      <form onSubmit={handleSubmit}>
        <label>Quest Title</label><br/>
        <input 
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="Study for 30 min"
        /><br/><br/>

        <label>XP</label><br/>
        <input 
          type="number"
          value={xp}
          onChange={(e)=>setXp(e.target.value)}
          placeholder="50"
        /><br/><br/>

        <button type="submit">Save Quest</button>
      </form>
    </div>
  );
}
