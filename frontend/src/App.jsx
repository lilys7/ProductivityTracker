import "./App.css";
import QuestsPage from "./components/QuestPage.jsx";
import Login from "./components/Login";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import GetStarted from "./components/GetStarted";
import SelectHabits from "./components/SelectHabits";
import JoinFriends from "./components/JoinFriends";
import CreateGroup from "./components/CreateGroup";
import JoinGroup from "./components/JoinGroup";
import HomePage from "./components/HomePage";
import DuelsPage from "./components/DuelsPage";
import CreateDuel from "./components/CreateDuel";
import ProfilePageNEW from "./components/ProfilePage";
import GroupsPage from "./components/GroupsPage";
import RanksPage from "./components/RanksPage";
import Navigation from "./components/Navigation";

const onboardingPaths = new Set([
  "/get-started",
  "/select-habits",
  "/join-friends",
  "/create-group",
  "/join-group",
]);

const readStoredUser = () => {
  const raw = localStorage.getItem("duelhabit:user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse stored user", err);
    localStorage.removeItem("duelhabit:user");
    return null;
  }
};

function App() {
  const location = useLocation();
  const user = readStoredUser();

  const isAuthenticated = Boolean(user?.id || user?.email);
  const hasCompletedOnboarding =
    localStorage.getItem("duelhabit:onboardingComplete") === "true";

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!hasCompletedOnboarding && !onboardingPaths.has(location.pathname)) {
    return <Navigate to="/get-started" replace />;
  }
  
  return (
    <>
    <Routes>
      <Route
        path="/"
        element={
          hasCompletedOnboarding ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/get-started" replace />
          )
        }
      />
      <Route path="/home" element={<HomePage />} />
      <Route path="/quests" element={<QuestsPage />} />
      <Route path="/duels" element={<DuelsPage />} />
      <Route path="/duels" element={<DuelsPage />} />
      <Route path="/duels/new" element={<CreateDuel />} /> 
      <Route path="/profile" element={<ProfilePageNEW />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/ranks" element={<RanksPage />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/select-habits" element={<SelectHabits />} />
      <Route path="/join-friends" element={<JoinFriends />} />
      <Route path="/create-group" element={<CreateGroup />} />
      <Route path="/join-group" element={<JoinGroup />} />
    </Routes>
    {hasCompletedOnboarding && <Navigation />}
    </>
  );
}

export default App;



/*
function App() {
  const [count, setCount] = useState(0)

  return <QuestsPage />
}

export default App*/
