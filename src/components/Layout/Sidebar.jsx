import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiGrid,
  FiUsers,
  FiFileText,
  FiCreditCard,
  FiTool,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiMenu,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar, isDark } = useTheme();
  const location = useLocation();

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: FiHome,
        roles: ['admin', 'property_manager', 'tenant']
      }
    ];

    const managerItems = [
      {
        name: 'Properties',
        href: '/properties',
        icon: FiGrid,
        roles: ['admin', 'property_manager']
      },
      {
        name: 'Clients',
        href: '/clients',
        icon: FiUsers,
        roles: ['admin', 'property_manager']
      },
      {
        name: 'Tenants',
        href: '/tenants',
        icon: FiUsers,
        roles: ['admin', 'property_manager']
      },

      {
        name: 'Payments',
        href: '/payments',
        icon: FiCreditCard,
        roles: ['admin', 'property_manager']
      },
      {
        name: 'Reports',
        href: '/reports',
        icon: FiBarChart2,
        roles: ['admin', 'property_manager']
      }
    ];

    const commonItems = [
      {
        name: 'Maintenance',
        href: '/maintenance',
        icon: FiTool,
        roles: ['admin', 'property_manager', 'tenant']
      },

    ];

    const adminItems = [

    ];

    return [...baseItems, ...managerItems, ...commonItems, ...adminItems]
      .filter(item => item.roles.includes(user?.role));
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div
      initial={false}
      animate={{
        width: sidebarCollapsed ? '4rem' : '16rem'
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col shadow-lg"
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiGrid className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              RentPro
            </span>
          </motion.div>
        )}
        
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-300 font-semibold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-300' : ''}`} />
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group"
        >
          <FiLogOut className="w-5 h-5" />
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-medium"
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>

      {/* Tooltip for collapsed items */}
      {sidebarCollapsed && (
        <div className="absolute left-full top-0 ml-2 pointer-events-none">
          {/* Tooltips would be rendered here when hovering over collapsed items */}
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;
