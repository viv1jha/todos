import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaListUl, FaCheckSquare, FaClock, FaCog } from 'react-icons/fa';

const BottomNavigation = () => {
  const navItems = [
    { to: '/', icon: <FaHome size={20} />, label: 'Home' },
    { to: '/habits', icon: <FaListUl size={20} />, label: 'Habits' },
    { to: '/todo', icon: <FaCheckSquare size={20} />, label: 'Routines' },
    { to: '/timer', icon: <FaClock size={20} />, label: 'Timer' },
    { to: '/settings', icon: <FaCog size={20} />, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 z-10">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full ${
              isActive 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <div>{item.icon}</div>
          <span className="text-xs mt-1">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNavigation;