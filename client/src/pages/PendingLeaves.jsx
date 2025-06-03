import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const PendingLeaves = ({ userData, pendingLeaves }) => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchPendingLeaves = async () => {
      if (!userData?.ls_EMPCODE) return;

      try {
        const res = await axios.get(
          `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetPendingLeaves?EmpCode=${userData.ls_EMPCODE}`
        );
        setLeaves(res.data.lst_PendingLeaves || []);
      } catch (err) {
        console.error("Error fetching pending leaves:", err);
      }
    };

    fetchPendingLeaves();
  }, [userData]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Pending Leaves</h2>
        {leaves.length === 0 ? (
          <p>No pending leaves.</p>
        ) : (
          <ul className="space-y-4">
            {leaves.map((leave, index) => (
              <li key={index} className="bg-white p-4 rounded-xl shadow">
                <div><strong>Type:</strong> {leave.ls_LeaveType}</div>
                <div><strong>From:</strong> {leave.ld_FromDate}</div>
                <div><strong>To:</strong> {leave.ld_ToDate}</div>
                <div><strong>Status:</strong> {leave.ls_Status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PendingLeaves;
