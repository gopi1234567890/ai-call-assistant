import React, { useState, useEffect } from "react";
import TopTabs from "../components/TopTabs";

export default function CallLogs() {
  // Sample fallback record
  const sampleCall = {
    caller_number: "+16594567890",
    receiver_number: "+12055987654",
    start_time: "2025-09-18T14:20:12",
    end_time: "2025-09-18T14:21:00",
    duration: 48,
    status: "completed",
    direction: "outgoing",
    call_type: "phone",
    transcription: "I recently ordered a new iPhone and need assistance with it.",
    intent: "technical",
  };

  const [calls, setCalls] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const recordsPerPage = 10;

  // Fetch backend data (replace URL with your API)
  useEffect(() => {
    async function fetchCalls() {
      try {
        const response = await fetch("http://backend:8000/call_logs");
        const data = await response.json();

        // If backend returns nothing, use sample record
        if (!data || Object.keys(data).length === 0) {
          setCalls([sampleCall]);
        } else {
          // Transform object into array of call records
          const callArray = Object.values(data);
          setCalls(callArray);
        }
      } catch (err) {
        // On error, use sample record
        setCalls([sampleCall]);
      }
    }

    fetchCalls();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(calls.length / recordsPerPage);
  const displayedRows = calls.slice(
    currentPage * recordsPerPage,
    (currentPage + 1) * recordsPerPage
  );

  return (
    <div>
      <TopTabs />
      <div className="pt-20 px-4">
        <h2 className="text-2xl font-semibold mb-4">Call Logs</h2>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              {Object.keys(sampleCall).map((key) => (
                <th
                  key={key}
                  className="text-left px-4 py-2 border-b border-gray-300"
                >
                  {key.replace("_", " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((call, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                {Object.keys(sampleCall).map((key) => (
                  <td
                    key={key}
                    className="px-4 py-2 border-b border-gray-300"
                  >
                    {call[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Buttons */}
        <div className="flex justify-end mt-4 gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 0))
            }
            disabled={currentPage === 0}
          >
            Previous &lt;
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage >= totalPages - 1}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
