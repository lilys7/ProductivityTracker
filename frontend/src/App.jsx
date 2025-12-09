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
import Signup from "./components/Signup";
import AddQuest from "./components/AddQuests";
import Leaderboard from "./components/Leaderboard";

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

  const authRedirectTarget = hasCompletedOnboarding ? "/home" : "/get-started";
  const showNav = isAuthenticated && hasCompletedOnboarding;

  // auth screens: only for NOT-logged-in users
  const renderAuthScreen = (component) =>
    isAuthenticated ? <Navigate to={authRedirectTarget} replace /> : component;

  // onboarding screens: must be logged in (but not finished onboarding)
  const renderOnboardingScreen = (component) =>
    isAuthenticated ? component : <Navigate to="/login" replace />;

  // main app screens: must be logged in and finished onboarding
  const renderMainScreen = (component) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!hasCompletedOnboarding) return <Navigate to="/get-started" replace />;
    return component;
  };

  return (
    <>
      <Routes>
        {/* root decides where to send users */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/get-started" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* auth screens */}
        <Route path="/login" element={renderAuthScreen(<Login />)} />
        <Route path="/signup" element={renderAuthScreen(<Signup />)} />

        {/* onbaording */}
        <Route
          path="/get-started"
          element={renderOnboardingScreen(<GetStarted />)}
        />
        <Route
          path="/select-habits"
          element={renderOnboardingScreen(<SelectHabits />)}
        />
        <Route
          path="/join-friends"
          element={renderOnboardingScreen(<JoinFriends />)}
        />
        <Route
          path="/create-group"
          element={renderOnboardingScreen(<CreateGroup />)}
        />
        <Route
          path="/join-group"
          element={renderOnboardingScreen(<JoinGroup />)}
        />

        {/* main app */}
        <Route path="/home" element={renderMainScreen(<HomePage />)} />
        <Route path="/quests" element={renderMainScreen(<QuestsPage />)} />
        <Route path="/duels" element={renderMainScreen(<DuelsPage />)} />
        <Route path="/duels/new" element={renderMainScreen(<CreateDuel />)} />
        <Route path="/profile" element={renderMainScreen(<ProfilePageNEW />)} />
        <Route path="/groups" element={renderMainScreen(<GroupsPage />)} />
        <Route path="/ranks" element={renderMainScreen(<RanksPage />)} />
        <Route path="/add-quests" element={renderMainScreen(<AddQuest />)} />
        <Route path="/leaderboard" element={renderMainScreen(<Leaderboard />)} />


       
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showNav && <Navigation />}
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
