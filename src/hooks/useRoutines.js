import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  listenToRoutines, 
  addRoutine, 
  updateRoutine, 
  deleteRoutine 
} from '../services/firestoreService';

export const useRoutines = (frequency = null) => {
  const [routines, setRoutines] = useState([]);
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
      const unsubscribeFn = listenToRoutines(currentUser.uid, frequency, (fetchedRoutines) => {
        setRoutines(fetchedRoutines);
        setLoading(false);
      });
      setUnsubscribe(() => unsubscribeFn);
    } else {
      setRoutines([]);
      setLoading(false);
    }

    // Clean up listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser, frequency]);

  const createRoutine = useCallback(async (routineData) => {
    if (!currentUser) return null;
    
    try {
      setError(null);
      const routineId = await addRoutine(currentUser.uid, routineData);
      return routineId;
    } catch (err) {
      console.error('Error creating routine:', err);
      setError('Failed to create routine');
      return null;
    }
  }, [currentUser]);

  const editRoutine = useCallback(async (routineId, routineData) => {
    try {
      setError(null);
      await updateRoutine(routineId, routineData);
      return true;
    } catch (err) {
      console.error('Error updating routine:', err);
      setError('Failed to update routine');
      return false;
    }
  }, []);

  const removeRoutine = useCallback(async (routineId) => {
    try {
      setError(null);
      await deleteRoutine(routineId);
      return true;
    } catch (err) {
      console.error('Error removing routine:', err);
      setError('Failed to remove routine');
      return false;
    }
  }, []);

  // Memoize the return value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    routines,
    loading,
    error,
    createRoutine,
    editRoutine,
    removeRoutine
  }), [routines, loading, error, createRoutine, editRoutine, removeRoutine]);

  return value;
};