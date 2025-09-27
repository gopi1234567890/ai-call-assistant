import { useState } from "react";
import TopTabs from "../components/TopTabs";

export default function Departments() {
  const [activeTab, setActiveTab] = useState("departments");
  const [selectedDepartment, setSelectedDepartment] = useState("support");

  const departments = [
    { name: "support", number: "1234", routingNumber: "123456" },
    { name: "sales", number: "5678", routingNumber: "789012" },
    { name: "marketing", number: "9012", routingNumber: "345678" },
  ];

  const currentDept =
    departments.find((dept) => dept.name === selectedDepartment) || departments[0];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Tabs */}
      <TopTabs activeTab={activeTab} onTabClick={setActiveTab} />

      {/* Main Content */}
      <div className="p-8">
        {activeTab === "departments" && (
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Departments</h2>

            <div className="flex items-center gap-4 mb-6">
              <label className="font-medium">Select Department:</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              >
                {departments.map((dept) => (
                  <option key={dept.name} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-medium">Department:</span>
                <span>{currentDept.name}</span>
              </div>
              <div className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-medium">Number:</span>
                <span>{currentDept.number}</span>
              </div>
              <div className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-medium">Routing Number:</span>
                <span>{currentDept.routingNumber}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                Add Department
              </button>
              <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
                Delete Department
              </button>
              <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition">
                Suspend Department
              </button>
            </div>
          </div>
        )}

        {activeTab === "charts" && (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center text-2xl">
            Charts Content
          </div>
        )}

        {activeTab === "calllogs" && (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center text-2xl">
            Call Logs Content
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center text-2xl">
            Profile Content
          </div>
        )}
      </div>
    </div>
  );
}
