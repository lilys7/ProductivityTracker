import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import QuestsPage from "./components/QuestPage.jsx";
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom";
import GetStarted from "./components/GetStarted";
import SelectHabits from "./components/SelectHabits";
import JoinFriends from "./components/JoinFriends";
import CreateGroup from "./components/CreateGroup";
import JoinGroup from "./components/JoinGroup";
import HomePage from "./components/HomePage";
import DuelsPage from "./components/DuelsPage";
import ProfilePageNEW from "./components/ProfilePage";
import GroupsPage from "./components/GroupsPage";
import RanksPage from "./components/RanksPage";
import AddQuest from "./components/AddQuests";

function App() {
  const [count, setCount] = useState(0);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/quests" element={<QuestsPage />} />
      <Route path="/add-quests" element={<AddQuest />} />
      <Route path="/duels" element={<DuelsPage />} />
      <Route path="/profile" element={<ProfilePageNEW />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/ranks" element={<RanksPage />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/select-habits" element={<SelectHabits />} />
      <Route path="/join-friends" element={<JoinFriends />} />
      <Route path="/create-group" element={<CreateGroup />} />
      <Route path="/join-group" element={<JoinGroup />} />
      
    </Routes>
  );
}

export default App;



/*
function App() {
  const [count, setCount] = useState(0)

  return <QuestsPage />
}

export default App*/
