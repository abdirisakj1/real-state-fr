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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((req) => (
        <div key={req._id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col">
          {/* Icon and Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-indigo-500 text-2xl">
              <FiTool />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{req.title}</h3>
              <div className="text-gray-500 dark:text-gray-400 text-sm capitalize">{req.category}</div>
            </div>
          </div>
          <div className="mb-2 text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">Property:</span> {req.property?.title || req.property?._id || req.property || '-'}
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[req.priority] || ''}`}>{req.priority}</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[req.status] || ''}`}>{req.status.replace('_', ' ')}</span>
          </div>
          <div className="mb-2 text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">Requested By:</span> {req.requestedBy?.name || req.requestedBy?._id || req.requestedBy || '-'}
          </div>
          <div className="mb-2 text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">Created:</span> {new Date(req.createdAt).toLocaleString()}
          </div>
          <div className="flex gap-2 mt-auto">
            <button
              className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1"
              onClick={() => onEdit && onEdit(req)}
              type="button"
            >
              <FiEdit /> Edit
            </button>
            <button
              className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1"
              onClick={() => onDelete && onDelete(req._id)}
              type="button"
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MaintenanceList;
