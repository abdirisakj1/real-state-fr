import React from 'react';
import { useForm } from 'react-hook-form';

const LeaseForm = ({ onSubmit, tenants, properties, defaultValues = {}, isEditing }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Lease Parties Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Lease Parties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tenant <span className="text-red-500">*</span></label>
              <select {...register('tenantId', { required: true })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="">Select tenant</option>
                {tenants.map(tenant => (
                  <option key={tenant._id} value={tenant._id}>{tenant.name}</option>
                ))}
              </select>
              {errors.tenantId && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property <span className="text-red-500">*</span></label>
              <select {...register('propertyId', { required: true })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="">Select property</option>
                {properties.map(property => (
                  <option key={property._id} value={property._id}>{property.title}</option>
                ))}
              </select>
              {errors.propertyId && <span className="text-red-500 text-xs">Required</span>}
            </div>
          </div>
        </div>

        {/* Lease Dates Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Lease Dates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lease Start <span className="text-red-500">*</span></label>
              <input {...register('leaseStart', { required: true })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" type="date" />
              {errors.leaseStart && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lease End <span className="text-red-500">*</span></label>
              <input {...register('leaseEnd', { required: true })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" type="date" />
              {errors.leaseEnd && <span className="text-red-500 text-xs">Required</span>}
            </div>
          </div>
        </div>

        {/* Lease Terms Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Lease Terms</h2>
          <textarea {...register('leaseTerms', { required: true })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" rows={3} placeholder="Enter lease terms" />
          {errors.leaseTerms && <span className="text-red-500 text-xs">Required</span>}
        </div>

        {/* PDF Agreement Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">PDF Agreement</h2>
          <input {...register('agreementPdf')} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" type="file" accept="application/pdf" />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isEditing ? 'Update Lease' : 'Add Lease'}
        </button>
      </form>

      {/* View Lease PDF if present */}
      {defaultValues && defaultValues.agreementPdfUrl && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">View Lease PDF</h3>
          <a href={defaultValues.agreementPdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open PDF in new tab</a>
          <div className="mt-2 border rounded overflow-hidden" style={{height:'400px'}}>
            <iframe src={defaultValues.agreementPdfUrl} title="Lease PDF" width="100%" height="100%" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaseForm;
