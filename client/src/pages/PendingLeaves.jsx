import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { Loader2, AlertTriangle, CalendarClock } from 'lucide-react';

const PendingLeaves = ({ userData, setUserData }) => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingLeaves = async () => {
      if (!userData?.ls_EMPCODE) {
        setError('Employee code not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
        
        const response = await axios.get('http://localhost:5000/api/pending-leaves', {
          params: {
            ls_EmpCode: userData.ls_EMPCODE,
            ls_DocDate: today
          }
        });

        if (response.data?.success) {
          setPendingLeaves(response.data.pendingLeaves || []);
        } else {
          setError(response.data?.message || 'Failed to fetch pending leaves.');
          setPendingLeaves([]);
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load pending leaves. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingLeaves();
  }, [userData]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar setUserData={setUserData} userData={userData} />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <CalendarClock className="w-7 h-7 text-blue-600" />
          Pending Leaves
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex items-center text-red-600 bg-red-100 p-4 rounded-md">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        ) : pendingLeaves.length === 0 ? (
          <div className="text-gray-600 text-center bg-white py-10 rounded-lg shadow">
            <p>No pending leaves found.</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {pendingLeaves.reduce((sum, leave) => sum + (parseFloat(leave.openLeave) || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Open</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {pendingLeaves.reduce((sum, leave) => sum + (parseFloat(leave.usedLeave) || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Used</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {pendingLeaves.reduce((sum, leave) => sum + (parseFloat(leave.pendingLeave) || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Pending</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {pendingLeaves.reduce((sum, leave) => sum + (parseFloat(leave.closeLeave) || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Closed</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {pendingLeaves.reduce((sum, leave) => sum + (parseFloat(leave.rejectedLeave) || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Rejected</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {pendingLeaves.length}
                </div>
                <div className="text-sm text-gray-600">Leave Types</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {pendingLeaves.reduce((sum, leave) => 
                    sum + (parseFloat(leave.openLeave) || 0) + (parseFloat(leave.pendingLeave) || 0), 0
                  )}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>

            <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 font-medium">Leave Type</th>
                    <th className="px-4 py-3 font-medium">Leave Name</th>
                    <th className="px-4 py-3 font-medium text-center">Open</th>
                    <th className="px-4 py-3 font-medium text-center">Used</th>
                    <th className="px-4 py-3 font-medium text-center">Pending</th>
                    <th className="px-4 py-3 font-medium text-center">Closed</th>
                    <th className="px-4 py-3 font-medium text-center">Rejected</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {pendingLeaves.map((leave, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-all">
                      <td className="px-4 py-2 font-medium">{leave.leaveType || 'N/A'}</td>
                      <td className="px-4 py-2">{leave.leaveName || 'N/A'}</td>
                      <td className="px-4 py-2 text-center font-semibold text-green-600">
                        {parseFloat(leave.openLeave) || 0}
                      </td>
                      <td className="px-4 py-2 text-center font-semibold text-orange-600">
                        {parseFloat(leave.usedLeave) || 0}
                      </td>
                      <td className="px-4 py-2 text-center font-semibold text-blue-600">
                        {parseFloat(leave.pendingLeave) || 0}
                      </td>
                      <td className="px-4 py-2 text-center font-semibold text-gray-600">
                        {parseFloat(leave.closeLeave) || 0}
                      </td>
                      <td className="px-4 py-2 text-center font-semibold text-red-600">
                        {parseFloat(leave.rejectedLeave) || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default PendingLeaves;
