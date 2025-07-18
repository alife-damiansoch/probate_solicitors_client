import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSignInAlt,
  FaUser,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthError } from '../../store/authSlice';
import { postData } from '../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const authError = useSelector((state) => state.auth.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    setErrors(null);
    e.preventDefault();

    try {
      const response = await postData('token', '/api/user/check-credentials/', {
        email,
        password,
      });

      if (response.status === 200) {
        const { otp_required, authenticator_required } = response.data;

        if (otp_required || authenticator_required) {
          const authMethod = otp_required ? 'otp' : 'authenticator';
          navigate('/verify-otp', { state: { email, password, authMethod } });
        }
      } else {
        setErrors(response.data);
      }
    } catch (error) {
      setErrors(error.response?.data?.error || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced theme-aware styles
  const containerStyle = {
    minHeight: 'calc(100vh - 90px)', // Subtract navbar (80px) + footer (80px) = 160px
    paddingTop: '150px', // Reduced from 150px to make login shorter
    transition: 'all 0.3s ease',
  };

  const backButtonStyle = {
    background: 'var(--surface-primary)',
    border: '2px solid var(--border-secondary)',
    borderRadius: '16px',
    color: 'var(--text-muted)',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: `
      0 4px 20px var(--primary-10),
      0 2px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 var(--white-10)
    `,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  };

  const cardStyle = {
    borderRadius: '24px',
    background: 'var(--gradient-surface)',
    boxShadow: `
      0 20px 60px rgba(0, 0, 0, 0.15),
      0 8px 32px var(--primary-10),
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 var(--white-10)
    `,
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
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
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    color: '#ffffff',
    boxShadow: `
      0 8px 32px var(--primary-20),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    position: 'relative',
    overflow: 'hidden',
  };

  const iconContainerStyle = {
    width: '72px',
    height: '72px',
    background: `
      linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1)),
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent)
    `,
    color: '#ffffff',
    boxShadow: `
      0 8px 24px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
    `,
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const inputStyle = (fieldName) => ({
    borderRadius: '14px',
    border: `2px solid ${
      focusedField === fieldName ? 'var(--primary-blue)' : 'var(--border-muted)'
    }`,
    fontSize: '1.05rem',
    padding: '14px 16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow:
      focusedField === fieldName
        ? `
          0 0 0 4px var(--primary-20),
          0 4px 20px var(--primary-10),
          inset 0 1px 0 var(--white-10)
        `
        : `
          0 2px 12px rgba(0, 0, 0, 0.05),
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
    borderRadius: '14px',
    fontSize: '1.1rem',
    fontWeight: '600',
    padding: '16px 24px',
    boxShadow: `
      0 8px 32px var(--primary-30),
      0 4px 16px var(--primary-20),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  };

  const errorStyle = {
    background: 'var(--error-20)',
    color: 'var(--error-primary)',
    border: '1px solid var(--error-30)',
    borderRadius: '12px',
    fontSize: '0.95rem',
    padding: '12px 16px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
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
          className='d-flex align-items-center mb-4 gap-2'
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.button
            className='btn d-flex align-items-center px-4 py-3'
            style={backButtonStyle}
            onClick={() => navigate(-1)}
            whileHover={{
              scale: 1.02,
              boxShadow: `
                0 6px 25px var(--primary-15),
                0 4px 12px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 var(--white-15)
              `,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <FaArrowLeft className='me-2' size={16} />
            Back
          </motion.button>
        </motion.div>

        {/* Enhanced Main Login Card */}
        <div className='row justify-content-center'>
          <div className='col-12 col-md-7 col-lg-5 col-xl-4'>
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
                y: -5,
                boxShadow: `
                  0 25px 80px rgba(0, 0, 0, 0.2),
                  0 12px 40px var(--primary-15),
                  0 6px 20px rgba(0, 0, 0, 0.15),
                  inset 0 1px 0 var(--white-15)
                `,
              }}
            >
              {/* Enhanced Card Header */}
              <div
                className='card-header border-0 py-4 text-center position-relative'
                style={headerStyle}
              >
                {/* Animated background pattern */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                      radial-gradient(circle at 20% 20%, var(--primary-20), transparent 50%),
                      radial-gradient(circle at 80% 80%, var(--primary-15), transparent 50%)
                    `,
                    animation: 'float 6s ease-in-out infinite',
                  }}
                />

                <motion.div
                  className='rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center position-relative'
                  style={{
                    ...iconContainerStyle,
                    width: '60px',
                    height: '60px',
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.6, type: 'spring' }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <FaUser size={24} />
                </motion.div>

                <motion.h3
                  className='mb-1 fw-bold'
                  style={{
                    fontSize: '1.5rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Welcome Back
                </motion.h3>

                <motion.div
                  className='mb-0'
                  style={{ opacity: 0.9, fontSize: '0.95rem' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Sign in to your account
                </motion.div>
              </div>

              {/* Enhanced Error Display */}
              <AnimatePresence>
                {(authError || errors) && (
                  <motion.div
                    className='mx-4 mt-3'
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='alert border-0' style={errorStyle}>
                      {renderErrors(authError || errors)}
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
                        fontSize: '0.95rem',
                      }}
                    >
                      <FaUser
                        className='me-2'
                        style={{ color: 'var(--primary-blue)' }}
                        size={14}
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

                  {/* Enhanced Password Field */}
                  <motion.div
                    className='mb-2'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <label
                      className='form-label fw-semibold mb-2'
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem',
                      }}
                    >
                      <FaLock
                        className='me-2'
                        style={{ color: 'var(--primary-blue)' }}
                        size={14}
                      />
                      Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className='form-control'
                        style={{
                          ...inputStyle('password'),
                          paddingRight: '50px',
                        }}
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder='Enter your password'
                      />
                      <motion.button
                        type='button'
                        className='btn position-absolute'
                        style={{
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'none',
                          color: 'var(--text-muted)',
                          padding: '8px',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        whileHover={{
                          scale: 1.1,
                          color: 'var(--primary-blue)',
                          background: 'var(--primary-10)',
                          transform: 'translateY(-50%) scale(1.1)', // Fixed: Combined transforms
                        }}
                        whileTap={{
                          scale: 0.9,
                          transform: 'translateY(-50%) scale(0.9)', // Fixed: Combined transforms
                        }}
                      >
                        {showPassword ? (
                          <FaEyeSlash size={16} />
                        ) : (
                          <FaEye size={16} />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Enhanced Forgot Password Link */}
                  <motion.div
                    className='text-end mb-3'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    <Link
                      to='/forgotPassword'
                      className='text-decoration-none fw-semibold'
                      style={{
                        color: 'var(--primary-blue)',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease',
                      }}
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
                      Forgot your password?
                    </Link>
                  </motion.div>

                  {/* Enhanced Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                  >
                    <motion.button
                      type='submit'
                      className='btn w-100'
                      style={submitButtonStyle}
                      disabled={isLoading}
                      whileHover={
                        !isLoading
                          ? {
                              scale: 1.02,
                              boxShadow: `
                          0 12px 40px var(--primary-40),
                          0 6px 20px var(--primary-30),
                          inset 0 1px 0 rgba(255, 255, 255, 0.3)
                        `,
                            }
                          : {}
                      }
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
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
                          animation: !isLoading
                            ? 'shimmer 2s infinite'
                            : 'none',
                        }}
                      />

                      {isLoading ? (
                        <div className='d-flex align-items-center justify-content-center'>
                          <div
                            className='spinner-border spinner-border-sm me-2'
                            role='status'
                            style={{ width: '20px', height: '20px' }}
                          >
                            <span className='visually-hidden'>Loading...</span>
                          </div>
                          Signing in...
                        </div>
                      ) : (
                        <>
                          <FaSignInAlt className='me-2' size={16} />
                          Sign In
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>

                {/* Enhanced Register Link */}
                <motion.div
                  className='text-center mt-3 pt-3'
                  style={{ borderTop: '1px solid var(--border-subtle)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  <p
                    className='mb-0'
                    style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}
                  >
                    Don&apos;t have an account?{' '}
                    <Link
                      to='/register'
                      className='text-decoration-none fw-semibold'
                      style={{
                        color: 'var(--primary-blue)',
                        transition: 'all 0.2s ease',
                      }}
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
                      Register here
                    </Link>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
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
};

export default LoginComponent;
