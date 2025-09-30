import React from "react";
import { NavLink } from "react-router-dom";
import "./Toptab.css";

export default function TopTabs() {
  const tabs = [
    { path: "/charts", label: "Charts" },
    { path: "/call", label: "Call Logs" },
    { path: "/profile", label: "Profile" },
    { path: "/departments", label: "Departments" },
    { path: "/test", label: "Voicetest" },
  ];

  return (
    <div className="navbar">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
