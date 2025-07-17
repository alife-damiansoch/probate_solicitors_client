import { useState } from 'react';
import { FaArrowLeft, FaEnvelope, FaLock, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RedirectCountdown from '../GenericComponents/RedirectCountdown';
import { postData } from '../GenericFunctions/AxiosGenericFunctions';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();

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
    <div
      className='min-vh-100 pb-4'
      style={{ backgroundColor: '#f8fafc', paddingTop: '150px' }}
    >
      <div className='container'>
        {/* Header Section */}
        <div className='d-flex align-items-center mb-4'>
          <button
            className='btn d-flex align-items-center px-3 py-2'
            style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
            }}
            onClick={() => navigate(-1)}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            <FaArrowLeft className='me-2' size={14} />
            Back
          </button>
        </div>

        {/* Main Card */}
        <div className='row justify-content-center'>
          <div className='col-lg-4 col-md-6'>
            <div
              className='card border-0'
              style={{
                borderRadius: '12px',
                boxShadow:
                  '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                backgroundColor: 'white',
              }}
            >
              {/* Card Header */}
              <div
                className='card-header border-0 py-4 text-center'
                style={{
                  backgroundColor: 'white',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div
                  className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                  }}
                >
                  <FaLock size={24} />
                </div>
                <h4 className='mb-1 fw-bold text-slate-800'>Forgot Password</h4>
                <p className='mb-0 text-slate-500 small'>
                  Enter your email address to receive a password reset link
                </p>
              </div>

              {/* Success/Error Messages */}
              {message && (
                <div className='mx-4 mt-3'>
                  <div
                    className='alert border-0'
                    style={{
                      backgroundColor: '#f0fdf4',
                      color: '#166534',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                    }}
                  >
                    {message}
                  </div>
                </div>
              )}

              {error && (
                <div className='mx-4 mt-3'>
                  <div
                    className='alert border-0'
                    style={{
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                    }}
                  >
                    {error}
                  </div>
                </div>
              )}

              {/* Form Body */}
              <div className='card-body px-4 pb-4'>
                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className='mb-4'>
                    <label className='form-label fw-medium text-slate-600 mb-2 small'>
                      <FaEnvelope className='me-2 text-slate-400' size={12} />
                      Email Address
                    </label>
                    <input
                      type='email'
                      className='form-control form-control-sm'
                      style={{
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.9rem',
                        transition: 'border-color 0.2s ease',
                      }}
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      onFocus={(e) => (e.target.style.borderColor = '#f59e0b')}
                      onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                      placeholder='Enter your email address'
                    />
                  </div>

                  {/* Information Box */}
                  <div
                    className='mb-4 p-3 rounded'
                    style={{
                      backgroundColor: '#fef3c7',
                      border: '1px solid #fbbf24',
                    }}
                  >
                    <small className='text-amber-800'>
                      <strong>Note:</strong> If an account with this email
                      exists, you will receive a password reset link within a
                      few minutes.
                    </small>
                  </div>

                  {/* Submit Button */}
                  <div className='mt-4'>
                    <button
                      type='submit'
                      className='btn w-100 py-2 fw-medium'
                      style={{
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease',
                      }}
                      disabled={isSending}
                      onMouseOver={(e) => {
                        if (!isSending) {
                          e.target.style.backgroundColor = '#d97706';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSending) {
                          e.target.style.backgroundColor = '#f59e0b';
                        }
                      }}
                    >
                      {isSending ? (
                        <div className='d-flex align-items-center justify-content-center'>
                          <div
                            className='spinner-border spinner-border-sm me-2'
                            role='status'
                            style={{ width: '16px', height: '16px' }}
                          >
                            <span className='visually-hidden'>Loading...</span>
                          </div>
                          Sending...
                        </div>
                      ) : (
                        <>
                          <FaPaperPlane className='me-2' size={14} />
                          Send Reset Link
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Redirect Countdown */}
                {redirecting && (
                  <div className='mt-4'>
                    <RedirectCountdown
                      message='Redirecting to login in'
                      redirectPath='/login'
                      countdownTime={3}
                    />
                  </div>
                )}

                {/* Back to Login Link */}
                {!redirecting && (
                  <div
                    className='text-center mt-4 pt-3'
                    style={{ borderTop: '1px solid #f1f5f9' }}
                  >
                    <p className='mb-0 text-slate-500 small'>
                      Remember your password?{' '}
                      <button
                        type='button'
                        className='btn btn-link p-0 text-decoration-none fw-medium'
                        style={{
                          color: '#f59e0b',
                          fontSize: '0.85rem',
                          transition: 'color 0.2s ease',
                        }}
                        onClick={() => navigate('/login')}
                        onMouseOver={(e) => (e.target.style.color = '#d97706')}
                        onMouseOut={(e) => (e.target.style.color = '#f59e0b')}
                      >
                        Back to Sign In
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
