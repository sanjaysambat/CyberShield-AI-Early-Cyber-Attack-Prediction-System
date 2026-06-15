import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isTokenExpired } from '@/lib/security';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const SESSION_TIMEOUT_MINUTES = 30;
const WARNING_TIME_MINUTES = 5;

export const SessionTimeoutWarning: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(WARNING_TIME_MINUTES * 60);

  useEffect(() => {
    if (!isAuthenticated) return;

    let warningTimeout: NodeJS.Timeout | null = null;
    let logoutTimeout: NodeJS.Timeout | null = null;
    let countdownInterval: NodeJS.Timeout | null = null;

    const resetTimeouts = () => {
      if (warningTimeout) clearTimeout(warningTimeout);
      if (logoutTimeout) clearTimeout(logoutTimeout);
      if (countdownInterval) clearInterval(countdownInterval);

      localStorage.setItem('last_activity', Date.now().toString());

      // Show warning 5 minutes before timeout
      warningTimeout = setTimeout(() => {
        setShowWarning(true);
        setTimeRemaining(WARNING_TIME_MINUTES * 60);

        // Start countdown
        countdownInterval = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              // Auto logout
              handleLogout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, (SESSION_TIMEOUT_MINUTES - WARNING_TIME_MINUTES) * 60 * 1000);

      // Auto logout after session timeout
      logoutTimeout = setTimeout(() => {
        handleLogout();
      }, SESSION_TIMEOUT_MINUTES * 60 * 1000);
    };

    const handleLogout = () => {
      setShowWarning(false);
      logout();
      navigate('/login');
    };

    const handleUserActivity = () => {
      if (showWarning) return; // Don't reset if warning is showing
      resetTimeouts();
    };

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity);
    });

    // Initial timeout setup
    resetTimeouts();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });
      if (warningTimeout) clearTimeout(warningTimeout);
      if (logoutTimeout) clearTimeout(logoutTimeout);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [isAuthenticated, logout, navigate, showWarning]);

  const handleContinueSession = () => {
    setShowWarning(false);
    localStorage.setItem('last_activity', Date.now().toString());
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Timeout Warning</AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire due to inactivity in {minutes}:{seconds.toString().padStart(2, '0')}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Click "Continue" to stay logged in, or "Logout" to end your session.
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLogout}>
            Logout
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleContinueSession}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
