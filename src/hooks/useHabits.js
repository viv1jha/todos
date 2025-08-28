import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  listenToHabits, 
  addHabit, 
  updateHabit, 
  deleteHabit 
} from '../services/firestoreService';

export const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    // Clean up any existing listener
    if (unsubscribe) {
      unsubscribe();
    }

    // Set up real-time listener
    if (currentUser) {
      const unsubscribeFn = listenToHabits(currentUser.uid, (fetchedHabits) => {
        setHabits(fetchedHabits);
        setLoading(false);
      });
      setUnsubscribe(() => unsubscribeFn);
    } else {
      setHabits([]);
      setLoading(false);
    }

    // Clean up listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  const createHabit = useCallback(async (habitData) => {
    if (!currentUser) return null;
    
    try {
      setError(null);
      const habitId = await addHabit(currentUser.uid, habitData);
      return habitId;
    } catch (err) {
      console.error('Error creating habit:', err);
      setError('Failed to create habit');
      return null;
    }
  }, [currentUser]);

  const updateHabitProgress = useCallback(async (habitId, progress) => {
    try {
      setError(null);
      await updateHabit(habitId, { progress });
      return true;
    } catch (err) {
      console.error('Error updating habit progress:', err);
      setError('Failed to update habit progress');
      return false;
    }
  }, []);

  const editHabit = useCallback(async (habitId, habitData) => {
    try {
      setError(null);
      await updateHabit(habitId, habitData);
      return true;
    } catch (err) {
      console.error('Error updating habit:', err);
      setError('Failed to update habit');
      return false;
    }
  }, []);

  const removeHabit = useCallback(async (habitId) => {
    try {
      setError(null);
      await deleteHabit(habitId);
      return true;
    } catch (err) {
      console.error('Error removing habit:', err);
      setError('Failed to remove habit');
      return false;
    }
  }, []);

  // Memoize filtered habits to avoid recalculation on every render
  const activeHabits = useMemo(() => {
    return habits.filter((habit) => habit.progress < 100);
  }, [habits]);

  const completedHabits = useMemo(() => {
    return habits.filter((habit) => habit.progress === 100);
  }, [habits]);

  // Memoize the return value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    habits,
    loading,
    error,
    createHabit,
    updateHabitProgress,
    editHabit,
    removeHabit,
    activeHabits,
    completedHabits
  }), [habits, loading, error, createHabit, updateHabitProgress, editHabit, removeHabit, activeHabits, completedHabits]);

  return value;
};