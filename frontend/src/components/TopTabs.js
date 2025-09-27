import React from "react";
import { NavLink } from "react-router-dom";

export default function TopTabs() {
  const tabs = [
    { path: "/charts", label: "Charts" },
    { path: "/call", label: "Call Logs" },
    { path: "/profile", label: "Profile" },
    { path: "/departments", label: "Departments" },
  ];

  return (
    <div className="bg-[#241f1f] p-4 flex justify-center gap-6 shadow-md">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `px-8 py-3 rounded-2xl font-medium text-white transition-colors ${
              isActive ? "bg-[#fb2c2c]" : "bg-[#241f1f] hover:bg-gray-700"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
