import React, { useState, useEffect } from "react";
import TopTabs from "../components/TopTabs";

export default function DepartmentsPage() {
  // Load departments from localStorage or use default
  const defaultDepartments = [
    { name: "Billing", phone: "+1234567890" },
    { name: "Technical", phone: "+1987654321" },
  ];

  const [departments, setDepartments] = useState([]);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptPhone, setNewDeptPhone] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [message, setMessage] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("departments");
    if (saved) {
      setDepartments(JSON.parse(saved));
    } else {
      setDepartments(defaultDepartments);
    }
  }, []);

  // Save to localStorage whenever departments change
  useEffect(() => {
    localStorage.setItem("departments", JSON.stringify(departments));
  }, [departments]);

  // Add new department
  const handleAdd = () => {
    if (!newDeptName || !newDeptPhone) return;
    setDepartments((prev) => [...prev, { name: newDeptName, phone: newDeptPhone }]);
    setNewDeptName("");
    setNewDeptPhone("");
    setMessage("Department added successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  // Delete department
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Save edits
  const handleSaveEdit = (index, updatedDept) => {
    setDepartments((prev) =>
      prev.map((dept, i) => (i === index ? updatedDept : dept))
    );
    setEditIndex(null);
    setMessage("Department updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <TopTabs />
      <div className="pt-20 px-4 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">Departments</h2>

        {/* Add Department Form */}
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">Add New Department</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Department Name"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              className="w-1/2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newDeptPhone}
              onChange={(e) => setNewDeptPhone(e.target.value)}
              className="w-1/2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={handleAdd}
            className="py-1 px-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Add Department
          </button>
        </div>

        {/* Message */}
        {message && <p className="text-green-600 mb-3">{message}</p>}

        {/* Departments Table */}
        <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border-b border-gray-300 text-left">Department</th>
                <th className="px-4 py-2 border-b border-gray-300 text-left">Phone</th>
                <th className="px-4 py-2 border-b border-gray-300 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => (
                <tr key={index} className="bg-white">
                  {editIndex === index ? (
                    <>
                      <td className="px-4 py-2 border-b border-gray-300">
                        <input
                          type="text"
                          value={dept.name}
                          onChange={(e) =>
                            setDepartments((prev) =>
                              prev.map((d, i) =>
                                i === index ? { ...d, name: e.target.value } : d
                              )
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        <input
                          type="text"
                          value={dept.phone}
                          onChange={(e) =>
                            setDepartments((prev) =>
                              prev.map((d, i) =>
                                i === index ? { ...d, phone: e.target.value } : d
                              )
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300 flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(index, dept)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditIndex(null)}
                          className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 border-b border-gray-300">{dept.name}</td>
                      <td className="px-4 py-2 border-b border-gray-300">{dept.phone}</td>
                      <td className="px-4 py-2 border-b border-gray-300 flex gap-2">
                        <button
                          onClick={() => setEditIndex(index)}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
