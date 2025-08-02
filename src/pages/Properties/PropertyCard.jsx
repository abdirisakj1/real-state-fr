import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const PropertyCard = ({ property, onEdit, onDelete, getStatusColor }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative mb-4">
        {property.images && property.images.length > 0 ? (
          <img
            src={typeof property.images[0] === 'object' && property.images[0] !== null ? property.images[0].url : property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover rounded"
            onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
        <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(property.status)}`}>
          {property.status}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{property.title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-1">{property.address?.street}, {property.address?.city}</p>
      <div className="flex justify-between items-center mb-2">
        <span className="text-blue-600 font-bold text-xl">
          ${property.type === 'rent' ? property.rentAmount?.toLocaleString() : property.salePrice?.toLocaleString()}
          {property.type === 'rent' && '/mo'}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{property.bedrooms} bed • {property.bathrooms} bath</span>
      </div>
      <div className="flex gap-2 mt-auto">
        <button onClick={() => onEdit(property)} className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1">
          <FiEdit /> Edit
        </button>
        <button onClick={() => onDelete(property._id)} className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1">
          <FiTrash2 /> Delete
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
