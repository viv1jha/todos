import { format, isToday, isTomorrow, addDays, parseISO } from 'date-fns';

// Format date to display
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  } else {
    return format(dateObj, 'MMM d, yyyy');
  }
};

// Format time to display
export const formatTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
};

// Format date and time to display
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return `${formatDate(dateObj)} at ${formatTime(dateObj)}`;
};

// Get tomorrow's date
export const getTomorrow = () => {
  return addDays(new Date(), 1);
};

// Get day of week (0-6, where 0 is Sunday)
export const getDayOfWeek = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.getDay();
};

// Get days of week array
export const getDaysOfWeek = () => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

// Check if a date is in the past
export const isPastDate = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
};

// Format date for database storage (ISO string)
export const formatDateForStorage = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.toISOString();
};