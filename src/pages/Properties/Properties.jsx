import React, { useState, useEffect } from 'react';
import PropertyStats from './PropertyStats';
import PropertyList from './PropertyList';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Properties = () => {
  const navigate = useNavigate();

  // Edit handler
  const handleEdit = (property) => {
    // You may want to navigate to an edit page or open a modal
    // For now, we navigate to /edit-property/:id
    navigate(`/properties/edit/${property._id}`);
  };
  const { user, api } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');


  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('https://real-state-bk.onrender.com/api/properties');
      setProperties(response.data.properties || []);
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`https://real-state-bk.onrender.com/api/properties/${id}`);
      toast.success('Property deleted successfully!');
      fetchProperties();
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.street?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = typeFilter === 'all' || property.propertyType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Status color utility
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'occupied':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'maintenance':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <PropertyStats properties={properties} />
      <div className="flex justify-end">
        <Link to="/add-property" className="btn-primary">Add New Property</Link>
      </div>
      <PropertyList
        properties={filteredProperties}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getStatusColor={getStatusColor}
      />
    </div>
  );
};

export default Properties;