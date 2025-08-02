import React from 'react';
import { FiEdit, FiTrash2, FiUser } from 'react-icons/fi';

const TenantList = ({ tenants, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  if (!tenants || tenants.length === 0) {
    return <div className="text-center py-8 text-gray-400">No tenants found.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tenants.map(tenant => (
        <div key={tenant._id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col">
          {/* Avatar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-2xl">
              <FiUser />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tenant.name}</h3>
            </div>
          </div>
          <div className="mb-2 text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">Phone:</span> {tenant.phone}
          </div>
          <div className="mb-2 text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">Property:</span> {tenant.propertyId?.title || '-'}
          </div>
          <div className="mb-2 text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">Date:</span> {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : '-'}
          </div>
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => onEdit(tenant)}
              className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1"
            >
              <FiEdit /> Edit
            </button>
            <button
              onClick={() => onDelete(tenant._id)}
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

export default TenantList;
