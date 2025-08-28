import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoon, FaSignOutAlt, FaUserCircle, FaBell, FaDownload, FaQuestionCircle, FaClock, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [totalPomodoroHours, setTotalPomodoroHours] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // Load Pomodoro stats from localStorage
  useEffect(() => {
    const savedHours = localStorage.getItem('totalPomodoroHours');
    const savedCompleted = localStorage.getItem('completedPomodoros');
    
    if (savedHours) {
      setTotalPomodoroHours(parseFloat(savedHours));
    }
    
    if (savedCompleted) {
      setCompletedPomodoros(parseInt(savedCompleted));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const SettingItem = ({ icon, title, subtitle, onClick, toggle = false, enabled = false }) => {
    return (
      <div 
        className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-500 dark:text-gray-400">
            {icon}
          </div>
          <div>
            <span className="font-medium dark:text-white">{title}</span>
            {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
        </div>
        {toggle ? (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enabled}
              onChange={onClick}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:bg-gray-700 dark:peer-checked:bg-primary"></div>
          </label>
        ) : (
          <FaChevronRight className="text-gray-400 dark:text-gray-500" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-16">
      <Header title="Settings" />
      
      <div className="p-4">
        <div className="flex items-center mb-6 p-4 bg-gray-50 dark:bg-black rounded-lg border dark:border-gold">
          <div className="mr-4">
            <FaUserCircle size={50} className="text-gray-400 dark:text-gray-300" />
          </div>
          <div>
            <h2 className="font-medium dark:text-white">{currentUser?.email || 'User'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Account Settings</p>
          </div>
        </div>
        
        <div className="space-y-1 mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Preferences</h3>
          
          <SettingItem 
            icon={<FaMoon />} 
            title="Dark Mode" 
            toggle={true}
            enabled={darkMode}
            onClick={toggleDarkMode}
          />
          
          <SettingItem 
            icon={<FaBell />} 
            title="Notifications" 
            onClick={() => navigate('/notification-settings')}
          />
        </div>
        
        <div className="space-y-1 mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Productivity</h3>
          
          <SettingItem 
            icon={<FaClock />} 
            title="Pomodoro Timer" 
            subtitle={`${completedPomodoros} completed • ${totalPomodoroHours.toFixed(2)} hours focused`}
            onClick={() => navigate('/timer')}
          />
        </div>
        
        <div className="space-y-1 mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Data</h3>
          
          <SettingItem 
            icon={<FaDownload />} 
            title="Export Data" 
            onClick={() => {}}
          />
        </div>
        
        <div className="space-y-1 mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Support</h3>
          
          <SettingItem 
            icon={<FaQuestionCircle />} 
            title="Help & Support" 
            onClick={() => {}}
          />
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-3 text-red-500 font-medium border border-red-200 dark:border-red-800 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <FaSignOutAlt className="mr-2" />
            Log Out
          </button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Settings;