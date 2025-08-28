import React, { useState, useCallback } from 'react';
import { FaDumbbell, FaBook, FaGraduationCap, FaSun, FaPen, FaRunning, FaMusic, FaAppleAlt } from 'react-icons/fa';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import FloatingActionButton from '../components/FloatingActionButton';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import { useHabits } from '../hooks/useHabits';

const Habits = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format
  const { 
    habits, 
    loading, 
    error, 
    createHabit, 
    editHabit,
    removeHabit,
    activeHabits, 
    completedHabits,
    refreshHabits
  } = useHabits();

  const handleAddHabit = useCallback(() => {
    setNewHabitName('');
    setNewHabitFrequency('daily');
    setIsModalOpen(true);
  }, []);

  const handleCreateHabit = useCallback(async () => {
    if (!newHabitName.trim()) return;
    
    const habitData = {
      name: newHabitName.trim(),
      frequency: newHabitFrequency,
      progress: 0,
      createdAt: new Date().toISOString()
    };
    
    const result = await createHabit(habitData);
    if (result) {
      setNewHabitName('');
      setNewHabitFrequency('daily');
      setIsModalOpen(false);
    }
  }, [newHabitName, newHabitFrequency, createHabit]);

  const handleEditHabit = useCallback((habit) => {
    setEditingHabit(habit);
    setNewHabitName(habit.name);
    setNewHabitFrequency(habit.frequency);
    setIsEditModalOpen(true);
  }, []);

  const handleUpdateHabit = useCallback(async () => {
    if (!newHabitName.trim() || !editingHabit) return;

    const habitData = {
      name: newHabitName.trim(),
      frequency: newHabitFrequency,
    };

    const result = await editHabit(editingHabit.id, habitData);
    if (result) {
      setEditingHabit(null);
      setNewHabitName('');
      setNewHabitFrequency('daily');
      setIsEditModalOpen(false);
    }
  }, [newHabitName, newHabitFrequency, editingHabit, editHabit]);

  const handleDeleteHabit = useCallback(async () => {
    if (!editingHabit) return;

    const result = await removeHabit(editingHabit.id);
    if (result) {
      setEditingHabit(null);
      setIsEditModalOpen(false);
    }
  }, [editingHabit, removeHabit]);

  const getHabitIcon = useCallback((habitName) => {
    const nameLower = habitName.toLowerCase();
    
    if (nameLower.includes('exercise') || nameLower.includes('workout') || nameLower.includes('gym')) {
      return <FaDumbbell className="text-red-500" />;
    } else if (nameLower.includes('read') || nameLower.includes('book')) {
      return <FaBook className="text-blue-500" />;
    } else if (nameLower.includes('learn') || nameLower.includes('study') || nameLower.includes('skill')) {
      return <FaGraduationCap className="text-purple-500" />;
    } else if (nameLower.includes('meditate') || nameLower.includes('mindfulness')) {
      return <FaSun className="text-yellow-500" />;
    } else if (nameLower.includes('journal') || nameLower.includes('write')) {
      return <FaPen className="text-green-500" />;
    } else if (nameLower.includes('run') || nameLower.includes('jog')) {
      return <FaRunning className="text-orange-500" />;
    } else if (nameLower.includes('music') || nameLower.includes('instrument')) {
      return <FaMusic className="text-pink-500" />;
    } else if (nameLower.includes('eat') || nameLower.includes('diet') || nameLower.includes('healthy')) {
      return <FaAppleAlt className="text-green-600" />;
    } else {
      return <FaSun className="text-gray-500 dark:text-gray-400" />;
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading habits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pb-16 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
          <div className="mt-4 flex space-x-2">
            <button 
              onClick={refreshHabits}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-600"
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

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-16">
      <Header 
        title="Habit Tracker" 
        showAddButton
        onAddClick={handleAddHabit}
      />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium dark:text-white">My Habits</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm dark:text-white"
          />
        </div>
        
        <div className="space-y-3 mb-6">
          {activeHabits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No active habits</p>
              <button 
                onClick={handleAddHabit}
                className="mt-4 text-primary dark:text-primary-400 hover:underline"
              >
                Create your first habit
              </button>
            </div>
          ) : (
            activeHabits.map((habit) => (
              <div 
                key={habit.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center mr-3 dark:text-gray-300">
                    {getHabitIcon(habit.name)}
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">{habit.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                    <div 
                      className="bg-primary dark:bg-primary-600 h-2 rounded-full"
                      style={{ width: `${habit.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 mr-4">{habit.progress}%</span>
                  <button onClick={() => handleEditHabit(habit)} className="text-gray-400 hover:text-primary">
                    <FaPen size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {completedHabits.length > 0 && (
          <>
            <h2 className="text-lg font-medium mb-3 dark:text-white">Completed Habits</h2>
            
            <div className="space-y-3">
              {completedHabits.map((habit) => (
                <div 
                  key={habit.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center mr-3 dark:text-gray-300">
                      {getHabitIcon(habit.name)}
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-white">{habit.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 dark:bg-green-600 h-2 rounded-full" 
                        style={{ width: `${habit.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{habit.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <FloatingActionButton onClick={handleAddHabit} />
      <BottomNavigation />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Habit"
      >
        <div className="space-y-4">
          <Input
            id="habit-name"
            label="Habit Name"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="e.g., Morning Exercise"
            required
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency
            </label>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              {['daily', 'weekly', 'monthly'].map((frequency) => (
                <button
                  key={frequency}
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium ${
                    newHabitFrequency === frequency
                      ? 'bg-primary dark:bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setNewHabitFrequency(frequency)}
                >
                  {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateHabit}
            >
              Add Habit
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Habit"
      >
        <div className="space-y-4">
          <Input
            id="edit-habit-name"
            label="Habit Name"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="e.g., Morning Exercise"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency
            </label>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              {['daily', 'weekly', 'monthly'].map((frequency) => (
                <button
                  key={frequency}
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium ${
                    newHabitFrequency === frequency
                      ? 'bg-primary dark:bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setNewHabitFrequency(frequency)}
                >
                  {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="danger"
              onClick={handleDeleteHabit}
            >
              Delete
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateHabit}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Habits;