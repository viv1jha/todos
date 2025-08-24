import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  listenToTasks, 
  addTask, 
  updateTask, 
  deleteTask 
} from '../services/firestoreService';

export const useTasks = (frequency = null) => {
  const [tasks, setTasks] = useState([]);
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
      const unsubscribeFn = listenToTasks(currentUser.uid, frequency, (fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoading(false);
      });
      setUnsubscribe(() => unsubscribeFn);
    } else {
      setTasks([]);
      setLoading(false);
    }

    // Clean up listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser, frequency]);

  const createTask = useCallback(async (taskData) => {
    if (!currentUser) return null;
    
    try {
      setError(null);
      const taskId = await addTask(currentUser.uid, taskData);
      return taskId;
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
      return null;
    }
  }, [currentUser]);

  const toggleTaskCompletion = useCallback(async (taskId, completed) => {
    try {
      setError(null);
      await updateTask(taskId, { completed });
      return true;
    } catch (err) {
      console.error('Error toggling task completion:', err);
      setError('Failed to update task');
      return false;
    }
  }, []);

  const editTask = useCallback(async (taskId, taskData) => {
    try {
      setError(null);
      await updateTask(taskId, taskData);
      return true;
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      return false;
    }
  }, []);

  const removeTask = useCallback(async (taskId) => {
    try {
      setError(null);
      await deleteTask(taskId);
      return true;
    } catch (err) {
      console.error('Error removing task:', err);
      setError('Failed to remove task');
      return false;
    }
  }, []);

  // Memoize filtered tasks to avoid recalculation on every render
  const completedTasks = useMemo(() => {
    return tasks.filter((task) => task.completed);
  }, [tasks]);

  const pendingTasks = useMemo(() => {
    return tasks.filter((task) => !task.completed);
  }, [tasks]);

  const getTasksByCategory = useMemo(() => {
    return (category) => {
      return tasks.filter((task) => task.category === category);
    };
  }, [tasks]);

  // Group tasks by frequency using useMemo for performance
  const tasksByFrequency = useMemo(() => {
    return {
      daily: tasks.filter(task => task.frequency === 'daily'),
      weekly: tasks.filter(task => task.frequency === 'weekly'),
      monthly: tasks.filter(task => task.frequency === 'monthly')
    };
  }, [tasks]);

  // Memoize the return value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    tasks,
    loading,
    error,
    createTask,
    toggleTaskCompletion,
    editTask,
    removeTask,
    completedTasks,
    pendingTasks,
    getTasksByCategory,
    tasksByFrequency
  }), [tasks, loading, error, createTask, toggleTaskCompletion, editTask, removeTask, completedTasks, pendingTasks, getTasksByCategory, tasksByFrequency]);

  return value;
};