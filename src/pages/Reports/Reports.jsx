import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiBarChart2, FiDollarSign, FiHome, FiTrendingUp, FiCalendar, FiFileText } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Reports = () => {
  const { user, api } = useAuth();
  const [properties, setProperties] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [propertiesRes, paymentsRes] = await Promise.all([
        api.get('https://real-state-bk.onrender.com/api/properties'),
        api.get('https://real-state-bk.onrender.com/api/payments?limit=1000')
      ]);
      setProperties(propertiesRes.data.properties || []);
      // Calculate total income from ALL payments (regardless of status)
      const payments = paymentsRes.data.payments || [];
      const income = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      setTotalIncome(income);
      // Mock clients data
      setClients([
        { _id: '1', clientName: 'John Smith', transactionType: 'rent', budget: 2000, status: 'active' },
        { _id: '2', clientName: 'Sarah Johnson', transactionType: 'buy', budget: 450000, status: 'pending' }
      ]);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = (type) => {
    toast.success(`${type} report generated successfully!`);
  };

  const exportReport = (format) => {
    toast.success(`Report exported as ${format.toUpperCase()}!`);
  };

  // Calculate statistics
  const totalProperties = properties.length;
  const rentProperties = properties.filter(p => p.type === 'rent').length;
  const saleProperties = properties.filter(p => p.type === 'sell').length;
  const availableProperties = properties.filter(p => p.status === 'available').length;
  const totalRevenue = properties.reduce((sum, p) => sum + (p.rentAmount || p.salePrice || 0), 0);
  const averageRent = rentProperties > 0 ? properties.filter(p => p.type === 'rent').reduce((sum, p) => sum + (p.rentAmount || 0), 0) / rentProperties : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Property and client performance insights</p>
        </div>

      </div>

      {/* Report Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex space-x-4 overflow-x-auto">
          {[
            { id: 'overview', name: 'Overview', icon: FiBarChart2 },
            { id: 'properties', name: 'Properties', icon: FiHome },
            { id: 'financial', name: 'Financial', icon: FiDollarSign },
            { id: 'trends', name: 'Trends', icon: FiTrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                selectedReport === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Report */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Properties</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalProperties}</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <FiHome className="w-12 h-12 text-blue-600" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available Properties</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{availableProperties}</p>
                  <p className="text-sm text-orange-600">-5% from last month</p>
                </div>
                <FiCalendar className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Rent</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">${averageRent.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+8% from last month</p>
                </div>
                <FiDollarSign className="w-12 h-12 text-purple-600" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Payments (Income)</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">${totalIncome.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</p>
                  <p className="text-sm text-blue-600">All-time income</p>
                </div>
                <FiDollarSign className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Occupancy Rate</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">85%</p>
                  <p className="text-sm text-green-600">+3% from last month</p>
                </div>
                <FiTrendingUp className="w-12 h-12 text-orange-600" />
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Properties Added</h3>
              <div className="space-y-3">
                {properties.slice(0, 5).map((property) => (
                  <div key={property._id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{property.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{property.address?.street}, {property.address?.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-600">
                        ${(property.rentAmount || property.salePrice || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{property.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Property Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">For Rent</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${totalProperties > 0 ? (rentProperties / totalProperties) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{rentProperties}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">For Sale</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${totalProperties > 0 ? (saleProperties / totalProperties) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{saleProperties}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${totalProperties > 0 ? (availableProperties / totalProperties) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{availableProperties}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Properties Report */}
      {selectedReport === 'properties' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Properties Report</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Detailed property information and performance</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Income</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {properties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{property.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{property.address?.street}, {property.address?.city}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.type === 'rent' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        {property.type === 'rent' ? 'Rental' : 'Sale'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${(property.rentAmount || property.salePrice || 0).toLocaleString()}
                      {property.type === 'rent' && '/month'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'available' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : property.status === 'occupied'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${(property.income || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Financial Report */}
      {selectedReport === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Portfolio Value</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Rental Income</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">${(averageRent * rentProperties).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Property Value</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">${totalProperties > 0 ? (totalRevenue / totalProperties).toLocaleString() : 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Occupancy Rate</span>
                  <span className="text-sm font-medium text-green-600">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Days on Market</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">28 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ROI</span>
                  <span className="text-sm font-medium text-green-600">12.5%</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Growth Trends</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Properties Added (YTD)</span>
                  <span className="text-sm font-medium text-green-600">+{Math.floor(totalProperties * 0.3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Revenue Growth</span>
                  <span className="text-sm font-medium text-green-600">+15.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Market Share</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">8.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends Report */}
      {selectedReport === 'trends' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Market Trends & Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Rental Market Trends</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">• Average rent increased by 8% this quarter</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">• Demand for 2BR apartments up 15%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">• Pet-friendly properties in high demand</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">• Downtown locations showing strongest growth</p>
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Sales Market Trends</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">• Property values increased by 12% YoY</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">• First-time buyers represent 35% of sales</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">• Condos outperforming single-family homes</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">• Average time on market decreased to 28 days</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
