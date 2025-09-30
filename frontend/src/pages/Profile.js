import React, { useState, useEffect } from "react";
import TopTabs from "../components/TopTabs";

export default function AccountTablePage() {
  // Default account data
  const defaultAccount = {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    password: "123456",
  };

  const [account, setAccount] = useState(defaultAccount);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // Load saved account from localStorage
  useEffect(() => {
    const savedAccount = localStorage.getItem("account");
    if (savedAccount) {
      setAccount(JSON.parse(savedAccount));
    }
  }, []);

  // Persist account changes
  useEffect(() => {
    localStorage.setItem("account", JSON.stringify(account));
  }, [account]);

  const handleChange = (field, value) => {
    setAccount((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(""), 3000); // Clear message after 3s
  };

  return (
    <div>
      <TopTabs />
      <div className="pt-20 px-4 flex justify-center">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Account Information</h2>

          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left px-4 py-2 border-b border-gray-300">Attribute</th>
                <th className="text-left px-4 py-2 border-b border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(account).map((key) => (
                <tr key={key} className="bg-white">
                  <td className="px-4 py-2 border-b border-gray-300 font-medium">
                    {key.replace("_", " ").toUpperCase()}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {key === "password" ? (
                      <div className="flex items-center gap-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={account[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={account[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Message */}
          {message && <p className="text-green-600 mt-3 mb-2">{message}</p>}

          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full py-2 px-4 mt-3 rounded text-white font-medium bg-red-500 hover:bg-red-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}