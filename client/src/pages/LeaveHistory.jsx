import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const LeaveHistory = ({ userData }) => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetLeaveHistory?EmpCode=${userData.ls_EMPCODE}`);
        if (response.data?.lst_LeaveHistory) {
          setLeaveHistory(response.data.lst_LeaveHistory);
        } else {
          setError('No leave history found.');
        }
      } catch (err) {
        setError('Failed to fetch leave history.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, [userData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Leave History</h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-blue-100 text-blue-800 font-semibold">
                  <th className="py-2 px-4 text-left">Leave Type</th>
                  <th className="py-2 px-4 text-left">From Date</th>
                  <th className="py-2 px-4 text-left">To Date</th>
                  <th className="py-2 px-4 text-left">Days</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{leave.ls_LeaveName}</td>
                    <td className="py-2 px-4">{dayjs(leave.ld_FromDate).format('YYYY-MM-DD')}</td>
                    <td className="py-2 px-4">{dayjs(leave.ld_ToDate).format('YYYY-MM-DD')}</td>
                    <td className="py-2 px-4">{leave.li_NumDays}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          leave.ls_Status === 'Approved'
                            ? 'bg-green-100 text-green-700'
                            : leave.ls_Status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {leave.ls_Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LeaveHistory;
