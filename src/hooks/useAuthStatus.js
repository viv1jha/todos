import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAuthStatus = () => {
  const { currentUser } = useAuth();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    setCheckingStatus(false);
  }, [currentUser]);

  return { loggedIn, checkingStatus };
};
