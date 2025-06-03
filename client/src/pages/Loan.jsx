import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const Loan = ({ userData }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get(
          `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetLoanDetails?EmpCode=${userData.ls_EMPCODE}`
        );

        if (response.data?.lst_Loans?.length > 0) {
          setLoans(response.data.lst_Loans);
        } else {
          setError('No loan records found.');
        }
      } catch (err) {
        setError('Failed to fetch loan details.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [userData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Loan Details</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-blue-100 text-blue-800 font-semibold">
                  <th className="py-2 px-4 text-left">Loan Type</th>
                  <th className="py-2 px-4 text-left">Start Date</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Balance</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{loan.ls_LoanType}</td>
                    <td className="py-2 px-4">{dayjs(loan.ld_LoanStartDate).format('YYYY-MM-DD')}</td>
                    <td className="py-2 px-4">₹{loan.lf_LoanAmount}</td>
                    <td className="py-2 px-4">₹{loan.lf_LoanBalance}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${loan.ls_Status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                        {loan.ls_Status}
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

export default Loan;
