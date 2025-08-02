import React from 'react';
import { FiEdit, FiTrash2, FiDollarSign, FiUser } from 'react-icons/fi';

const PaymentList = ({ payments, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  if (!payments || payments.length === 0) {
    return <div className="text-center py-8 text-gray-400">No payments found.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {payments.map(payment => (
        <div key={payment._id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-green-500 text-xl">
              <FiDollarSign />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-gray-900 dark:text-white">
                {payment.tenant?.name || payment.tenant?.fullName || <span className="text-gray-400">No Tenant</span>}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Property: <span className="font-medium text-gray-700 dark:text-gray-200">{payment.property?.title || <span className='text-gray-400'>No Property</span>}</span>
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Type: <span className="font-medium text-gray-700 dark:text-gray-200">{payment.paymentType || '-'}</span>
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => onEdit(payment)}
              className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1"
            >
              <FiEdit /> Edit
            </button>
            <button
              onClick={() => onDelete(payment._id)}
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

export default PaymentList;
