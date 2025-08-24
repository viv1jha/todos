import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';

const Header = ({ 
  title, 
  showBackButton = false, 
  showAddButton = false, 
  onAddClick = () => {} 
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={handleBackClick}
              className="mr-4 text-gray-700 dark:text-gray-300"
              aria-label="Go back"
            >
              <FaArrowLeft />
            </button>
          )}
          <h1 className="text-lg font-medium dark:text-white">{title}</h1>
        </div>
        {showAddButton && (
          <button 
            onClick={onAddClick}
            className="text-gray-700 dark:text-gray-300"
            aria-label="Add new"
          >
            <FaPlus />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;