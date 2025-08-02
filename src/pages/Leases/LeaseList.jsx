import React from 'react';
import { FiEdit, FiTrash2, FiEye, FiUser } from 'react-icons/fi';

const LeaseList = ({ leases, loading, onEdit, onDelete, onView }) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  if (!leases || leases.length === 0) {
    return <div className="text-center py-8 text-gray-400">No leases found.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leases.map(lease => (
        <div key={lease._id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col">
          {/* Avatar and Tenant Name */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-2xl">
              <FiUser />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{lease.tenant?.fullName || '-'}</h3>
              <div className="text-gray-500 dark:text-gray-400 text-sm">{lease.tenant?.email || ''}</div>
            </div>
          </div>
          <div className="mb-2 text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">Property:</span> {lease.property?.title || '-'}
          </div>
          <div className="mb-2 text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">Lease:</span> {lease.leaseStart} - {lease.leaseEnd}
          </div>
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => onView(lease)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors flex items-center gap-1"
            >
              <FiEye /> View
            </button>
            <button
              onClick={() => onEdit(lease)}
              className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1"
            >
              <FiEdit /> Edit
            </button>
            <button
              onClick={() => onDelete(lease._id)}
              className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1"
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaseList;
