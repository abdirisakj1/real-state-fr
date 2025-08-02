import React, { useState, useEffect } from 'react';
import { TenantList, TenantForm } from './index';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Tenants = () => {
  const { api } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchTenants();
    fetchProperties();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await api.get('https://real-state-bk.onrender.com/api/tenants');
      setTenants(res.data.tenants || []);
    } catch (err) {
      toast.error('Failed to fetch tenants');
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await api.get('https://real-state-bk.onrender.com/api/properties');
      setProperties(res.data.properties || []);
    } catch (err) {
      toast.error('Failed to fetch properties');
    }
  };

  const handleAdd = () => {
    setEditingTenant(null);
    setShowForm(true);
  };

  const handleEdit = (tenant) => {
    console.log('Editing tenant:', tenant);
    // Get propertyId as string (handle population)
    let propertyId = tenant.propertyId?._id || tenant.propertyId || '';
    // Get lease start/end from populated leaseId or fallback
    let leaseStart = '';
    let leaseEnd = '';
    if (tenant.leaseId && typeof tenant.leaseId === 'object') {
      leaseStart = tenant.leaseId.startDate ? tenant.leaseId.startDate.slice(0, 10) : '';
      leaseEnd = tenant.leaseId.endDate ? tenant.leaseId.endDate.slice(0, 10) : '';
    }
    setEditingTenant({
      ...tenant,
      propertyId,
      leaseStart,
      leaseEnd,
    });
    setShowForm(true);
  };


  const handleDelete = async (id) => {
    try {
      await api.delete(`https://real-state-bk.onrender.com/api/tenants/${id}`);
      toast.success('Tenant deleted');
      fetchTenants();
    } catch (err) {
      toast.error('Failed to delete tenant');
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const payload = { ...data, role: 'tenant' };
      if (editingTenant) {
        await api.put(`https://real-state-bk.onrender.com/api/tenants/${editingTenant._id}`, payload);
        toast.success('Tenant updated');
      } else {
        // Generate a random password for the new tenant
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4);
        // Omit propertyId if empty string
        const cleanPayload = { ...payload, email: payload.email.trim(), name: payload.name.trim(), password: randomPassword };
        if (!cleanPayload.propertyId) delete cleanPayload.propertyId;
        await api.post('https://real-state-bk.onrender.com/api/tenants', cleanPayload);
        toast.success('Tenant added');
      }
      setShowForm(false);
      fetchTenants();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save tenant');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tenants</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your tenants and their information</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>Add Tenant</button>
      </div>
      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <TenantForm
            onSubmit={handleFormSubmit}
            properties={properties}
            defaultValues={editingTenant || {}}
            isEditing={!!editingTenant}
          />
          <button className="btn-secondary mt-2" onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
      <TenantList
        tenants={tenants}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Tenants;
