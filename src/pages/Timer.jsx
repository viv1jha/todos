import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaCog, FaBell } from 'react-icons/fa';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const Timer = () => {
  // Timer states: 'work', 'break', 'longBreak'
  const [timerState, setTimerState] = useState('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [totalPomodoroHours, setTotalPomodoroHours] = useState(0);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Timer settings (in minutes)
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [pomodorosBeforeLongBreak, setPomodorosBeforeLongBreak] = useState(4);
  
  // Settings modal
  const [showSettings, setShowSettings] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedWorkDuration = localStorage.getItem('pomodoroWorkDuration');
    const savedBreakDuration = localStorage.getItem('pomodoroBreakDuration');
    const savedLongBreakDuration = localStorage.getItem('pomodoroLongBreakDuration');
    const savedPomodorosBeforeLongBreak = localStorage.getItem('pomodoroCyclesBeforeLongBreak');
    const savedHours = localStorage.getItem('totalPomodoroHours');
    const savedCompleted = localStorage.getItem('completedPomodoros');

    if (savedWorkDuration) setWorkDuration(parseInt(savedWorkDuration));
    if (savedBreakDuration) setBreakDuration(parseInt(savedBreakDuration));
    if (savedLongBreakDuration) setLongBreakDuration(parseInt(savedLongBreakDuration));
    if (savedPomodorosBeforeLongBreak) setPomodorosBeforeLongBreak(parseInt(savedPomodorosBeforeLongBreak));
    if (savedHours) setTotalPomodoroHours(parseFloat(savedHours));
    if (savedCompleted) setCompletedPomodoros(parseInt(savedCompleted));
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pomodoroWorkDuration', workDuration.toString());
    localStorage.setItem('pomodoroBreakDuration', breakDuration.toString());
    localStorage.setItem('pomodoroLongBreakDuration', longBreakDuration.toString());
    localStorage.setItem('pomodoroCyclesBeforeLongBreak', pomodorosBeforeLongBreak.toString());
    localStorage.setItem('totalPomodoroHours', totalPomodoroHours.toString());
    localStorage.setItem('completedPomodoros', completedPomodoros.toString());
  }, [workDuration, breakDuration, longBreakDuration, pomodorosBeforeLongBreak, totalPomodoroHours, completedPomodoros]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer completed
      handleTimerCompletion();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleTimerCompletion = () => {
    setIsRunning(false);
    
    // Play sound
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: timerState === 'work' 
          ? 'Time for a break! 🎉' 
          : 'Back to work! 💪',
        icon: '/vite.svg'
      });
    }
    
    // Update completed pomodoros and total hours
    if (timerState === 'work') {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);
      
      // Add work duration to total hours
      const hours = workDuration / 60;
      setTotalPomodoroHours(prev => prev + hours);
      
      // Decide next state
      if (newCompleted % pomodorosBeforeLongBreak === 0) {
        setTimerState('longBreak');
        setTimeLeft(longBreakDuration * 60);
      } else {
        setTimerState('break');
        setTimeLeft(breakDuration * 60);
      }
    } else {
      // Break completed, go back to work
      setTimerState('work');
      setTimeLeft(workDuration * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (timerState === 'work') {
      setTimeLeft(workDuration * 60);
    } else if (timerState === 'break') {
      setTimeLeft(breakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  };

  const switchToWork = () => {
    setIsRunning(false);
    setTimerState('work');
    setTimeLeft(workDuration * 60);
  };

  const switchToBreak = () => {
    setIsRunning(false);
    setTimerState('break');
    setTimeLeft(breakDuration * 60);
  };

  const switchToLongBreak = () => {
    setIsRunning(false);
    setTimerState('longBreak');
    setTimeLeft(longBreakDuration * 60);
  };

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  };

  // Get timer title based on state
  const getTimerTitle = () => {
    switch (timerState) {
      case 'work': return 'Focus Time';
      case 'break': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Pomodoro Timer';
    }
  };

  // Get timer color based on state
  const getTimerColor = () => {
    switch (timerState) {
      case 'work': return 'bg-red-500';
      case 'break': return 'bg-green-500';
      case 'longBreak': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Save settings and close modal
  const saveSettings = () => {
    setShowSettings(false);
    // Reset timer with new settings
    if (timerState === 'work') {
      setTimeLeft(workDuration * 60);
    } else if (timerState === 'break') {
      setTimeLeft(breakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-16">
      <Header title="Pomodoro Timer" />
      
      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center p-6">
        <div className={`w-64 h-64 rounded-full ${getTimerColor()} flex flex-col items-center justify-center text-white mb-8 relative`}>
          <button 
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <FaCog size={20} />
          </button>
          <div className="text-4xl font-bold mb-2">{formatTime(timeLeft)}</div>
          <div className="text-lg">{getTimerTitle()}</div>
        </div>
        
        {/* Timer Controls */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <button 
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
          >
            {isRunning ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>
          
          <button 
            onClick={resetTimer}
            className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
          >
            <FaRedo size={24} />
          </button>
        </div>
        
        {/* State Switcher */}
        <div className="flex space-x-4 mb-8">
          <button 
            onClick={switchToWork}
            className={`px-4 py-2 rounded-lg ${timerState === 'work' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Work
          </button>
          <button 
            onClick={switchToBreak}
            className={`px-4 py-2 rounded-lg ${timerState === 'break' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Break
          </button>
          <button 
            onClick={switchToLongBreak}
            className={`px-4 py-2 rounded-lg ${timerState === 'longBreak' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Long Break
          </button>
        </div>
        
        {/* Stats */}
        <div className="w-full max-w-md bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 dark:text-white">Pomodoro Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold dark:text-white">{completedPomodoros}</div>
              <div className="text-gray-500 dark:text-gray-300">Completed</div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold dark:text-white">{totalPomodoroHours.toFixed(2)}h</div>
              <div className="text-gray-500 dark:text-gray-300">Total Hours</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold dark:text-white">Timer Settings</h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium dark:text-white mb-1">
                    Work Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={workDuration}
                    onChange={(e) => setWorkDuration(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium dark:text-white mb-1">
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium dark:text-white mb-1">
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={longBreakDuration}
                    onChange={(e) => setLongBreakDuration(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium dark:text-white mb-1">
                    Pomodoros before Long Break
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={pomodorosBeforeLongBreak}
                    onChange={(e) => setPomodorosBeforeLongBreak(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={requestNotificationPermission}
                    className="flex items-center justify-center w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <FaBell className="mr-2" />
                    Enable Notifications
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {Notification.permission === 'granted' 
                      ? 'Notifications enabled' 
                      : 'Enable to get alerts when timer completes'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFfHd5eXl8f4B/gH9/fn18e3t8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==" />
      
      <BottomNavigation />
    </div>
  );
};

export default Timer;