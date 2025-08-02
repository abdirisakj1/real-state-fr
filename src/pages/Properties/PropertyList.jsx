import React from 'react';
import PropertyCard from './PropertyCard';
import { FiHome } from 'react-icons/fi';

const PropertyList = ({ properties, loading, onEdit, onDelete, getStatusColor }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <FiHome className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No properties found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by adding your first property.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <PropertyCard
          key={property._id}
          property={property}
          onEdit={onEdit}
          onDelete={onDelete}
          getStatusColor={getStatusColor}
        />
      ))}
    </div>
  );
};

export default PropertyList;