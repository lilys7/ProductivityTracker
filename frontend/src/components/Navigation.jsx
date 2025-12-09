import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Swords,
  Target,
  Users,
  Trophy,
  User,
} from "lucide-react";
import "./navigation.css";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  //routes were navbar SHOULDNT be visible
  const hiddenPaths = [
    "/login",
    "/signup",
    "/get-started",
    "/select-habits",
    "/join-friends",
  ];

  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/duels", icon: Swords, label: "Duels" },
    { path: "/quests", icon: Target, label: "Quests" },
    { path: "/groups", icon: Users, label: "Groups" },
    { path: "/leaderboard", icon: Trophy, label: "Ranks" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={
                "bottom-nav-btn " +
                (isActive ? "bottom-nav-btn-active" : "")
              }
            >
              <Icon className="bottom-nav-icon" />
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

