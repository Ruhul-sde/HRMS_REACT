import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CalendarCheck2, Wallet, FileText } from 'lucide-react';

const reports = [
  {
    title: 'Attendance Report',
    description: 'Monthly attendance summary of employees.',
    icon: <CalendarCheck2 className="w-6 h-6 text-white" />,
    bg: 'bg-blue-500',
  },
  {
    title: 'Leave Report',
    description: 'Leave records and balances.',
    icon: <FileText className="w-6 h-6 text-white" />,
    bg: 'bg-green-500',
  },
  {
    title: 'Loan Report',
    description: 'Loan disbursed and repayment status.',
    icon: <Wallet className="w-6 h-6 text-white" />,
    bg: 'bg-purple-500',
  },
  {
    title: 'Performance Report',
    description: 'Performance metrics and reviews.',
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    bg: 'bg-yellow-500',
  },
];

const Reports = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Reports Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <motion.div
              key={index}
              className={`p-5 rounded-xl shadow-lg text-white flex items-center gap-4 ${report.bg}`}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="p-3 bg-white bg-opacity-20 rounded-full">{report.icon}</div>
              <div>
                <h2 className="text-lg font-semibold">{report.title}</h2>
                <p className="text-sm">{report.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
