import React from 'react';
import { FaPlus } from 'react-icons/fa';

const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label="Add new"
    >
      <FaPlus size={20} />
    </button>
  );
};

export default FloatingActionButton;