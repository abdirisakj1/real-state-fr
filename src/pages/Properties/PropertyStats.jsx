import React from 'react';
import { FiHome } from 'react-icons/fi';

const PropertyStats = ({ properties }) => {
  // Example stats: total, available, occupied, maintenance
  const total = properties.length;
  const available = properties.filter(p => p.status === 'available').length;
  const occupied = properties.filter(p => p.status === 'occupied').length;
  const maintenance = properties.filter(p => p.status === 'maintenance').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Properties</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
          </div>
          <FiHome className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 shadow-sm">
        <p className="text-sm text-green-800 dark:text-green-200">Available</p>
        <p className="text-xl font-bold text-green-900 dark:text-green-100">{available}</p>
      </div>
      <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-4 shadow-sm">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">Occupied</p>
        <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">{occupied}</p>
      </div>
      <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4 shadow-sm">
        <p className="text-sm text-red-800 dark:text-red-200">Maintenance</p>
        <p className="text-xl font-bold text-red-900 dark:text-red-100">{maintenance}</p>
      </div>
    </div>
  );
};

export default PropertyStats;
