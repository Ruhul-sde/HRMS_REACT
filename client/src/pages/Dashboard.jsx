import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircle,
  Clock,
  Briefcase,
  Building2,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Dashboard = ({ userData, setUserData }) => {
  const navigate = useNavigate();

  // Helper to format date string like "01-01-2025 00:00:00" => "01-01-2025"
  // If your date format is different, adjust this accordingly
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    // split by space and take first part (date only)
    const datePart = dateStr.split(' ')[0];
    return datePart;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white font-sans">
      {/* Navbar */}
      <Navbar setUserData={setUserData} />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 mb-6 shadow text-center">
          <h2 className="text-3xl font-semibold">
            Welcome, {userData?.ls_EMPNAME || 'Employee'}!
          </h2>
          <p className="text-sm mt-1 opacity-90">
            Here's your personalized HR dashboard
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <InfoCard icon={<UserCircle />} label="Employee ID" value={userData?.ls_EMPCODE} />
          <InfoCard icon={<Building2 />} label="Department" value={userData?.ls_Department} />
          <InfoCard icon={<Briefcase />} label="Designation" value={userData?.ls_Designation} />
          <InfoCard icon={<Clock />} label="Joining Date" value={formatDate(userData?.ls_JoinDate)} />
        </div>

        {/* Main Section: Profile & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Profile */}
          <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">
              Employee Profile
            </h3>
            <div className="flex gap-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div className="grid grid-cols-2 gap-4 text-sm w-full">
                <LabelValue label="Full Name" value={userData?.ls_EMPNAME} />
                <LabelValue label="Email" value={userData?.ls_Email} />
                <LabelValue label="Mobile" value={userData?.ls_Mobile} />
                <LabelValue label="Date of Birth" value={formatDate(userData?.ls_BirthDate)} />
                <LabelValue label="Gender" value={userData?.ls_Gender} />
                <LabelValue label="Employee Type" value={userData?.ls_EMPTYPE} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <ModernAction label="📝 Apply for Leave" onClick={() => navigate('/apply-leave')} />
              <ModernAction label="🏦 Apply for Loan" onClick={() => alert('Loan module coming soon')} />
              <ModernAction label="🔒 Change Password" onClick={() => alert('Change Password feature coming soon')} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-4">
    <div className="text-blue-600 text-xl">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-bold text-gray-800 text-lg">{value || 'N/A'}</p>
    </div>
  </div>
);

const LabelValue = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="text-gray-800 font-medium text-sm">{value || 'N/A'}</p>
  </div>
);

const ModernAction = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-900 px-5 py-3 rounded-xl font-medium shadow-sm border border-blue-200 hover:shadow-md transition-all"
  >
    <span>{label}</span>
    <span className="text-lg">→</span>
  </button>
);

export default Dashboard;
