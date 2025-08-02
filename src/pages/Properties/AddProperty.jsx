import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiImage, FiHome, FiDollarSign, FiMapPin, FiLayers } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const AddProperty = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const { api } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      address: { street: '', city: '', state: '', zipCode: '', country: 'USA' },
      company: '',
      type: 'rent',
      propertyType: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      area: '',
      rentAmount: '',
      salePrice: '',
      description: '',
      imageUrl: '',
      status: 'available',
      yearBuilt: '',
      parkingSpaces: 0,
    }
  });

  React.useEffect(() => {
    if (isEditMode) {
      // Fetch property by ID and prefill form
      (async () => {
        try {
          const res = await api.get(`https://real-state-bk.onrender.com/api/properties/${id}`);
          const property = res.data.property || res.data;
          setValue('name', property.title || '');
          setValue('company', property.company || '');
          setValue('area', property.area || '');
          setValue('type', property.salePrice && property.salePrice > 0 ? 'sell' : 'rent');
          setValue('propertyType', property.propertyType || 'apartment');
          setValue('bedrooms', property.bedrooms || 1);
          setValue('bathrooms', property.bathrooms || 1);
          setValue('area', property.area || '');
          setValue('rentAmount', property.rentAmount || '');
          setValue('salePrice', property.salePrice || '');
          setValue('description', property.description || '');
          setValue('imageUrl', property.images && property.images.length > 0 ? (typeof property.images[0] === 'object' ? property.images[0].url : property.images[0]) : '');
          setValue('status', property.status || 'available');
          setValue('yearBuilt', property.yearBuilt || '');
          setValue('parkingSpaces', property.parkingSpaces || 0);
          setValue('address.street', property.address?.street || '');
          setValue('address.city', property.address?.city || '');
          setValue('address.state', property.address?.state || '');
          setValue('address.zipCode', property.address?.zipCode || '');
        } catch (err) {
          toast.error('Failed to load property for editing');
        }
      })();
    }
  }, [isEditMode, id, api, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Compose the property data for backend
      const propertyData = {
        title: data.name,
        type: data.type,
        description: data.description || 'No description provided',
        address: JSON.stringify({
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          zipCode: data.address?.zipCode || '',
          country: 'USA'
        }),
        propertyType: data.propertyType,
        rentAmount: data.type === 'rent' ? Number(data.rentAmount) : 0,
        salePrice: data.salePrice || (data.type === 'rent' ? 0 : undefined),
        securityDeposit: data.securityDeposit || 0,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        parkingSpaces: data.parkingSpaces || 0,
        status: data.status || 'available',
        images: [
          {
            url: data.imageUrl,
            caption: data.name,
            isPrimary: true
          }
        ],
        amenities: JSON.stringify([]),
        utilities: JSON.stringify({}),
        petPolicy: JSON.stringify({}),
        company: data.company || '',
        area: data.area || ''
      };
      // Remove salePrice if type is 'rent', remove rentAmount if type is 'sell'
      if (data.type === 'sell') delete propertyData.rentAmount;
      if (data.type === 'rent') delete propertyData.salePrice;
      if (isEditMode) {
        await api.put(`https://real-state-bk.onrender.com/api/properties/${id}`, propertyData);
        toast.success('Property updated successfully!');
      } else {
        await api.post('https://real-state-bk.onrender.com/api/properties', propertyData);
        toast.success('Property added successfully!');
      }
      reset();
      navigate('/properties');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FiHome className="text-blue-600" /> {isEditMode ? 'Edit Property' : 'Add New Property'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {isEditMode ? 'Update the details below to edit this property' : 'Fill in the details below to list a new property'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiHome className="text-blue-500" /> Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. Sunnyvale Apartments"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company
              </label>
              <input
                {...register('company')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Property management company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type', { required: 'Type is required' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="rent">For Rent</option>
                <option value="sell">For Sale</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Type
              </label>
              <select
                {...register('propertyType')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiLayers className="text-blue-500" /> Property Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                {...register('bedrooms', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                {...register('bathrooms', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rent Amount {watch('type') === 'rent' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                step="0.01"
                {...register('rentAmount', {
                  required: watch('type') === 'rent' ? 'Rent amount is required' : false,
                  valueAsNumber: true,
                  min: { value: 0, message: 'Rent must be at least 0' },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. 1500"
                disabled={watch('type') === 'sell'}
              />
              {errors.rentAmount && <p className="mt-1 text-sm text-red-600">{errors.rentAmount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Area (sq ft)
              </label>
              <input
                {...register('area')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. 1200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parking Spaces
              </label>
              <input
                type="number"
                {...register('parkingSpaces', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {watch('type') === 'sell' ? 'Sale Price' : 'Rent Amount'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-500" />
                </div>
                <input
                  type="number"
                  {...register(watch('type') === 'sell' ? 'salePrice' : 'rentAmount', { 
                    required: 'Price is required', 
                    valueAsNumber: true 
                  })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  min={0}
                  placeholder={watch('type') === 'sell' ? 'e.g. 250000' : 'e.g. 1500'}
                />
              </div>
              {(errors.salePrice || errors.rentAmount) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.salePrice?.message || errors.rentAmount?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiMapPin className="text-blue-500" /> Address
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Street Address
              </label>
              <input
                {...register('address.street')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. 123 Main St"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <input
                {...register('address.city')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. New York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State
              </label>
              <input
                {...register('address.state')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ZIP Code
              </label>
              <input
                {...register('address.zipCode')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. 10001"
              />
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiImage className="text-blue-500" /> Property Image
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              {...register('imageUrl', { required: 'Image URL is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/property-image.jpg"
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
          </div>

          {watch('imageUrl') && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview:</p>
              <img 
                src={watch('imageUrl')} 
                alt="Property preview" 
                className="h-48 w-full object-cover rounded-md border border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                }}
              />
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Description</h2>
          <textarea
            {...register('description')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            rows={4}
            placeholder="Describe the property features, amenities, and any other important details..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <FiSave /> {isSubmitting ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;