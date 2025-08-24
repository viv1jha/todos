import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// Utility function to handle Firestore errors
const handleFirestoreError = (error, operation) => {
  console.error(`Error ${operation}:`, error);
  // Provide more user-friendly error messages
  switch (error.code) {
    case 'permission-denied':
      throw new Error('Permission denied. Please check your account permissions.');
    case 'not-found':
      throw new Error('Resource not found.');
    case 'unavailable':
      throw new Error('Service temporarily unavailable. Please try again later.');
    default:
      throw new Error(`Failed to ${operation}. Please try again.`);
  }
};

// Routines
export const addRoutine = async (userId, routineData) => {
  try {
    const docRef = await addDoc(collection(db, 'routines'), {
      ...routineData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'adding routine');
  }
};

export const getRoutines = async (userId, frequency = null) => {
  try {
    let q = query(
      collection(db, 'routines'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    if (frequency) {
      q = query(q, where('frequency', '==', frequency));
    }
    
    const querySnapshot = await getDocs(q);
    const routines = [];
    
    querySnapshot.forEach((doc) => {
      routines.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return routines;
  } catch (error) {
    handleFirestoreError(error, 'fetching routines');
  }
};

// Real-time listener for routines
export const listenToRoutines = (userId, frequency, callback) => {
  try {
    let q = query(
      collection(db, 'routines'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    if (frequency) {
      q = query(q, where('frequency', '==', frequency));
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const routines = [];
      querySnapshot.forEach((doc) => {
        routines.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(routines);
    }, (error) => {
      handleFirestoreError(error, 'listening to routines');
    });
  } catch (error) {
    handleFirestoreError(error, 'setting up routine listener');
  }
};

export const updateRoutine = async (routineId, routineData) => {
  try {
    const routineRef = doc(db, 'routines', routineId);
    await updateDoc(routineRef, {
      ...routineData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, 'updating routine');
  }
};

export const deleteRoutine = async (routineId) => {
  try {
    await deleteDoc(doc(db, 'routines', routineId));
    return true;
  } catch (error) {
    handleFirestoreError(error, 'deleting routine');
  }
};

// Habits
export const addHabit = async (userId, habitData) => {
  try {
    const docRef = await addDoc(collection(db, 'habits'), {
      ...habitData,
      userId,
      progress: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'adding habit');
  }
};

export const getHabits = async (userId) => {
  try {
    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const habits = [];
    
    querySnapshot.forEach((doc) => {
      habits.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return habits;
  } catch (error) {
    handleFirestoreError(error, 'fetching habits');
  }
};

// Real-time listener for habits
export const listenToHabits = (userId, callback) => {
  try {
    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const habits = [];
      querySnapshot.forEach((doc) => {
        habits.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(habits);
    }, (error) => {
      handleFirestoreError(error, 'listening to habits');
    });
  } catch (error) {
    handleFirestoreError(error, 'setting up habit listener');
  }
};

export const updateHabit = async (habitId, habitData) => {
  try {
    const habitRef = doc(db, 'habits', habitId);
    await updateDoc(habitRef, {
      ...habitData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, 'updating habit');
  }
};

export const deleteHabit = async (habitId) => {
  try {
    await deleteDoc(doc(db, 'habits', habitId));
    return true;
  } catch (error) {
    handleFirestoreError(error, 'deleting habit');
  }
};

// Tasks
export const addTask = async (userId, taskData) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      userId,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'adding task');
  }
};

export const getTasks = async (userId, frequency = null) => {
  try {
    let q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    if (frequency) {
      q = query(q, where('frequency', '==', frequency));
    }
    
    const querySnapshot = await getDocs(q);
    const tasks = [];
    
    querySnapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return tasks;
  } catch (error) {
    handleFirestoreError(error, 'fetching tasks');
  }
};

// Real-time listener for tasks
export const listenToTasks = (userId, frequency, callback) => {
  try {
    let q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    if (frequency) {
      q = query(q, where('frequency', '==', frequency));
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(tasks);
    }, (error) => {
      handleFirestoreError(error, 'listening to tasks');
    });
  } catch (error) {
    handleFirestoreError(error, 'setting up task listener');
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...taskData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, 'updating task');
  }
};

export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    return true;
  } catch (error) {
    handleFirestoreError(error, 'deleting task');
  }
};

// Reminders
export const addReminder = async (userId, reminderData) => {
  try {
    const docRef = await addDoc(collection(db, 'reminders'), {
      ...reminderData,
      userId,
      enabled: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'adding reminder');
  }
};

export const getReminders = async (userId) => {
  try {
    const q = query(
      collection(db, 'reminders'),
      where('userId', '==', userId),
      orderBy('time', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const reminders = [];
    
    querySnapshot.forEach((doc) => {
      reminders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return reminders;
  } catch (error) {
    handleFirestoreError(error, 'fetching reminders');
  }
};

// Real-time listener for reminders
export const listenToReminders = (userId, callback) => {
  try {
    const q = query(
      collection(db, 'reminders'),
      where('userId', '==', userId),
      orderBy('time', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const reminders = [];
      querySnapshot.forEach((doc) => {
        reminders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(reminders);
    }, (error) => {
      handleFirestoreError(error, 'listening to reminders');
    });
  } catch (error) {
    handleFirestoreError(error, 'setting up reminder listener');
  }
};

export const updateReminder = async (reminderId, reminderData) => {
  try {
    const reminderRef = doc(db, 'reminders', reminderId);
    await updateDoc(reminderRef, {
      ...reminderData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, 'updating reminder');
  }
};

export const deleteReminder = async (reminderId) => {
  try {
    await deleteDoc(doc(db, 'reminders', reminderId));
    return true;
  } catch (error) {
    handleFirestoreError(error, 'deleting reminder');
  }
};