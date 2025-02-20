
import { useParams } from 'react-router-dom';

import { postData } from '../GenericFunctions/AxiosGenericFunctions';
import RedirectCountdown from '../GenericComponents/RedirectCountdown';
import {useEffect, useRef, useState} from "react";

const ActivationPage = () => {
  const { activation_token } = useParams(); // Extract the token from the URL
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const hasActivated = useRef(false); // Track if the effect has already run
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (hasActivated.current) return; // Prevent re-execution
    hasActivated.current = true; // Mark as executed

    const activateAccount = async () => {
      try {
        const response = await postData(
          'token',
          `/api/user/activate/`, // Replace with your backend endpoint
          { activation_token: activation_token }
        );

        if (response.status === 200) {
          setStatus(
            response?.data?.detail ||
              'Your account has been successfully activated!'
          );
        } else {
          setError(
            response?.data?.detail ||
              'Failed to activate your account. Please contact support.'
          );
        }
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            'Failed to activate your account. Please contact support.'
        );
      } finally {
        setLoading(false); // Ensure loading stops after the process
        setRedirecting(true);
      }
    };

    activateAccount();
  }, [activation_token]);

  return (
    <div className='container mt-5 d-flex justify-content-center'>
      <div
        className='card shadow-lg'
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <div className='card-body'>
          <h5 className='card-title text-center'>Account Activation</h5>
          {loading && (
            <div className='d-flex justify-content-center mt-3'>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
            </div>
          )}
          {status && (
            <div className='alert alert-success mt-3 text-center'>{status}</div>
          )}
          {error && (
            <div className='alert alert-danger mt-3 text-center'>{error}</div>
          )}
          {redirecting && (
            <RedirectCountdown
              message='Redirecting to login in'
              redirectPath='/login'
              countdownTime={10}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;
