import React, { useMemo } from "react";
import TopTabs from "../components/TopTabs";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

// Import your JSON file
import callLogsJSON from "./temp.json";

// Colors for charts
const COLORS = ["#fb2c2c", "#fbbf24", "#3b82f6", "#10b981", "#8b5cf6"];

export default function ChartsPage() {
  // Convert JSON to array
  const callLogs = useMemo(() => Object.values(callLogsJSON), []);

  // 1️⃣ Call volume over time (group by date)
  const callVolume = useMemo(() => {
    const volume = {};
    callLogs.forEach((c) => {
      const date = c.start_time.split("T")[0];
      volume[date] = (volume[date] || 0) + 1;
    });
    return Object.entries(volume).map(([date, count]) => ({ date, count }));
  }, [callLogs]);

  // 2️⃣ Intent distribution
  const intentDistribution = useMemo(() => {
    const intents = {};
    callLogs.forEach((c) => {
      intents[c.intent] = (intents[c.intent] || 0) + 1;
    });
    return Object.entries(intents).map(([name, value]) => ({ name, value }));
  }, [callLogs]);

  // 3️⃣ Department workload (map intent to department)
  const intentToDepartment = { technical: "Tech", sales: "Sales", unknown: "Unknown" };
  const departmentWorkload = useMemo(() => {
    const deptCount = {};
    callLogs.forEach((c) => {
      const dept = intentToDepartment[c.intent] || "Unknown";
      deptCount[dept] = (deptCount[dept] || 0) + 1;
    });
    return Object.entries(deptCount).map(([name, value]) => ({ name, value }));
  }, [callLogs]);

  return (
    <div>
      <TopTabs />
      <div className="pt-20 px-4 flex flex-col items-center min-h-screen bg-gray-100 gap-6">
        <h2 className="text-2xl font-semibold mb-4">Call Analytics</h2>

        {/* Charts container */}
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          {/* Call Volume Line Chart */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="font-medium mb-2 text-center">Call Volume Over Time</h3>
            <LineChart width={400} height={250} data={callVolume} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#fb2c2c" />
            </LineChart>
          </div>

          {/* Intent Distribution Pie Chart */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="font-medium mb-2 text-center">Intent Distribution</h3>
            <PieChart width={400} height={250}>
              <Pie data={intentDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {intentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Department Workload Bar Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-4xl">
          <h3 className="font-medium mb-2 text-center">Department Workload</h3>
          <BarChart width={800} height={300} data={departmentWorkload} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#fb2c2c" />
          </BarChart>
        </div>

        {/* Recent Calls Table */}
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4">
          <h3 className="font-medium mb-2 text-center">Recent Calls</h3>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border-b border-gray-300">Caller</th>
                <th className="px-4 py-2 border-b border-gray-300">Receiver</th>
                <th className="px-4 py-2 border-b border-gray-300">Intent</th>
                <th className="px-4 py-2 border-b border-gray-300">Duration (s)</th>
                <th className="px-4 py-2 border-b border-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {callLogs
                .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
                .map((c, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-2 border-b border-gray-300">{c.caller_number}</td>
                    <td className="px-4 py-2 border-b border-gray-300">{c.receiver_number}</td>
                    <td className="px-4 py-2 border-b border-gray-300">{c.intent}</td>
                    <td className="px-4 py-2 border-b border-gray-300">{c.duration}</td>
                    <td className="px-4 py-2 border-b border-gray-300">{c.start_time.split("T")[0]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
