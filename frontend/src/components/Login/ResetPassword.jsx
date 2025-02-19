import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { postData } from '../GenericFunctions/AxiosGenericFunctions';
import RedirectCountdown from '../GenericComponents/RedirectCountdown';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';

function ResetPassword() {
  const { uidb64, token } = useParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSending(true);
      const response = await postData(
        'token',
        `/api/user/reset-password/${uidb64}/${token}/`,
        {
          password,
        }
      );
      if (response.status === 200) {
        setMessage(response.data.detail);
        setRedirecting(true);
      } else {
        setError(response.data);
        setIsSending(false);
      }
    } catch (err) {
      setError('An error occurred while resetting the password.');
      setIsSending(false);
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-light my-5'>
      <div className='card shadow-sm p-4 my-5' style={{ minWidth: '400px' }}>
        <div className='card-body'>
          <h3 className='card-title text-center mb-4'>Reset Password</h3>
          <p className='text-center text-muted mb-4'>
            Enter your new password below.
          </p>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='password' className='form-label'>
                New Password
              </label>
              <input
                type='password'
                className='form-control'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='confirmPassword' className='form-label'>
                Confirm New Password
              </label>
              <input
                type='password'
                className='form-control'
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary w-100'
              disabled={isSending}
            >
              Reset Password
            </button>
          </form>
          {message && <div className='alert alert-success mt-3'>{message}</div>}
          {error && (
            <div className='alert alert-danger mt-3'>{renderErrors(error)}</div>
          )}
          {redirecting && (
            <RedirectCountdown
              message='Redirecting to login in'
              redirectPath='/login'
              countdownTime={3}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
