import React from 'react';

const Card = ({ title, icon, value, children, className = '' }) => {
  return (
    <div className={`bg-white shadow-md rounded-xl p-6 flex flex-col justify-between ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-3xl text-blue-600">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="text-4xl font-bold text-gray-900">{value}</div>
      {children && <div className="mt-3 text-gray-600">{children}</div>}
    </div>
  );
};

export default Card;
