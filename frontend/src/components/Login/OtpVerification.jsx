import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FaClock,
  FaEnvelope,
  FaExchangeAlt,
  FaMobileAlt,
  FaRedo,
  FaShieldAlt,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearAuthError, signup } from '../../store/authSlice';
import LoadingComponent from '../GenericComponents/LoadingComponent';
import { fetchData, postData } from '../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import QrCodeDisplay from './QrCodeDisplay';
import VerificationForm from './VerificationForm';

const VerifyOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [qrCode, setQrCode] = useState(null);
  const [manualKey, setManualKey] = useState(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [timer, setTimer] = useState(0);
  const [step, setStep] = useState('emailValidation');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email and password from navigation state
  const {
    email,
    password,
    authMethod: initialAuthMethod,
  } = location.state || {};
  const [authMethod, setAuthMethod] = useState(initialAuthMethod || 'otp');
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    // Check authentication status
    const checkAuthStatus = async () => {
      if (email) {
        try {
          setIsLoading(true);
          const response = await fetchData(
            'check',
            `/api/user/update-auth-method/?email=${encodeURIComponent(email)}`
          );

          if (response.status === 200) {
            const { auth_method, qr_code, manual_key, is_active } =
              response.data;
            setAuthMethod(auth_method);

            if (!is_active && qr_code) {
              setQrCode(qr_code);
              setManualKey(manual_key);
            }
          }
        } catch (error) {
          setErrors(
            error.response?.data || 'Failed to check authentication status.'
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuthStatus();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null);
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      const resultAction = await dispatch(signup({ email, password, otp }));

      if (signup.fulfilled.match(resultAction)) {
        setIsLoading(false);
        navigate('/applications');
      } else if (signup.rejected.match(resultAction)) {
        setErrors(resultAction.payload);
        setIsLoading(false);
      }
    }
  };

  const handleSwitchMethod = async (refreshCurrent = false) => {
    setQrCode(null);
    setManualKey(null);
    try {
      setIsLoading(true);
      setErrors(null);
      let methodToSend;
      if (refreshCurrent) {
        methodToSend = authMethod;
      } else {
        methodToSend = authMethod === 'otp' ? 'authenticator' : 'otp';
      }
      setAuthMethod(methodToSend);
      const response = await postData(
        'token',
        '/api/user/update-auth-method/',
        { email, preferred_auth_method: methodToSend }
      );
      if (response.status === 200) {
        const { auth_method, qr_code, manual_key } = response.data;
        if (qr_code && auth_method === 'authenticator') {
          setQrCode(qr_code);
          setManualKey(manual_key);
        } else {
          setQrCode(null);
          setManualKey(null);
        }
      } else {
        setErrors(response.data);
      }
    } catch (error) {
      setErrors(error.response?.data || 'Failed to switch method.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (authCode) => {
    setErrors(null);
    const response = await postData(
      'verify',
      '/api/user/verify-authenticator-code/',
      { email: email, code: authCode }
    );
    if (response.status === 200) {
      alert('Authenticator successfully activated!');
      setQrCode(null);
      setAuthMethod('authenticator');
    } else {
      setErrors(response.data);
    }
  };

  useEffect(() => {
    let countdownInterval;
    if (isCooldown && timer > 0) {
      countdownInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0) {
      clearInterval(countdownInterval);
      setIsCooldown(false);
    }
    return () => clearInterval(countdownInterval);
  }, [isCooldown, timer]);

  const handleClick = () => {
    if (!isCooldown) {
      handleSwitchMethod(true);
      setIsCooldown(true);
      setTimer(120);
    }
  };

  useEffect(() => {
    if (!email || !password) {
      navigate('/login');
    }
  }, [email, password, navigate]);

  // Enhanced theme-aware styles
  const containerStyle = {
    minHeight: 'calc(100vh - 90px)',
    paddingTop: '150px',

    transition: 'all 0.3s ease',
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
      linear-gradient(135deg, var(--primary-blue) 0%, var(--success-primary) 80%),
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
    width: '60px',
    height: '60px',
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

  const switchButtonStyle = {
    background: 'var(--surface-secondary)',
    border: '2px solid var(--border-muted)',
    borderRadius: '12px',
    color: 'var(--primary-blue)',
    fontWeight: '600',
    fontSize: '0.95rem',
    padding: '10px 20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    textDecoration: 'none',
  };

  const resendButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: 'var(--primary-blue)',
    fontWeight: '600',
    fontSize: '0.95rem',
    textDecoration: 'underline',
    transition: 'all 0.2s ease',
    padding: '8px 0',
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

  const infoTextStyle = {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    lineHeight: '1.4',
  };

  if (!email || !password) return null;
  if (isLoading) return <LoadingComponent />;

  return (
    <motion.div
      className=' d-flex align-items-center justify-content-center'
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5'>
            <motion.div
              className='card border-0 p-0'
              style={cardStyle}
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1,
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
                      radial-gradient(circle at 80% 80%, var(--success-15), transparent 50%)
                    `,
                    animation: 'float 6s ease-in-out infinite',
                  }}
                />

                <motion.div
                  className='rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center position-relative'
                  style={iconContainerStyle}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <FaShieldAlt size={24} />
                </motion.div>

                <motion.h3
                  className='fw-bold mb-1'
                  style={{
                    fontSize: '1.5rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Verify Your Account
                </motion.h3>

                <motion.div
                  className='mb-0'
                  style={{ opacity: 0.9, fontSize: '0.95rem' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className='d-flex align-items-center justify-content-center'>
                    {authMethod === 'otp' ? (
                      <>
                        <FaEnvelope className='me-2' size={14} />
                        Enter the 6-digit code sent to your email
                      </>
                    ) : (
                      <>
                        <FaMobileAlt className='me-2' size={14} />
                        Enter the code from your authenticator app
                      </>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* QR or Verification Content */}
              <motion.div
                className='card-body px-4 pt-4 pb-2'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <AnimatePresence mode='wait'>
                  {qrCode ? (
                    <motion.div
                      key='qr-code'
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <QrCodeDisplay
                        qrCode={qrCode}
                        manualKey={manualKey}
                        onDone={() => {
                          setQrCode(null);
                          handleSwitchMethod();
                        }}
                        onVerify={handleVerifyCode}
                        email={email}
                        step={step}
                        setStep={setStep}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key='verification-form'
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <VerificationForm
                        otp={otp}
                        setOtp={setOtp}
                        isLoading={isLoading}
                        handleSubmit={handleSubmit}
                      />

                      <motion.div
                        className='my-3 text-center'
                        style={infoTextStyle}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        {authMethod === 'otp' ? (
                          <>
                            <FaEnvelope
                              className='me-2'
                              style={{ color: 'var(--primary-blue)' }}
                              size={14}
                            />
                            A security code was sent to:
                            <br />
                            <span
                              className='fw-bold'
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {email}
                            </span>
                          </>
                        ) : (
                          <>
                            <FaMobileAlt
                              className='me-2'
                              style={{ color: 'var(--primary-blue)' }}
                              size={14}
                            />
                            Open your authenticator app to retrieve your code.
                          </>
                        )}
                      </motion.div>

                      <motion.div
                        className='text-center my-3'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <motion.button
                          type='button'
                          className='btn'
                          style={switchButtonStyle}
                          onClick={() => handleSwitchMethod(false)}
                          disabled={isLoading}
                          whileHover={{
                            scale: 1.02,
                            borderColor: 'var(--primary-blue)',
                            boxShadow: `
                              0 4px 20px var(--primary-20),
                              0 2px 8px rgba(0, 0, 0, 0.1)
                            `,
                          }}
                          whileTap={{ scale: 0.98 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <FaExchangeAlt className='me-2' size={14} />
                          Use{' '}
                          {authMethod === 'otp'
                            ? 'Authenticator App'
                            : 'Email Verification'}
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Resend and Cooldown Section */}
              {(!qrCode || step === 'emailValidation') && (
                <motion.div
                  className='px-4 pb-3'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <div className='d-flex flex-column flex-sm-row align-items-center justify-content-between'>
                    <motion.button
                      className='btn'
                      style={{
                        ...resendButtonStyle,
                        opacity: isCooldown ? 0.5 : 1,
                        cursor: isCooldown ? 'not-allowed' : 'pointer',
                      }}
                      onClick={handleClick}
                      disabled={isCooldown}
                      whileHover={
                        !isCooldown
                          ? {
                              color: 'var(--primary-blue-dark)',
                              scale: 1.02,
                            }
                          : {}
                      }
                      whileTap={!isCooldown ? { scale: 0.98 } : {}}
                    >
                      <FaRedo className='me-2' size={12} />
                      Resend validation code
                    </motion.button>

                    <AnimatePresence>
                      {isCooldown && (
                        <motion.div
                          className='text-end ms-sm-2 mt-2 mt-sm-0 d-flex align-items-center'
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FaClock className='me-1' size={12} />
                          You can resend in {timer} sec
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Error Display */}
              <AnimatePresence>
                {errors && (
                  <motion.div
                    className='mx-4 mb-3'
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='alert border-0' style={errorStyle}>
                      {renderErrors(errors)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </motion.div>
  );
};

export default VerifyOtp;
