import { useState } from "react";
import TopTabs from "../components/TopTabs";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState({
    name: "Hrushi Gopi",
    email: "hrushigopi8@gmail.com",
    phone: "+1 234 567 890",
    role: "Admin",
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <TopTabs activeTab={activeTab} onTabClick={setActiveTab} />

      <div className="p-8">
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">User Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 font-medium">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium">Phone</label>
                <input
                  type="text"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium">Role</label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                />
              </div>

              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab !== "profile" && (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center text-2xl">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content
          </div>
        )}
      </div>
    </div>
  );
}
