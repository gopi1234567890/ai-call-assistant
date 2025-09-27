import { useState, useEffect } from "react";
import TopTabs from "../components/TopTabs";

export default function CallLogs() {
  const [activeTab, setActiveTab] = useState("calllogs");
  const [calls, setCalls] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCalls() {
      try {
        const res = await fetch("http://127.0.0.1:8000/rest/call_logs"); // replace with your FastAPI endpoint
        const data = await res.json();

        // Convert API data to array of objects
        const callsArray = Object.entries(data).map(([call_sid, info]) => ({
          id: call_sid,
          ...info,
        }));

        setCalls(callsArray);

        // Dynamically get all keys for table columns
        if (callsArray.length > 0) {
          const allKeys = Object.keys(callsArray[0]);
          setColumns(allKeys);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchCalls();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <TopTabs activeTab={activeTab} onTabClick={setActiveTab} />

      <div className="p-8">
        {activeTab === "calllogs" && (
          <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-6">Call Logs</h2>
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-2 border-b text-left">
                      {col.replace("_", " ").toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
             <tbody>
  {calls.map((call) => (
    <tr key={call.id} className="hover:bg-gray-50">
      {columns.map((col) => (
        <td key={col} className="px-4 py-2 border-b">
          {call[col] === null || call[col] === undefined
            ? "N/A"
            : typeof call[col] === "object"
            ? JSON.stringify(call[col])
            : col.includes("time") && typeof call[col] === "string"
            ? call[col].split("T")[0]
            : call[col]}
        </td>
      ))}
    </tr>
  ))}
</tbody>

            </table>
          </div>
        )}

        {activeTab !== "calllogs" && (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center text-2xl">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content
          </div>
        )}
      </div>
    </div>
  );
}
