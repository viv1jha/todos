import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaPlus, FaPen } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import TabNavigation from '../components/TabNavigation';
import BottomNavigation from '../components/BottomNavigation';
import FloatingActionButton from '../components/FloatingActionButton';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import { useReminders } from '../hooks/useReminders';

const Home = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [newReminderName, setNewReminderName] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const { currentUser } = useAuth();
  
  const { 
    reminders, 
    loading: remindersLoading, 
    error: remindersError, 
    createReminder, 
    editReminder,
    toggleReminder,
    refreshReminders
  } = useReminders();
  
  const navigate = useNavigate();

  const tabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

  // Filter today's reminders using useMemo for performance
  const todayReminders = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    return reminders.filter((reminder) => {
      // Check if the reminder is set for today
      if (reminder.days && Array.isArray(reminder.days)) {
        return reminder.days.includes(dayOfWeek);
      }
      
      // If no specific days are set, assume it's a daily reminder
      return true;
    });
  }, [reminders]);

  const handleAddReminder = useCallback(() => {
    setIsReminderModalOpen(true);
  }, []);

  const handleCreateReminder = useCallback(async () => {
    if (!newReminderName.trim() || !newReminderTime) return;
    
    const reminderData = {
      name: newReminderName.trim(),
      time: newReminderTime,
      days: selectedDays.length > 0 ? selectedDays : [0, 1, 2, 3, 4, 5, 6], // Default to all days if none selected
      enabled: true,
      createdAt: new Date().toISOString()
    };
    
    const result = await createReminder(reminderData);
    if (result) {
      setNewReminderName('');
      setNewReminderTime('');
      setSelectedDays([]);
      setIsReminderModalOpen(false);
    }
  }, [newReminderName, newReminderTime, selectedDays, createReminder]);

  const handleEditReminder = useCallback((reminder) => {
    setEditingReminder(reminder);
    setNewReminderName(reminder.name);
    setNewReminderTime(reminder.time);
    setSelectedDays(reminder.days || []);
    setIsEditModalOpen(true);
  }, []);

  const handleUpdateReminder = useCallback(async () => {
    if (!newReminderName.trim() || !newReminderTime || !editingReminder) return;

    const reminderData = {
      name: newReminderName.trim(),
      time: newReminderTime,
      days: selectedDays.length > 0 ? selectedDays : [0, 1, 2, 3, 4, 5, 6],
    };

    const result = await editReminder(editingReminder.id, reminderData);
    if (result) {
      setEditingReminder(null);
      setNewReminderName('');
      setNewReminderTime('');
      setSelectedDays([]);
      setIsEditModalOpen(false);
    }
  }, [newReminderName, newReminderTime, selectedDays, editingReminder, editReminder]);

  const handleToggleReminder = useCallback(async (id, enabled) => {
    const result = await toggleReminder(id, !enabled);
    if (result) {
      // Refresh reminders after toggle
      refreshReminders();
    }
  }, [toggleReminder, refreshReminders]);

  const toggleDay = useCallback((day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  }, []);

  const ReminderItem = useCallback(({ reminder }) => {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center">
          <div className="mr-3">
            <FaBars className="text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <p className="font-medium dark:text-white">{reminder.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{reminder.time}</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={reminder.enabled}
            onChange={() => handleToggleReminder(reminder.id, reminder.enabled)}
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
        </label>
        <button onClick={() => handleEditReminder(reminder)} className="ml-4 text-gray-400 hover:text-primary">
          <FaPen size={16} />
        </button>
      </div>
    );
  }, [handleToggleReminder, handleEditReminder]);

  const loading = remindersLoading;
  const error = remindersError;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading data...</p>
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
              onClick={() => {
                refreshRoutines();
                refreshReminders();
              }}
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

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-16">
      <Header title="Habit Tracker" />
      
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div className="p-4">
        {/* Reminders Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium dark:text-white">Today's Reminders</h2>
            <button 
              onClick={handleAddReminder}
              className="text-primary dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300"
            >
              <FaPlus />
            </button>
          </div>
          
          <div className="space-y-3">
            {todayReminders.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No reminders for today</p>
                <button 
                  onClick={handleAddReminder}
                  className="mt-2 text-primary dark:text-primary-400 hover:underline text-sm"
                >
                  Set a reminder
                </button>
              </div>
            ) : (
              todayReminders.map((reminder) => (
                <ReminderItem key={reminder.id} reminder={reminder} />
              ))
            )}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
      
      {/* Reminder Modal */}
      <Modal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        title="Add New Reminder"
      >
        <div className="space-y-4">
          <Input
            id="reminder-name"
            label="Reminder Name"
            value={newReminderName}
            onChange={(e) => setNewReminderName(e.target.value)}
            placeholder="e.g., Morning Routine"
            required
          />
          
          <Input
            id="reminder-time"
            label="Time"
            type="time"
            value={newReminderTime}
            onChange={(e) => setNewReminderTime(e.target.value)}
            required
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Repeat
            </label>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    selectedDays.includes(index)
                      ? 'bg-primary dark:bg-primary-600 text-white'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => toggleDay(index)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsReminderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateReminder}
            >
              Add Reminder
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Reminder"
      >
        <div className="space-y-4">
          <Input
            id="edit-reminder-name"
            label="Reminder Name"
            value={newReminderName}
            onChange={(e) => setNewReminderName(e.target.value)}
            placeholder="e.g., Morning Routine"
            required
          />

          <Input
            id="edit-reminder-time"
            label="Time"
            type="time"
            value={newReminderTime}
            onChange={(e) => setNewReminderTime(e.target.value)}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Repeat
            </label>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    selectedDays.includes(index)
                      ? 'bg-primary dark:bg-primary-600 text-white'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => toggleDay(index)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateReminder}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;