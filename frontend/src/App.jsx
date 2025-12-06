import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import QuestsPage from "./components/QuestPage.jsx"
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom";


function App() {
  const [count, setCount] = useState(0)
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/quests" element={<QuestsPage />} />
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
