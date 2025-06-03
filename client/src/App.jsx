import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeaveApply from './pages/LeaveApply';
import PendingLeaves from './pages/PendingLeaves';

const RequireAuth = ({ user, children }) => {
  return user ? children : <Navigate to="/" replace />;
};

function App() {
  const [userData, setUserData] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Login setUserData={setUserData} />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth user={userData}>
            <Dashboard
              userData={userData?.employee}
              pendingLeaves={userData?.pendingLeaves}
              setUserData={setUserData}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/apply-leave"
        element={
          <RequireAuth user={userData}>
            <LeaveApply userData={userData?.employee} />
          </RequireAuth>
        }
      />

      <Route
        path="/pending-leaves"
        element={
          <RequireAuth user={userData}>
            <PendingLeaves
              pendingLeaves={userData?.pendingLeaves}
              userData={userData?.employee}
            />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
