// Parse Firebase error messages to user-friendly format
export const parseFirebaseError = (error) => {
  const errorCode = error.code;
  let errorMessage = 'An unexpected error occurred. Please try again.';
  
  // Auth errors
  if (errorCode === 'auth/user-not-found') {
    errorMessage = 'No user found with this email address.';
  } else if (errorCode === 'auth/wrong-password') {
    errorMessage = 'Incorrect password. Please try again.';
  } else if (errorCode === 'auth/email-already-in-use') {
    errorMessage = 'This email is already registered. Please use a different email or log in.';
  } else if (errorCode === 'auth/weak-password') {
    errorMessage = 'Password is too weak. Please use a stronger password.';
  } else if (errorCode === 'auth/invalid-email') {
    errorMessage = 'Invalid email address. Please check and try again.';
  } else if (errorCode === 'auth/account-exists-with-different-credential') {
    errorMessage = 'An account already exists with the same email but different sign-in credentials.';
  } else if (errorCode === 'auth/operation-not-allowed') {
    errorMessage = 'This sign-in method is not enabled. Please contact support.';
  } else if (errorCode === 'auth/popup-closed-by-user') {
    errorMessage = 'Sign-in popup was closed before completing the sign-in.';
  } else if (errorCode === 'auth/network-request-failed') {
    errorMessage = 'Network error. Please check your internet connection and try again.';
  } else if (errorCode === 'auth/too-many-requests') {
    errorMessage = 'Too many unsuccessful login attempts. Please try again later.';
  }
  
  // Firestore errors
  else if (errorCode === 'permission-denied') {
    errorMessage = 'You do not have permission to perform this action.';
  } else if (errorCode === 'unavailable') {
    errorMessage = 'The service is currently unavailable. Please try again later.';
  } else if (errorCode === 'not-found') {
    errorMessage = 'The requested document was not found.';
  } else if (errorCode === 'already-exists') {
    errorMessage = 'The document already exists.';
  }
  
  // If we have an error message from Firebase, use that
  if (error.message) {
    // Extract the message from the Firebase error format
    const firebaseMessage = error.message.replace('Firebase: ', '').replace(` (${errorCode})`, '');
    if (firebaseMessage) {
      errorMessage = firebaseMessage;
    }
  }
  
  return errorMessage;
};

// Log errors to console with additional context
export const logError = (error, context = '') => {
  console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  
  // Here you could also send the error to a monitoring service like Sentry
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error);
  // }
};

// Create a standardized error object
export const createErrorObject = (error, context = '') => {
  const errorMessage = error.message || 'An unknown error occurred';
  const errorCode = error.code || 'unknown';
  
  logError(error, context);
  
  return {
    message: parseFirebaseError(error),
    originalMessage: errorMessage,
    code: errorCode,
    context,
    timestamp: new Date().toISOString()
  };
};