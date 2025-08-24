import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  listenToReminders, 
  addReminder, 
  updateReminder, 
  deleteReminder 
} from '../services/firestoreService';
import { scheduleLocalNotification, clearAllScheduledNotifications } from '../services/notificationService';

export const useReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [unsubscribe, setUnsubscribe] = useState(null);

  const scheduleReminder = useCallback((reminder) => {
    // Parse the time string to get hours and minutes
    const [hours, minutes] = reminder.time.split(':').map(Number);
    
    // Create a Date object for today with the specified time
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime < new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    // Schedule the notification
    scheduleLocalNotification(
      reminder.name,
      `Time for your ${reminder.name}!`,
      scheduledTime.getTime()
    );
  }, []);

  useEffect(() => {
    // Clean up any existing listener
    if (unsubscribe) {
      unsubscribe();
    }

    // Clear all scheduled notifications when component mounts
    clearAllScheduledNotifications();

    // Set up real-time listener
    if (currentUser) {
      const unsubscribeFn = listenToReminders(currentUser.uid, (fetchedReminders) => {
        setReminders(fetchedReminders);
        setLoading(false);
        
        // Schedule local notifications for enabled reminders
        fetchedReminders.forEach((reminder) => {
          if (reminder.enabled) {
            scheduleReminder(reminder);
          }
        });
      });
      setUnsubscribe(() => unsubscribeFn);
    } else {
      setReminders([]);
      setLoading(false);
    }

    // Clean up listener and notifications on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      clearAllScheduledNotifications();
    };
  }, [currentUser, scheduleReminder]);

  const createReminder = useCallback(async (reminderData) => {
    if (!currentUser) return null;
    
    try {
      setError(null);
      const reminderId = await addReminder(currentUser.uid, reminderData);
      
      // Schedule the reminder if enabled
      if (reminderData.enabled) {
        const newReminder = {
          id: reminderId,
          ...reminderData,
          userId: currentUser.uid,
          enabled: true
        };
        scheduleReminder(newReminder);
      }
      
      return reminderId;
    } catch (err) {
      console.error('Error creating reminder:', err);
      setError('Failed to create reminder');
      return null;
    }
  }, [currentUser, scheduleReminder]);

  const toggleReminder = useCallback(async (reminderId, enabled) => {
    try {
      setError(null);
      await updateReminder(reminderId, { enabled });
      
      return true;
    } catch (err) {
      console.error('Error toggling reminder:', err);
      setError('Failed to update reminder');
      return false;
    }
  }, []);

  const editReminder = useCallback(async (reminderId, reminderData) => {
    try {
      setError(null);
      await updateReminder(reminderId, reminderData);
      
      return true;
    } catch (err) {
      console.error('Error updating reminder:', err);
      setError('Failed to update reminder');
      return false;
    }
  }, []);

  const removeReminder = useCallback(async (reminderId) => {
    try {
      setError(null);
      await deleteReminder(reminderId);
      
      return true;
    } catch (err) {
      console.error('Error removing reminder:', err);
      setError('Failed to remove reminder');
      return false;
    }
  }, []);

  // Memoize filtered reminders to avoid recalculation on every render
  const getTodayReminders = useCallback(() => {
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

  const getTomorrowReminders = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayOfWeek = tomorrow.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    return reminders.filter((reminder) => {
      // Check if the reminder is set for tomorrow
      if (reminder.days && Array.isArray(reminder.days)) {
        return reminder.days.includes(dayOfWeek);
      }
      
      // If no specific days are set, assume it's a daily reminder
      return true;
    });
  }, [reminders]);

  // Memoize the return value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    reminders,
    loading,
    error,
    createReminder,
    toggleReminder,
    editReminder,
    removeReminder,
    getTodayReminders,
    getTomorrowReminders
  }), [reminders, loading, error, createReminder, toggleReminder, editReminder, removeReminder, getTodayReminders, getTomorrowReminders]);

  return value;
};