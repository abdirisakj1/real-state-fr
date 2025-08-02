import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiTool,
  FiTrendingUp,
  FiAlertCircle,
  FiCalendar,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, api, dashboardRefreshToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Re-fetch dashboard stats whenever dashboardRefreshToken changes
  }, [dashboardRefreshToken]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user.role === 'tenant') {
        // Fetch tenant-specific dashboard
        const response = await api.get(`https://real-state-bk.onrender.com/api/dashboard/tenant/${user.id}`);
        setStats(response.data);
      } else {
        // Fetch admin/manager dashboard
        const [statsResponse, eventsResponse] = await Promise.all([
          api.get('https://real-state-bk.onrender.com/api/dashboard/stats'),
          api.get('https://real-state-bk.onrender.com/api/dashboard/upcoming-events')
        ]);
        
        // Fetch all completed and pending payments for all-time stats
        const allPaymentsRes = await api.get('/https://real-state-bk.onrender.com/apipayments?limit=10000');
        const allPayments = allPaymentsRes.data.payments || [];
        // Match Reports page: sum all payments, regardless of status
        const allTimeIncome = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const pendingPayments = allPayments.filter(p => p.status === 'pending');
        const pendingAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        setStats({
          ...statsResponse.data,
          allTimeIncome,
          pendingPaymentsCount: pendingPayments.length,
          pendingPaymentsAmount: pendingAmount,
        });
        setUpcomingEvents(eventsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'blue' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? <FiArrowUp className="w-4 h-4 mr-1" /> : <FiArrowDown className="w-4 h-4 mr-1" />}
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </motion.div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={stats?.properties?.total || 0}
          icon={FiHome}
          change={`${stats?.properties?.occupancyRate || 0}% occupied`}
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Active Tenants"
          value={stats?.tenants?.total || 0}
          icon={FiUsers}
          change={`${stats?.tenants?.activeLeases || 0} active leases`}
          changeType="increase"
          color="green"
        />
        <StatCard
          title="All-time Income"
          value={stats?.allTimeIncome != null ? stats.allTimeIncome.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) : '$0.00'}
          icon={FiTrendingUp}
          change={null}
          color="green"
        />

        <StatCard
          title="Maintenance Requests"
          value={stats?.maintenance?.pending || 0}
          icon={FiTool}
          change={`${stats?.maintenance?.urgent || 0} urgent`}
          changeType={stats?.maintenance?.urgent > 0 ? 'decrease' : 'increase'}
          color="red"
        />
      </div>
    </div>
  );

  const TenantDashboard = () => (
    <div className="space-y-6">
      {/* Tenant Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Paid"
          value={`$${stats?.summary?.totalPaid?.toLocaleString() || 0}`}
          icon={FiDollarSign}
          color="green"
        />
        <StatCard
          title="Pending Amount"
          value={`$${stats?.summary?.pendingAmount?.toLocaleString() || 0}`}
          icon={FiAlertCircle}
          color="yellow"
        />
        <StatCard
          title="Overdue Amount"
          value={`$${stats?.summary?.overdueAmount?.toLocaleString() || 0}`}
          icon={FiTrendingUp}
          color="red"
        />
      </div>

      {/* Current Lease Info */}
      {stats?.currentLease && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Lease</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{stats.currentLease.property?.title}</h4>
              <p className="text-gray-500 dark:text-gray-400">{stats.currentLease.property?.address?.street}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Lease: {new Date(stats.currentLease.startDate).toLocaleDateString()} - {new Date(stats.currentLease.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.currentLease.property?.rentAmount?.toLocaleString()}/month
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Payments */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment History</h3>
        <div className="space-y-3">
          {stats?.payments?.slice(0, 5).map((payment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{payment.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Due: {new Date(payment.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  payment.status === 'completed' ? 'text-green-600' : 
                  payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  ${payment.amount}
                </p>
                <p className="text-xs text-gray-500 capitalize">{payment.status}</p>
              </div>
            </div>
          )) || (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No payment history</p>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your {user?.role === 'tenant' ? 'lease' : 'properties'} today.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Dashboard Content */}
      {user?.role === 'tenant' ? <TenantDashboard /> : <AdminDashboard />}
    </div>
  );
};

export default Dashboard;
