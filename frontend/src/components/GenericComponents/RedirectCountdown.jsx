import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectCountdown({ message, redirectPath = '/', countdownTime = 3 }) {
  const [timeRemaining, setTimeRemaining] = useState(countdownTime);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate(redirectPath); // Redirect to specified path
    }, countdownTime * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [countdownTime, navigate, redirectPath]);

  return (
    <div className='text-center text-muted mt-3'>
      {message} <strong>{timeRemaining}</strong> seconds...
    </div>
  );
}

export default RedirectCountdown;
