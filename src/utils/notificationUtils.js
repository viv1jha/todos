import { getMessaging, getToken } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

// Request notification permission
export const requestNotificationPermission = async (userId) => {
  try {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }
    
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Get FCM token
      const token = await getFCMToken();
      
      if (token && userId) {
        // Save token to Firestore
        await saveTokenToFirestore(userId, token);
      }
      
      return true;
    } else {
      console.log('Notification permission denied');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Get Firebase Cloud Messaging token
export const getFCMToken = async () => {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY' // Replace with your actual VAPID key
    });
    
    if (token) {
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('No registration token available');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Save token to Firestore
export const saveTokenToFirestore = async (userId, token) => {
  try {
    const tokenRef = doc(db, 'users', userId, 'tokens', token);
    await setDoc(tokenRef, {
      token,
      createdAt: serverTimestamp(),
      platform: navigator.platform,
      userAgent: navigator.userAgent
    });
    
    console.log('Token saved to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving token to Firestore:', error);
    return false;
  }
};

// Display a local notification
export const displayLocalNotification = (title, body, icon = '/favicon.ico') => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }
  
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        displayLocalNotification(title, body, icon);
      }
    });
  }
};

// Schedule a local notification
export const scheduleLocalNotification = (title, body, scheduledTime) => {
  const now = new Date().getTime();
  const timeUntilNotification = scheduledTime - now;
  
  if (timeUntilNotification <= 0) {
    return;
  }
  
  setTimeout(() => {
    displayLocalNotification(title, body);
  }, timeUntilNotification);
};