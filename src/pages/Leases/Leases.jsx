import React, { useState, useEffect } from 'react';
import { LeaseList, LeaseForm } from './index';
import LeasePdfViewer from './LeasePdfViewer';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Leases = () => {
  const { api } = useAuth();
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLease, setEditingLease] = useState(null);
  const [viewLease, setViewLease] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchLeases();
    fetchTenants();
    fetchProperties();
  }, []);

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leases');
      setLeases(res.data.leases || []);
    } catch (err) {
      toast.error('Failed to fetch leases');
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const res = await api.get('/tenants');
      setTenants(res.data.tenants || []);
    } catch (err) {
      toast.error('Failed to fetch tenants');
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties');
      setProperties(res.data.properties || []);
    } catch (err) {
      toast.error('Failed to fetch properties');
    }
  };

  const handleAdd = () => {
    setEditingLease(null);
    setShowForm(true);
  };

  const handleEdit = (lease) => {
    setEditingLease(lease);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/leases/${id}`);
      toast.success('Lease deleted');
      fetchLeases();
    } catch (err) {
      toast.error('Failed to delete lease');
    }
  };

  const handleView = (lease) => {
    setViewLease(lease);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingLease) {
        await api.put(`/leases/${editingLease._id}`, data);
        toast.success('Lease updated');
      } else {
        // Map frontend fields to backend expected fields
        const payload = {
          propertyId: data.propertyId,
          tenantId: data.tenantId,
          startDate: data.leaseStart,
          endDate: data.leaseEnd,
          leaseTerms: data.leaseTerms || 'Standard lease terms',
          // Add additional fields if needed (e.g. monthlyRent, securityDeposit, paymentDueDate, lateFee, utilities, petDeposit, additionalCharges)
        };
        await api.post('/leases', payload);
        toast.success('Lease added');
      }
      setShowForm(false);
      fetchLeases();
    } catch (err) {
      toast.error('Failed to save lease');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leases</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage lease agreements and contracts</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>Add Lease</button>
      </div>
      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <LeaseForm
            onSubmit={handleFormSubmit}
            tenants={tenants}
            properties={properties}
            defaultValues={editingLease ? {
              ...editingLease,
              leaseStart: (editingLease.leaseStart || editingLease.startDate || '').slice(0, 10),
              leaseEnd: (editingLease.leaseEnd || editingLease.endDate || '').slice(0, 10),
              leaseTerms: editingLease.leaseTerms || '',
              tenantId: editingLease.tenantId || editingLease.tenant?._id || '',
              propertyId: editingLease.propertyId || editingLease.property?._id || '',
            } : {}}
            isEditing={!!editingLease}
          />
          <button className="btn-secondary mt-2" onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
      <LeaseList
        leases={leases}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    {/* View Lease Modal */}
    {viewLease && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-lg w-full relative">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setViewLease(null)}>&times;</button>
          <h2 className="text-xl font-bold mb-2">Lease Details</h2>
          <div className="mb-2"><strong>Tenant:</strong> {viewLease.tenant?.name || '-'}</div>
          <div className="mb-2"><strong>Property:</strong> {viewLease.property?.title || '-'}</div>
          <div className="mb-2"><strong>Lease:</strong> {viewLease.leaseStart} - {viewLease.leaseEnd}</div>
          <div className="mb-2"><strong>Lease Terms:</strong> {viewLease.leaseTerms || '-'}</div>
          {viewLease.agreementPdfUrl && (
            <LeasePdfViewer pdfUrl={viewLease.agreementPdfUrl} showTextInline />
          )}
        </div>
      </div>
    )}
    </div>
  );
};

export default Leases;
