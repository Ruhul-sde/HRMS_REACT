import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

// Reusable small label-value display component
const LabelValue = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-gray-500 text-xs font-semibold uppercase">{label}</p>
    <p className="text-gray-800 font-medium text-sm">{value || 'N/A'}</p>
  </div>
);

const LeaveApply = ({ userData }) => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    fromTime: '',
    toTime: '',
    reason: '',
    halfDay: false,
    numDays: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(true);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const res = await axios.get('http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetLeaveTypes');
        if (res.data && res.data.lst_ClsMstrLeavTypDtls) {
          setLeaveTypes(res.data.lst_ClsMstrLeavTypDtls);
        } else if (Array.isArray(res.data)) {
          setLeaveTypes(res.data);
        } else {
          setLeaveTypes([]);
          setError('No leave types found.');
        }
      } catch {
        setError('Failed to fetch leave types.');
      } finally {
        setLoadingLeaveTypes(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  const calculateDays = (fromDate, toDate, halfDay) => {
    if (!fromDate || !toDate) return 0;
    const start = dayjs(fromDate);
    const end = dayjs(toDate);
    let days = end.diff(start, 'day') + 1;
    if (days < 1) days = 0;
    if (halfDay) days = 0.5; // Override if half day selected
    return days;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedForm = { ...form };

    if (type === 'checkbox') {
      updatedForm[name] = checked;

      // If halfDay is checked, disable toDate and clear it
      if (name === 'halfDay' && checked) {
        updatedForm.toDate = updatedForm.fromDate; // force toDate = fromDate
        updatedForm.numDays = 0.5;
        updatedForm.fromTime = '';
        updatedForm.toTime = '';
      } else if (name === 'halfDay' && !checked) {
        updatedForm.numDays = calculateDays(updatedForm.fromDate, updatedForm.toDate, false);
      }
    } else {
      updatedForm[name] = value;

      if (name === 'fromDate' || name === 'toDate') {
        // If halfDay is selected, force toDate = fromDate
        if (updatedForm.halfDay) {
          updatedForm.toDate = updatedForm.fromDate;
          updatedForm.numDays = 0.5;
          updatedForm.fromTime = '';
          updatedForm.toTime = '';
        } else {
          updatedForm.numDays = calculateDays(updatedForm.fromDate, updatedForm.toDate, false);

          // Clear time if dates no longer same day
          if (updatedForm.fromDate !== updatedForm.toDate) {
            updatedForm.fromTime = '';
            updatedForm.toTime = '';
          }
        }
      }
    }

    setForm(updatedForm);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.leaveType || !form.fromDate || !form.toDate || !form.reason) {
      return setError('Please fill in all required fields.');
    }

    // For same day leave without halfDay, require times
    if (form.fromDate === form.toDate && !form.halfDay && (!form.fromTime || !form.toTime)) {
      return setError('From Time and To Time are required for same-day leave.');
    }

    try {
      const payload = {
        ls_EmpCode: userData.ls_EMPCODE,
        ls_LeaveCode: form.leaveType,
        ld_FromDate: form.fromDate,
        ld_ToDate: form.toDate,
        ls_FromTime: form.fromTime || '',
        ls_ToTime: form.toTime || '',
        ls_Reason: form.reason,
        li_NumDays: form.numDays,
      };

      await axios.post('http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/LeavApply', payload);

      setSuccess('Leave applied successfully!');
      setForm({
        leaveType: '',
        fromDate: '',
        toDate: '',
        fromTime: '',
        toTime: '',
        reason: '',
        halfDay: false,
        numDays: 0,
      });
    } catch {
      setError('Failed to apply leave. Please try again.');
    }
  };

  const isSameDay = form.fromDate && form.fromDate === form.toDate;
  const disableToDate = form.halfDay;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="font-bold text-xl">KKD HRMS - Leave Apply</h1>
        <div>
          {/* Add more nav items if needed */}
        </div>
      </nav>

      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-10 mx-auto mt-10 w-full max-w-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-blue-700 text-center mb-8">Apply for Leave</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Type & Number of Days */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="leaveType" className="block text-sm font-semibold text-gray-700 mb-1">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                id="leaveType"
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                required
                disabled={loadingLeaveTypes}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="" disabled>
                  {loadingLeaveTypes ? 'Loading leave types...' : 'Select leave type'}
                </option>
                {leaveTypes.map((type) => (
                  <option key={type.ls_CODE} value={type.ls_CODE}>
                    {type.ls_NAME}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Days</label>
              <input
                type="text"
                readOnly
                value={form.numDays}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                aria-readonly="true"
              />
            </div>
          </div>

          {/* From Date & To Date */}
          <div className="grid md:grid-cols-2 gap-6 items-end">
            <div>
              <label htmlFor="fromDate" className="block text-sm font-semibold text-gray-700 mb-1">
                From Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label htmlFor="toDate" className="block text-sm font-semibold text-gray-700 mb-1">
                To Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
                required
                disabled={disableToDate}
                className={`w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                  disableToDate
                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
            </div>
          </div>

          {/* Half Day Checkbox */}
          <div>
            <label className="inline-flex items-center gap-2 cursor-pointer text-gray-700 select-none">
              <input
                type="checkbox"
                name="halfDay"
                checked={form.halfDay}
                onChange={handleChange}
                className="accent-blue-600"
                disabled={!form.fromDate} // disable if no fromDate selected
              />
              <span className="font-semibold">Half Day</span>
            </label>
          </div>

          {/* Time inputs only if same day and not half day */}
          {isSameDay && !form.halfDay && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fromTime" className="block text-sm font-semibold text-gray-700 mb-1">
                  From Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="fromTime"
                  name="fromTime"
                  value={form.fromTime}
                  onChange={handleChange}
                  required={isSameDay && !form.halfDay}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label htmlFor="toTime" className="block text-sm font-semibold text-gray-700 mb-1">
                  To Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="toTime"
                  name="toTime"
                  value={form.toTime}
                  onChange={handleChange}
                  required={isSameDay && !form.halfDay}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Write your reason for leave..."
              className="w-full px-5 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Error/Success messages */}
          {error && <p className="text-red-600 font-semibold">{error}</p>}
          {success && <p className="text-green-600 font-semibold">{success}</p>}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Apply Leave
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LeaveApply;
