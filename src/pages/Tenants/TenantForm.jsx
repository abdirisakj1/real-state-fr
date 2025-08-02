import React from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiHome, FiCalendar, FiFileText } from 'react-icons/fi';

const TenantForm = ({ onSubmit, properties, defaultValues = {}, isEditing }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({ 
    defaultValues 
  });

  // Ensure leaseStart and leaseEnd are always controlled and calendar is shown
  React.useEffect(() => {
    if (defaultValues.leaseStart) setValue('leaseStart', defaultValues.leaseStart);
    if (defaultValues.leaseEnd) setValue('leaseEnd', defaultValues.leaseEnd);
  }, [defaultValues.leaseStart, defaultValues.leaseEnd, setValue]);

  const leaseStart = watch('leaseStart');
  const leaseEnd = watch('leaseEnd');

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FiUser className="text-blue-600" /> {isEditing ? 'Edit Tenant' : 'Add New Tenant'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {isEditing ? 'Update the details below to edit this tenant' : 'Fill in the details below to add a new tenant'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiUser className="text-blue-500" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name', { required: 'Full name is required' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="john@example.com"
                type="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im,
                    message: 'Invalid phone number'
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="(123) 456-7890"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Property Assignment Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiHome className="text-blue-500" /> Property Assignment
          </h2>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Property Assigned <span className="text-red-500">*</span>
          </label>
          <select
            {...register('propertyId', { required: 'Property assignment is required' })}
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
            <p className="mt-1 text-sm text-red-600">{errors.propertyId.message}</p>
          )}
        </div>

        {/* Lease Information Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiCalendar className="text-blue-500" /> Lease Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lease Start <span className="text-red-500">*</span>
              </label>
              <input
                {...register('leaseStart', { })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                type="date"
                value={leaseStart || ''}
                onChange={e => setValue('leaseStart', e.target.value)}
              />
              {errors.leaseStart && (
                <p className="mt-1 text-sm text-red-600">{errors.leaseStart.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lease End <span className="text-red-500">*</span>
              </label>
              <input
                {...register('leaseEnd', { })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                type="date"
                value={leaseEnd || ''}
                onChange={e => setValue('leaseEnd', e.target.value)}
              />
              {errors.leaseEnd && (
                <p className="mt-1 text-sm text-red-600">{errors.leaseEnd.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiFileText className="text-blue-500" /> Additional Notes
          </h2>
          <textarea
            {...register('notes')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            rows={3}
            placeholder="Any special instructions or notes about the tenant..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              {isEditing ? 'Update Tenant' : 'Add Tenant'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TenantForm;