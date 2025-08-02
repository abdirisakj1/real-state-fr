import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

const PaymentForm = ({ onSubmit, tenants = [], properties = [], leases = [], defaultValues = {}, isEditing }) => {
  const { register, handleSubmit, formState: { errors }, control, setValue, reset, watch } = useForm({ defaultValues });

  // Watch tenantId and propertyId for filtering leases
  const selectedTenantId = watch('tenantId');
  const selectedPropertyId = watch('propertyId');

  // Filter leases by selected tenant and property
  const filteredLeases = leases.filter(lease => {
    if (selectedTenantId && lease.tenant?._id !== selectedTenantId) return false;
    if (selectedPropertyId && lease.property?._id !== selectedPropertyId) return false;
    return true;
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Tenant & Property Selection Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Tenant & Property Selection</h2>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tenant <span className="text-red-500">*</span></label>
          <Controller
            name="tenantId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={tenants.map(tenant => ({
                  value: tenant._id,
                  label: `${tenant.name || tenant.fullName || '-'} (${tenant.email})`
                }))}
                classNamePrefix="react-select"
                placeholder="Select tenant..."
                isClearable
                onChange={option => field.onChange(option ? option.value : '')}
                value={
                  tenants
                    .map(tenant => ({
                      value: tenant._id,
                      label: `${tenant.name || tenant.fullName || '-'} (${tenant.email})`
                    }))
                    .find(opt => opt.value === field.value) || null
                }
              />
            )}
          />
          {errors.tenantId && <span className="text-red-500 text-xs">Required</span>}

          {/* Property Select */}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-6">Property <span className="text-red-500">*</span></label>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-6">Property <span className="text-red-500">*</span></label>
          <select
            {...register('propertyId', { required: 'Property is required' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select property</option>
            {properties.map(property => (
              <option key={property._id} value={property._id}>
                {property.title}
              </option>
            ))}
          </select>
          {errors.propertyId && (
            <span className="text-red-500 text-xs">{errors.propertyId.message}</span>
          )}


        </div>

        {/* Payment Info Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Payment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount <span className="text-red-500">*</span></label>
              <input {...register('amount', { required: true, min: 1 })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" type="number" step="0.01" />
              {errors.amount && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date <span className="text-red-500">*</span></label>
              <input {...register('date', { required: true })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" type="date" />
              {errors.date && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Type <span className="text-red-500">*</span></label>
              <select {...register('paymentType', { required: true, validate: v => [
                'rent', 'security_deposit', 'late_fee', 'pet_deposit', 'utility', 'maintenance', 'other'
              ].includes(v) })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" defaultValue="rent">
                <option value="rent">Rent</option>
                <option value="security_deposit">Security Deposit</option>
                <option value="late_fee">Late Fee</option>
                <option value="pet_deposit">Pet Deposit</option>
                <option value="utility">Utility</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
              {errors.paymentType && <span className="text-red-500 text-xs">Invalid type</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method <span className="text-red-500">*</span></label>
              <select {...register('paymentMethod', { required: true })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="online">Online</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isEditing ? 'Update Payment' : 'Add Payment'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
