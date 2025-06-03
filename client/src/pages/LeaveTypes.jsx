import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetLeaveTypes')
      .then((res) => {
        const result = res.data;
        if (result?.lst_ClsMstrLeavTypDtls) {
          setLeaveTypes(result.lst_ClsMstrLeavTypDtls);
        } else {
          setError('No leave types found.');
        }
      })
      .catch(() => {
        setError('Failed to fetch leave types.');
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Available Leave Types</h1>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-3">
        {leaveTypes.map((type) => (
          <li
            key={type.ls_CODE}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <span className="font-semibold">{type.ls_NAME}</span>
            <span className="text-gray-500 ml-2">(Code: {type.ls_CODE})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveTypes;
