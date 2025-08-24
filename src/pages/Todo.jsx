import React, { useState, useCallback } from 'react';
import { FaCheck } from 'react-icons/fa';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import FloatingActionButton from '../components/FloatingActionButton';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import { useRoutines } from '../hooks/useRoutines';

const Todo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineTime, setNewRoutineTime] = useState('');
  const { 
    routines, 
    loading, 
    error, 
    createRoutine,
    refreshRoutines
  } = useRoutines();

  const handleAddRoutine = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCreateRoutine = useCallback(async () => {
    if (!newRoutineName.trim()) return;
    
    const routineData = {
      name: newRoutineName.trim(),
      time: newRoutineTime.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const result = await createRoutine(routineData);
    if (result) {
      setNewRoutineName('');
      setNewRoutineTime('');
      setIsModalOpen(false);
    }
  }, [newRoutineName, newRoutineTime, createRoutine]);

  const RoutineItem = React.memo(({ routine }) => {
    return (
      <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 transition-colors duration-200">
        <div className="flex items-center w-full">
          <button 
            className={`mr-3 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
              routine.completed 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            {routine.completed && <FaCheck className="text-white text-xs" />}
          </button>
          <div className="flex-grow">
            <p className={`font-medium ${routine.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'dark:text-white'}`}>
              {routine.name}
            </p>
            {routine.time && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {routine.time}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading routines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-16 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
          <div className="mt-4 flex space-x-2">
            <button 
              onClick={refreshRoutines}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-16">
      <Header 
        title="Routines" 
        showAddButton
        onAddClick={handleAddRoutine}
      />
      
      <div className="p-4">
        <div className="space-y-1">
          {routines.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No routines scheduled</p>
              <button 
                onClick={handleAddRoutine}
                className="mt-4 text-blue-500 dark:text-blue-400 hover:underline"
              >
                Create your first routine
              </button>
            </div>
          ) : (
            routines.map((routine) => (
              <RoutineItem key={routine.id} routine={routine} />
            ))
          )}
        </div>
      </div>
      
      <FloatingActionButton onClick={handleAddRoutine} />
      <BottomNavigation />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Routine"
      >
        <div className="space-y-4">
          <Input
            id="routine-name"
            label="Routine Name"
            value={newRoutineName}
            onChange={(e) => setNewRoutineName(e.target.value)}
            placeholder="e.g., Morning Routine"
            required
          />
          
          <Input
            id="routine-time"
            label="Time (Optional)"
            type="time"
            value={newRoutineTime}
            onChange={(e) => setNewRoutineTime(e.target.value)}
          />
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRoutine}
            >
              Add Routine
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Todo;