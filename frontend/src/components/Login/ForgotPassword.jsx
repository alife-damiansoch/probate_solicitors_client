
import { postData } from '../GenericFunctions/AxiosGenericFunctions';
import RedirectCountdown from '../GenericComponents/RedirectCountdown';
import {useState} from "react"; // Import the reusable component

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSending(true);

    try {
      const frontendHost = window.location.origin; // Dynamically gets current frontend URL
      console.log(frontendHost);
      const response = await postData('token', '/api/user/forgot-password/', {
        email,
      });
      if (response.status === 200) {
        setMessage(response.data.detail);
        setRedirecting(true); // Start redirect countdown
      } else {
        setError(response.data.detail);
        setIsSending(false);
      }
    } catch (err) {
      setError('An error occurred while sending the reset email.');
      setIsSending(false);
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-light my-5'>
      <div className='card shadow-sm p-4 my-5'>
        <div className='card-body'>
          <h3 className='card-title text-center mb-4'>Forgot Password</h3>
          <p className='text-center text-muted mb-4'>
            Enter your email address to receive a password reset link.
          </p>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='email' className='form-label'>
                Email Address
              </label>
              <input
                type='email'
                className='form-control'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary w-100'
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          {message && <div className='alert alert-success mt-3'>{message}</div>}
          {error && <div className='alert alert-danger mt-3'>{error}</div>}

          {/* Use the RedirectCountdown component */}
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

export default ForgotPassword;
