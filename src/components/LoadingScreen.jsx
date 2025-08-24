import React from 'react';
import Spinner from './Spinner';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  );
};

export default LoadingScreen;