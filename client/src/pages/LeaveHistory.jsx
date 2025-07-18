import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import { 
  Search, 
  Filter, 
  Calendar, 
  CheckSquare, 
  Square, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  BarChart3,
  FileText,
  Sparkles,
  CalendarDays,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LeaveHistory = ({ userData, setUserData }) => {
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    checked: false,
    status: 'ALL',
    date: dayjs().format('YYYY-MM-DD')
  });
  const [viewMode, setViewMode] = useState('cards'); // Default to cards for modern look
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: 'ALL', label: 'All Status', icon: FileText, color: 'gray' },
    { value: 'A', label: 'Approved', icon: CheckCircle, color: 'green' },
    { value: 'P', label: 'Pending', icon: Clock, color: 'yellow' },
    { value: 'R', label: 'Rejected', icon: XCircle, color: 'red' }
  ];

  const fetchLeaveHistory = async () => {
    if (!userData?.ls_EMPCODE) {
      setError('Employee Code missing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedDate = dayjs(filters.date).format('YYYYMMDD');
      const checkedValue = filters.checked ? 'Y' : 'N';

      const res = await axios.get(
        `http://localhost:5000/api/leave-history`,
        {
          params: {
            ls_EmpCode: userData.ls_EMPCODE,
            ls_DocDate: formattedDate,
            ls_Check: checkedValue,
            ls_Status: filters.status,
          },
        }
      );

      if (res.data?.success) {
        const history = res.data.leaveHistory;
        if (Array.isArray(history) && history.length > 0) {
          setLeaveData(history);
        } else {
          setLeaveData([]);
          setError('No leave history found for the selected criteria.');
        }
      } else {
        setError(res.data?.message || 'Failed to fetch leave history.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch leave history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, [userData, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Handle DD-MM-YYYY format
    if (dateString.includes('-') && dateString.split('-').length === 3) {
      const [day, month, year] = dateString.split('-');
      // Create date in YYYY-MM-DD format for proper parsing
      const formattedDate = `${year}-${month}-${day}`;
      return dayjs(formattedDate).isValid() ? dayjs(formattedDate).format('DD MMM YYYY') : dateString;
    }
    
    // Fallback for other formats
    return dayjs(dateString).isValid() ? dayjs(dateString).format('DD MMM YYYY') : dateString;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'A': { 
        label: 'Approved', 
        class: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
        icon: CheckCircle,
        color: 'text-green-600'
      },
      'P': { 
        label: 'Pending', 
        class: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200',
        icon: Clock,
        color: 'text-yellow-600'
      },
      'R': { 
        label: 'Rejected', 
        class: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200',
        icon: XCircle,
        color: 'text-red-600'
      }
    };

    const statusInfo = statusMap[status] || { 
      label: status || 'Unknown', 
      class: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200',
      icon: AlertCircle,
      color: 'text-gray-600'
    };

    const IconComponent = statusInfo.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.class} shadow-sm`}>
        <IconComponent className={`w-4 h-4 ${statusInfo.color}`} />
        {statusInfo.label}
      </span>
    );
  };

  const filteredData = leaveData.filter(item =>
    item.leaveName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateStats = () => {
    const stats = {
      total: filteredData.length,
      approved: filteredData.filter(item => item.status === 'A').length,
      pending: filteredData.filter(item => item.status === 'P').length,
      rejected: filteredData.filter(item => item.status === 'R').length,
      totalDays: filteredData.reduce((sum, item) => sum + (parseFloat(item.numberOfDays) || 0), 0)
    };
    return stats;
  };

  const stats = calculateStats();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Header */}
        <motion.div variants={cardVariants} className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold">Leave History</h1>
                    <p className="text-blue-100 text-lg">Track and analyze your leave applications</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-0 flex gap-3">
                <motion.button
                  onClick={() => fetchLeaveHistory()}
                  disabled={loading}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl transition-all backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modern Stats Cards */}
        <motion.div variants={cardVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard icon={FileText} label="Total Applications" value={stats.total} color="blue" />
          <StatsCard icon={CheckCircle} label="Approved" value={stats.approved} color="green" />
          <StatsCard icon={Clock} label="Pending" value={stats.pending} color="yellow" />
          <StatsCard icon={XCircle} label="Rejected" value={stats.rejected} color="red" />
          <StatsCard icon={Timer} label="Total Days" value={stats.totalDays.toFixed(1)} color="purple" />
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div variants={cardVariants} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Filters & Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Search className="w-4 h-4 inline mr-2" />
                Search Leaves
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by leave type or name..."
                  className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 pl-12 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200">
            {/* Checked Filter */}
            <div className="flex items-center">
              <motion.button
                onClick={() => handleFilterChange('checked', !filters.checked)}
                className="flex items-center space-x-3 text-lg text-gray-700 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {filters.checked ? (
                  <CheckSquare className="w-6 h-6 text-blue-600" />
                ) : (
                  <Square className="w-6 h-6 text-gray-400" />
                )}
                <span className="font-semibold">Show additional details</span>
              </motion.button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <span className="text-lg text-gray-600 font-medium">View:</span>
              <div className="flex bg-gray-100 rounded-2xl p-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all ${
                    viewMode === 'table' 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all ${
                    viewMode === 'cards' 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={cardVariants}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-20"
              >
                <div className="flex items-center gap-4 text-blue-600">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
                  <span className="text-2xl font-semibold">Loading leave history...</span>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 border-2 border-red-200 rounded-3xl p-12 text-center"
              >
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-red-800 mb-3">Error Loading Data</h3>
                <p className="text-red-600 text-lg">{error}</p>
              </motion.div>
            ) : filteredData.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center"
              >
                <FileText className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-3">No Leave History Found</h3>
                <p className="text-gray-500 text-lg">Try adjusting your filters or search criteria.</p>
              </motion.div>
            ) : viewMode === 'table' ? (
              <TableView data={filteredData} filters={filters} getStatusBadge={getStatusBadge} formatDate={formatDate} />
            ) : (
              <CardsView data={filteredData} filters={filters} getStatusBadge={getStatusBadge} formatDate={formatDate} />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Enhanced Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 border-blue-200 bg-blue-50',
    green: 'from-green-500 to-green-600 border-green-200 bg-green-50',
    yellow: 'from-yellow-500 to-yellow-600 border-yellow-200 bg-yellow-50',
    red: 'from-red-500 to-red-600 border-red-200 bg-red-50',
    purple: 'from-purple-500 to-purple-600 border-purple-200 bg-purple-50'
  };

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group"
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl bg-gradient-to-r ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Table View Component
const TableView = ({ data, filters, getStatusBadge, formatDate }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
  >
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
          <tr>
            <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Leave Details
            </th>
            <th className="px-8 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-8 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Date Range
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y-2 divide-gray-100">
          {data.map((item, i) => (
            <motion.tr 
              key={i} 
              className="hover:bg-gray-50 transition-colors group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <td className="px-8 py-6">
                <div>
                  <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.leaveName}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {item.leaveType}
                  </div>
                </div>
              </td>
              <td className="px-8 py-6 text-center">
                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-bold">
                  <Timer className="w-4 h-4" />
                  {item.numberOfDays} days
                </span>
              </td>
              <td className="px-8 py-6 text-center">
                {getStatusBadge(item.status)}
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-gray-400" />
                  <div className="text-lg text-gray-900">
                    {item.fromDate && item.toDate ? (
                      <div>
                        <div className="font-semibold">{formatDate(item.fromDate)}</div>
                        {item.fromDate !== item.toDate && (
                          <div className="text-gray-500">to {formatDate(item.toDate)}</div>
                        )}
                      </div>
                    ) : '-'}
                  </div>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// Cards View Component
const CardsView = ({ data, filters, getStatusBadge, formatDate }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {data.map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 group"
        whileHover={{ y: -8, scale: 1.02 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              {item.leaveName}
            </h3>
            <p className="text-lg text-gray-500 font-medium">{item.leaveType}</p>
          </div>
          <div className="ml-4">
            {getStatusBadge(item.status)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="text-lg text-blue-700 font-semibold">Duration</span>
            </div>
            <span className="text-2xl font-bold text-blue-800">{item.numberOfDays} days</span>
          </div>

          {item.fromDate && item.toDate && (
            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <CalendarDays className="w-5 h-5 text-gray-600" />
                <span className="text-lg text-gray-700 font-semibold">Date Range</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">From:</span>
                  <span className="font-bold text-gray-800 text-lg">
                    {formatDate(item.fromDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">To:</span>
                  <span className="font-bold text-gray-800 text-lg">
                    {formatDate(item.toDate)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    ))}
  </div>
);

export default LeaveHistory;