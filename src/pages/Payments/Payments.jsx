import React, { useState, useEffect } from 'react';
import { PaymentList, PaymentForm } from './index';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Payments = () => {
  const { api } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [leases, setLeases] = useState([]);

  useEffect(() => {
    fetchPayments();
    fetchTenants();
    fetchProperties();
    fetchLeases();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get('https://real-state-bk.onrender.com/api/payments');
      setPayments(res.data.payments || []);
    } catch (err) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const res = await api.get('https://real-state-bk.onrender.com/api/tenants');
      setTenants(res.data.tenants || []);
    } catch (err) {
      toast.error('Failed to fetch tenants');
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

  const fetchLeases = async () => {
    try {
      const res = await api.get('https://real-state-bk.onrender.com/api/leases');
      setLeases(res.data.leases || []);
    } catch (err) {
      toast.error('Failed to fetch leases');
    }
  };

  const handleAdd = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`https://real-state-bk.onrender.com/api/payments/${id}`);
      toast.success('Payment deleted');
      fetchPayments();
    } catch (err) {
      toast.error('Failed to delete payment');
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      // Build payload for backend
      // Defensive mapping for legacy/invalid paymentMethod values
      let paymentMethod = data.paymentMethod;
      if (paymentMethod === 'manual') paymentMethod = 'cash';
      if (paymentMethod === 'bank') paymentMethod = 'bank_transfer';
      if (paymentMethod === 'card') paymentMethod = 'credit_card';
      // fallback to 'cash' if still invalid
      const allowed = ['cash','check','bank_transfer','credit_card','online','other'];
      if (!allowed.includes(paymentMethod)) paymentMethod = 'cash';
      const payload = {
        propertyId: data.propertyId,
        tenantId: data.tenantId,
        amount: data.amount,
        dueDate: data.date,
        paymentType: data.paymentType || 'rent',
        paymentMethod,
      };
      if (editingPayment) {
        // For edit, also send propertyId and tenantId (if backend supports it)
        await api.put(`/payments/${editingPayment._id}`, payload);
        toast.success('Payment updated');
      } else {
        await api.post('https://real-state-bk.onrender.com/api/payments', payload);
        toast.success('Payment added');
      }
      setShowForm(false);
      fetchPayments();
    } catch (err) {
      toast.error('Failed to save payment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track rent payments and generate invoices</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>Add Payment</button>
      </div>
      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <PaymentForm
            onSubmit={handleFormSubmit}
            tenants={tenants}
            properties={properties}
            defaultValues={editingPayment ? {
              amount: editingPayment.amount,
              paymentType: editingPayment.paymentType,
              paymentMethod: editingPayment.paymentMethod,
              tenantId: editingPayment.tenant?._id || editingPayment.tenantId || '',
              propertyId: editingPayment.property?._id || editingPayment.propertyId || '',
              leaseId: editingPayment.lease?._id || editingPayment.leaseId || '',
              date: editingPayment.date ? editingPayment.date.slice(0, 10) : '',
            } : {}}
            isEditing={!!editingPayment}
          />
          <button className="btn-secondary mt-2" onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
      <PaymentList
        payments={payments}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Payments;
