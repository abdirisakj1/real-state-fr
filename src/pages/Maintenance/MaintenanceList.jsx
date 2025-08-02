import React from 'react';
import { FiEdit, FiTrash2, FiTool } from 'react-icons/fi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  on_hold: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
  emergency: 'bg-red-700 text-white',
};

function MaintenanceList({ requests = [], loading, onEdit, onDelete }) {
  if (loading) return <div className="text-center py-8">Loading maintenance requests...</div>;
  if (!requests.length) return <div className="text-center py-8 text-gray-500">No maintenance requests found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Request</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Property</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>

            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {requests.map((req) => (
            <tr key={req._id}>
              <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-indigo-500"><FiTool /></span>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{req.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{req.description}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-900 dark:text-white font-medium">{req.property?.title || req.property?._id || req.property || '-'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{req.property?.address?.street}, {req.property?.address?.city}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap capitalize">{req.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[req.priority] || ''}`}>{req.priority}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[req.status] || ''}`}>{req.status.replace('_', ' ')}</span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors mr-2"
                  onClick={() => onEdit && onEdit(req)}
                  type="button"
                  title="Edit"
                >
                  <FiEdit />
                </button>
                <button
                  className="inline-flex items-center px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  onClick={() => onDelete && onDelete(req._id)}
                  type="button"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaintenanceList;
