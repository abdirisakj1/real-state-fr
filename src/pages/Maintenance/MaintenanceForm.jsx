import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const CATEGORY_OPTIONS = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'Heating/Cooling (HVAC)' },
  { value: 'appliance', label: 'Appliance' },
  { value: 'structural', label: 'Structural' },
  { value: 'cosmetic', label: 'Cosmetic' },
  { value: 'security', label: 'Security' },
  { value: 'other', label: 'Other' },
];
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'emergency', label: 'Emergency' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'on_hold', label: 'On Hold' },
];

const MaintenanceForm = ({ onSubmitted, properties = [], user, editingRequest, onCancelEdit }) => {
  // Debug log for property select issue
  console.log('MaintenanceForm received properties:', properties);

  const { api } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    propertyId: user?.role === 'tenant' ? user?.propertyId || '' : '',
    status: 'pending',
  });
  const [loading, setLoading] = useState(false);

  // Prefill form in edit mode
  React.useEffect(() => {
    if (editingRequest) {
      setForm({
        title: editingRequest.title || '',
        description: editingRequest.description || '',
        category: editingRequest.category || '',
        priority: editingRequest.priority || 'medium',
        propertyId: editingRequest.property?._id || editingRequest.property || '',
        status: editingRequest.status || 'pending',
      });
    } else {
      setForm({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        propertyId: user?.role === 'tenant' ? user?.propertyId || '' : '',
        status: 'pending',
      });
    }
  }, [editingRequest, user]);
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // For admin/manager, update propertyId from dropdown
  const handlePropertyChange = e => {
    setForm({ ...form, propertyId: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const propertyIdToSubmit = user?.role === 'tenant' ? user?.propertyId : form.propertyId;
    if (!form.title || !form.description || !form.category || !form.priority || !propertyIdToSubmit || !form.status) {
      toast.error('Please fill in all fields, including property and status');
      return;
    }
    setLoading(true);
    try {
      if (editingRequest) {
        await api.put(`https://real-state-bk.onrender.com/api/maintenance/${editingRequest._id}`, {
          ...form,
          propertyId: propertyIdToSubmit,
        });
        toast.success('Maintenance request updated!');
      } else {
        await api.post('https://real-state-bk.onrender.com/api/maintenance', {
          ...form,
          propertyId: propertyIdToSubmit,
        });
        toast.success('Maintenance request submitted!');
      }
      setForm({ title: '', description: '', category: '', priority: 'medium', propertyId: user?.role === 'tenant' ? user?.propertyId || '' : '', status: 'pending' });
      if (onSubmitted) onSubmitted();
      setLoading(false);
    } catch (err) {
      toast.error('Failed to submit maintenance request');
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Property Select Dropdown for Admin/Manager */}
      {user?.role !== 'tenant' && (
        <div>
          <label className="block text-sm font-medium mb-1">Property <span className="text-red-500">*</span></label>
          <select
            name="propertyId"
            value={form.propertyId}
            onChange={handlePropertyChange}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
            required
          >
            <option value="">Select property</option>
            {properties.length === 0 && (
              <option value="" disabled>No properties available</option>
            )}
            {properties.map((p) => (
              <option key={p._id} value={p._id}>{p.title} - {p.address?.street}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Issue Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
          required
        >
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
          required
        >
          <option value="">Select status</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
            required
          >
            {PRIORITY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-60"
        disabled={loading}
      >
        {loading ? (editingRequest ? 'Updating...' : 'Submitting...') : (editingRequest ? 'Update Request' : 'Submit Request')}
      </button>
      {editingRequest && (
        <button
          type="button"
          className="w-full mt-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={onCancelEdit}
          disabled={loading}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default MaintenanceForm;
