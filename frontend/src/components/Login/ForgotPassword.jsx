import { AnimatePresence, motion } from 'framer-motion';
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
  const [focusedField, setFocusedField] = useState(null);

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

  // Enhanced theme-aware styles
  const containerStyle = {
    minHeight: 'calc(100vh - 90px)', // Subtract navbar (80px) + footer (80px) = 160px
    paddingTop: '150px',
    transition: 'all 0.3s ease',
  };

  const backButtonStyle = {
    background: 'var(--surface-primary)',
    border: '2px solid var(--border-secondary)',
    borderRadius: '12px',
    color: 'var(--text-muted)',
    fontWeight: '600',
    fontSize: '0.9rem',
    boxShadow: `
      0 4px 16px var(--primary-10),
      0 2px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 var(--white-10)
    `,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
  };

  const cardStyle = {
    borderRadius: '20px',
    background: 'var(--gradient-surface)',
    boxShadow: `
      0 16px 50px rgba(0, 0, 0, 0.12),
      0 8px 32px var(--primary-10),
      0 4px 16px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 var(--white-10)
    `,
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    overflow: 'hidden',
    border: '1px solid var(--border-secondary)',
    transition: 'all 0.3s ease',
  };

  const headerStyle = {
    background: `
      linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 80%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
    `,
    backgroundBlendMode: 'overlay',
    borderBottom: 'none',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    color: '#ffffff',
    boxShadow: `
      0 8px 32px var(--primary-20),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    position: 'relative',
    overflow: 'hidden',
  };

  const iconContainerStyle = {
    width: '64px',
    height: '64px',
    background: `
      linear-gradient(145deg, var(--primary-blue), var(--primary-blue-dark)),
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent)
    `,
    color: '#ffffff',
    boxShadow: `
      0 8px 24px var(--primary-30),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
    `,
    border: '1px solid var(--primary-40)',
    borderRadius: '50%',
  };

  const inputStyle = (fieldName) => ({
    borderRadius: '12px',
    border: `2px solid ${
      focusedField === fieldName ? 'var(--primary-blue)' : 'var(--border-muted)'
    }`,
    fontSize: '0.95rem',
    padding: '12px 16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow:
      focusedField === fieldName
        ? `
          0 0 0 4px var(--primary-20),
          0 4px 20px var(--primary-10),
          inset 0 1px 0 var(--white-10)
        `
        : `
          0 2px 8px rgba(0, 0, 0, 0.05),
          inset 0 1px 0 var(--white-05)
        `,
    background: 'var(--surface-secondary)',
    color: 'var(--text-primary)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  });

  const submitButtonStyle = {
    background: `
      linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
    `,
    backgroundBlendMode: 'overlay',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '14px 24px',
    boxShadow: `
      0 8px 24px var(--primary-30),
      0 4px 12px var(--primary-20),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  };

  const successStyle = {
    background: 'var(--success-20)',
    color: 'var(--success-primary)',
    border: '1px solid var(--success-30)',
    borderRadius: '10px',
    fontSize: '0.9rem',
    padding: '12px 16px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  const errorStyle = {
    background: 'var(--error-20)',
    color: 'var(--error-primary)',
    border: '1px solid var(--error-30)',
    borderRadius: '10px',
    fontSize: '0.9rem',
    padding: '12px 16px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  const infoBoxStyle = {
    background: `
      linear-gradient(135deg, var(--primary-10), var(--primary-05)),
      radial-gradient(circle at 20% 20%, var(--primary-15), transparent)
    `,
    border: '1px solid var(--primary-20)',
    borderRadius: '10px',
    padding: '14px 16px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: `
      0 4px 12px var(--primary-10),
      inset 0 1px 0 var(--white-10)
    `,
  };

  return (
    <motion.div
      className='pb-4'
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='container'>
        {/* Enhanced Header Section */}
        <motion.div
          className='d-flex align-items-center mb-4'
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.button
            className='btn d-flex align-items-center px-3 py-2'
            style={backButtonStyle}
            onClick={() => navigate(-1)}
            whileHover={{
              scale: 1.02,
              boxShadow: `
                0 6px 20px var(--primary-15),
                0 4px 12px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 var(--white-15)
              `,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <FaArrowLeft className='me-2' size={14} />
            Back
          </motion.button>
        </motion.div>

        {/* Enhanced Main Card */}
        <div className='row justify-content-center'>
          <div className='col-lg-4 col-md-6'>
            <motion.div
              className='card border-0'
              style={cardStyle}
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.6,
                type: 'spring',
                stiffness: 100,
              }}
              whileHover={{
                y: -3,
                boxShadow: `
                  0 20px 60px rgba(0, 0, 0, 0.15),
                  0 12px 40px var(--primary-15),
                  0 6px 20px rgba(0, 0, 0, 0.12),
                  inset 0 1px 0 var(--white-15)
                `,
              }}
            >
              {/* Enhanced Card Header */}
              <div
                className='card-header border-0 py-4 text-center position-relative'
                style={headerStyle}
              >
                {/* Subtle background pattern */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                      radial-gradient(circle at 30% 30%, var(--warning-10), transparent 60%),
                      radial-gradient(circle at 70% 70%, var(--warning-05), transparent 60%)
                    `,
                    animation: 'float 6s ease-in-out infinite',
                  }}
                />

                <motion.div
                  className='d-flex align-items-center justify-content-center position-relative mx-auto mb-3'
                  style={iconContainerStyle}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.6, type: 'spring' }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <FaLock size={22} />
                </motion.div>

                <motion.h4
                  className='mb-1 fw-bold'
                  style={{
                    color: '#ffffff',
                    fontSize: '1.4rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Forgot Password
                </motion.h4>

                <motion.p
                  className='mb-0'
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.9rem',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Enter your email address to receive a password reset link
                </motion.p>
              </div>

              {/* Enhanced Success/Error Messages */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    className='mx-4 mt-3'
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='alert border-0' style={successStyle}>
                      {message}
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    className='mx-4 mt-3'
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='alert border-0' style={errorStyle}>
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Form Body */}
              <div className='card-body px-4 pb-3'>
                <form onSubmit={handleSubmit}>
                  {/* Enhanced Email Field */}
                  <motion.div
                    className='mb-3'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <label
                      className='form-label fw-semibold mb-2'
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <FaEnvelope
                        className='me-2'
                        style={{ color: 'var(--primary-blue)' }}
                        size={12}
                      />
                      Email Address
                    </label>
                    <input
                      type='email'
                      className='form-control'
                      style={inputStyle('email')}
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder='Enter your email address'
                    />
                  </motion.div>

                  {/* Enhanced Information Box */}
                  <motion.div
                    className='mb-3'
                    style={infoBoxStyle}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <small
                      style={{
                        color: 'var(--primary-blue-dark)',
                        fontWeight: '500',
                      }}
                    >
                      <strong>Note:</strong> If an account with this email
                      exists, you will receive a password reset link within a
                      few minutes.
                    </small>
                  </motion.div>

                  {/* Enhanced Submit Button */}
                  <motion.div
                    className='mt-3'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    <motion.button
                      type='submit'
                      className='btn w-100'
                      style={submitButtonStyle}
                      disabled={isSending}
                      whileHover={
                        !isSending
                          ? {
                              scale: 1.02,
                              boxShadow: `
                          0 12px 32px var(--primary-40),
                          0 6px 16px var(--primary-30),
                          inset 0 1px 0 rgba(255, 255, 255, 0.3)
                        `,
                            }
                          : {}
                      }
                      whileTap={!isSending ? { scale: 0.98 } : {}}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      {/* Button shimmer effect */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background:
                            'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                          animation: !isSending
                            ? 'shimmer 2s infinite'
                            : 'none',
                        }}
                      />

                      {isSending ? (
                        <div className='d-flex align-items-center justify-content-center'>
                          <div
                            className='spinner-border spinner-border-sm me-2'
                            role='status'
                            style={{ width: '18px', height: '18px' }}
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
                    </motion.button>
                  </motion.div>
                </form>

                {/* Enhanced Redirect Countdown */}
                <AnimatePresence>
                  {redirecting && (
                    <motion.div
                      className='mt-3'
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RedirectCountdown
                        message='Redirecting to login in'
                        redirectPath='/login'
                        countdownTime={3}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enhanced Back to Login Link */}
                {!redirecting && (
                  <motion.div
                    className='text-center mt-3 pt-3'
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                  >
                    <p
                      className='mb-0'
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                      }}
                    >
                      Remember your password?{' '}
                      <button
                        type='button'
                        className='btn btn-link p-0 text-decoration-none fw-semibold'
                        style={{
                          color: 'var(--primary-blue)',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => navigate('/login')}
                        onMouseEnter={(e) => {
                          e.target.style.color = 'var(--primary-blue-dark)';
                          e.target.style.textShadow =
                            '0 2px 4px var(--primary-20)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = 'var(--primary-blue)';
                          e.target.style.textShadow = 'none';
                        }}
                      >
                        Back to Sign In
                      </button>
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        /* Enhanced focus styles */
        .form-control:focus {
          outline: none;
          border-color: var(--primary-blue) !important;
          box-shadow: 
            0 0 0 4px var(--primary-20),
            0 4px 20px var(--primary-10),
            inset 0 1px 0 var(--white-10) !important;
        }
        
        /* Enhanced placeholder styles */
        .form-control::placeholder {
          color: var(--text-disabled);
          opacity: 0.8;
        }
      `}</style>
    </motion.div>
  );
}

export default ForgotPassword;
