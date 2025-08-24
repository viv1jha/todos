import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';

// Store scheduled notifications to prevent duplicates
const scheduledNotifications = new Map();

// Request permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    // Request permission from the user
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Get the FCM token
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY' // Replace with your actual VAPID key
      });
      
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const setupMessageListener = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    callback(payload);
  });
};

// Display a notification
export const displayNotification = (title, body, icon = '/favicon.ico') => {
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
        displayNotification(title, body, icon);
      }
    });
  }
};

// Schedule a local notification
export const scheduleLocalNotification = (title, body, scheduledTime) => {
  // Create a unique key for this notification
  const notificationKey = `${title}-${scheduledTime}`;
  
  // Cancel any existing scheduled notification with the same key
  if (scheduledNotifications.has(notificationKey)) {
    clearTimeout(scheduledNotifications.get(notificationKey));
    scheduledNotifications.delete(notificationKey);
  }
  
  const now = new Date().getTime();
  const timeUntilNotification = scheduledTime - now;
  
  if (timeUntilNotification <= 0) {
    return;
  }
  
  const timeoutId = setTimeout(() => {
    displayNotification(title, body);
    // Remove from scheduled notifications after displaying
    scheduledNotifications.delete(notificationKey);
  }, timeUntilNotification);
  
  // Store the timeout ID
  scheduledNotifications.set(notificationKey, timeoutId);
};

// Clear all scheduled notifications
export const clearAllScheduledNotifications = () => {
  scheduledNotifications.forEach((timeoutId) => {
    clearTimeout(timeoutId);
  });
  scheduledNotifications.clear();
};