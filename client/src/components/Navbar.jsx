import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ setUserData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserData(null);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-md px-6 py-4 font-sans sticky top-0 z-50"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-blue-700">HRMS</div>

        <button
          className="lg:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className="hidden lg:flex items-center gap-6 text-gray-700 font-medium">
          <NavItem to="/dashboard">Dashboard</NavItem>

          <Dropdown
            label="Leave"
            open={leaveOpen}
            setOpen={setLeaveOpen}
            items={[
              { label: 'Apply for Leave', to: '/apply-leave' },
              { label: 'Leave History', to: '/leave-history' },
              { label: 'Pending Leaves', to: '/pending-leaves' },
            ]}
          />

          <NavItem to="/loan">Loan</NavItem>
          <NavItem to="/reports">Reports</NavItem>

          <Dropdown
            label="System"
            open={systemOpen}
            setOpen={setSystemOpen}
            items={[
              {
                label: 'Logout',
                onClick: handleLogout,
                className: 'text-red-600 hover:bg-red-50',
              },
            ]}
          />
        </ul>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden mt-4 flex flex-col gap-2 text-gray-700 font-medium"
          >
            <NavItem to="/dashboard" mobile>Dashboard</NavItem>

            <MobileDropdown label="Leave" items={[
              { label: 'Apply for Leave', to: '/apply-leave' },
              { label: 'Leave History', to: '/leave-history' },
              { label: 'Pending Leaves', to: '/pending-leaves' },
            ]} />

            <NavItem to="/loan" mobile>Loan</NavItem>
            <NavItem to="/reports" mobile>Reports</NavItem>

            <button
              onClick={handleLogout}
              className="text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded"
            >
              Logout
            </button>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavItem = ({ to, children, mobile = false }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${mobile ? 'px-4 py-2' : ''} ${
        isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-500'
      } transition rounded`
    }
  >
    {children}
  </NavLink>
);

const Dropdown = ({ label, items, open, setOpen }) => (
  <div className="relative group" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
    <button className="flex items-center gap-1 hover:text-blue-500 transition">
      {label} <ChevronDown size={16} />
    </button>
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="absolute bg-white shadow-md rounded-md mt-2 p-2 z-50 min-w-[160px]"
        >
          {items.map((item, i) =>
            item.to ? (
              <NavLink
                key={i}
                to={item.to}
                className="block px-4 py-2 hover:bg-blue-50 rounded"
              >
                {item.label}
              </NavLink>
            ) : (
              <button
                key={i}
                onClick={item.onClick}
                className={`block w-full text-left px-4 py-2 rounded ${item.className || 'hover:bg-blue-50'}`}
              >
                {item.label}
              </button>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const MobileDropdown = ({ label, items }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col px-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between py-2 w-full text-left hover:text-blue-500"
      >
        {label} <ChevronDown size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-4"
          >
            {items.map((item, i) => (
              <NavLink
                key={i}
                to={item.to}
                className="block py-1 text-sm hover:text-blue-500"
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
