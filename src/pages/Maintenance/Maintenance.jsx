import React, { useEffect, useState } from 'react';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceList from './MaintenanceList';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Maintenance = () => {
  const { user, api, triggerDashboardRefresh } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [editingRequest, setEditingRequest] = useState(null);

  useEffect(() => {
    if (user?.role !== 'tenant') {
      fetchProperties();
    } else {
      setLoading(false);
    }
    fetchRequests();
    // eslint-disable-next-line
  }, [user]);

  // Fetch all maintenance requests
  const fetchRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await api.get('https://real-state-bk.onrender.com/api/maintenance');
      console.log('Fetched maintenance requests:', res.data);
      setRequests(res.data.maintenanceRequests || []);
    } catch (err) {
      toast.error('Failed to fetch maintenance requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('https://real-state-bk.onrender.com/api/properties');
      setProperties(res.data.properties || []);
    } catch (err) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  // Edit handler
  const handleEdit = (request) => {
    setEditingRequest(request);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this maintenance request?')) return;
    try {
      await api.delete(`https://real-state-bk.onrender.com/api/maintenance/${id}`);
      toast.success('Maintenance request deleted');
      fetchRequests();
      triggerDashboardRefresh();
    } catch (err) {
      toast.error('Failed to delete maintenance request');
    }
  };

  // Re-fetch requests after form submit
  const handleRequestSubmitted = () => {
    setEditingRequest(null);
    fetchRequests();
    triggerDashboardRefresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Submit and track maintenance requests
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{editingRequest ? 'Edit Maintenance Request' : 'Submit a Maintenance Request'}</h2>
        <MaintenanceForm
          properties={properties}
          user={user}
          onSubmitted={handleRequestSubmitted}
          editingRequest={editingRequest}
          onCancelEdit={() => setEditingRequest(null)}
        />
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Maintenance Requests</h2>
        <MaintenanceList
          requests={requests}
          loading={requestsLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Maintenance;
