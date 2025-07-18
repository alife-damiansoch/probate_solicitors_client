import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  FaCheckCircle,
  FaEnvelope,
  FaInfoCircle,
  FaKey,
  FaMobileAlt,
  FaQrcode,
  FaShieldAlt,
  FaTimes,
} from 'react-icons/fa';
import { postData } from '../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import VerificationForm from './VerificationForm';

const QrCodeDisplay = ({
  qrCode,
  manualKey,
  onDone,
  onVerify,
  email,
  step,
  setStep,
}) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [authCode, setAuthCode] = useState(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await postData('token', '/api/user/validate-otp/', {
        email,
        otp,
      });
      if (response.status === 200) {
        setStep('AuthenicatorSetup');
      } else setError(response.data);
    } catch (err) {
      setError(err.response?.data || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    try {
      await onVerify(authCode);
    } catch {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Enhanced theme-aware styles
  const containerStyle = {
    borderRadius: '16px',
    background: 'var(--surface-primary)',
    border: '2px solid var(--success-primary)',
    boxShadow: `
      0 8px 32px var(--success-20),
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 var(--white-10)
    `,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    overflow: 'hidden',
  };

  const headerStyle = {
    background: `
      linear-gradient(135deg, var(--success-primary) 0%, var(--primary-blue) 100%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
    `,
    backgroundBlendMode: 'overlay',
    color: '#ffffff',
    padding: '1rem 1.5rem',
    borderTopLeftRadius: '14px',
    borderTopRightRadius: '14px',
    boxShadow: `
      0 4px 16px var(--success-20),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    position: 'relative',
    overflow: 'hidden',
  };

  const bodyStyle = {
    padding: '1.5rem',
    maxWidth: '500px',
    margin: '0 auto',
  };

  const alertStyle = {
    background: 'var(--primary-10)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--primary-20)',
    borderRadius: '12px',
    padding: '1rem',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  };

  const qrContainerStyle = {
    background: 'var(--surface-secondary)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '2px solid var(--border-muted)',
    boxShadow: `
      0 4px 20px var(--primary-10),
      inset 0 1px 0 var(--white-10)
    `,
  };

  const manualKeyStyle = {
    background: 'var(--surface-tertiary)',
    color: 'var(--text-primary)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-muted)',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    wordBreak: 'break-all',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const cancelButtonStyle = {
    background: 'var(--surface-secondary)',
    border: '2px solid var(--border-muted)',
    borderRadius: '12px',
    color: 'var(--text-muted)',
    fontWeight: '600',
    fontSize: '1rem',
    padding: '12px 24px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  const errorStyle = {
    background: 'var(--error-20)',
    color: 'var(--error-primary)',
    border: '1px solid var(--error-30)',
    borderRadius: '12px',
    fontSize: '0.95rem',
    padding: '12px 16px',
    margin: '1rem 1.5rem 0',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
    >
      {/* Enhanced Header */}
      <div style={headerStyle}>
        {/* Animated background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, var(--success-20), transparent 50%),
              radial-gradient(circle at 80% 80%, var(--primary-15), transparent 50%)
            `,
            animation: 'float 6s ease-in-out infinite',
          }}
        />

        <motion.div
          className='d-flex align-items-center justify-content-center position-relative'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <FaShieldAlt className='me-2' size={20} />
          <h4 className='mb-0 fw-bold' style={{ fontSize: '1.3rem' }}>
            Authenticator App Setup
          </h4>
        </motion.div>
      </div>

      <AnimatePresence mode='wait'>
        {/* Step 1: Email Validation */}
        {step === 'emailValidation' && (
          <motion.div
            key='email-validation'
            style={bodyStyle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className='text-center mb-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div
                className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--primary-20)',
                  color: 'var(--primary-blue)',
                  border: '2px solid var(--primary-30)',
                }}
              >
                <FaEnvelope size={24} />
              </div>
              <h6
                className='fw-bold mb-3'
                style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}
              >
                User Identity Verification
              </h6>
            </motion.div>

            <motion.div
              className='alert text-center mb-4'
              style={alertStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <FaInfoCircle
                className='me-2'
                style={{ color: 'var(--primary-blue)' }}
                size={16}
              />
              <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                To verify your identity, a one-time code has been sent to your
                default email address.
                <br />
                <br />
                Please enter this code to complete the verification process.
                <br />
                <br />
                Once verified, you will have the option to set up an
                authenticator app for added security.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <VerificationForm
                otp={otp}
                setOtp={setOtp}
                isLoading={isLoading}
                handleSubmit={handleEmailVerification}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Authenticator Setup */}
        {step === 'AuthenicatorSetup' && (
          <motion.div
            key='authenticator-setup'
            style={bodyStyle}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className='text-center mb-3'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div
                className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--success-20)',
                  color: 'var(--success-primary)',
                  border: '2px solid var(--success-30)',
                }}
              >
                <FaMobileAlt size={24} />
              </div>
              <h5
                className='fw-bold mb-2'
                style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}
              >
                Set Up Your Authenticator
              </h5>
              <p
                style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}
              >
                Scan the QR code below with your authenticator app:
              </p>
            </motion.div>

            <motion.div
              className='text-center mb-4'
              style={qrContainerStyle}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
              whileHover={{ scale: 1.02 }}
            >
              <div className='mb-3'>
                <FaQrcode
                  className='mb-2'
                  style={{ color: 'var(--primary-blue)' }}
                  size={24}
                />
              </div>
              <img
                src={`data:image/png;base64,${btoa(qrCode)}`}
                alt='QR Code'
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '12px',
                  border: '2px solid var(--border-muted)',
                  background: '#ffffff',
                  padding: '8px',
                }}
              />
            </motion.div>

            {manualKey && (
              <motion.div
                className='text-center mb-4'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <p
                  className='mb-2'
                  style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                >
                  <FaKey
                    className='me-2'
                    style={{ color: 'var(--primary-blue)' }}
                    size={14}
                  />
                  Or manually enter this key:
                </p>
                <div style={manualKeyStyle}>
                  <strong>{manualKey}</strong>
                </div>
              </motion.div>
            )}

            <motion.div
              className='alert text-center mb-4'
              style={alertStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <FaCheckCircle
                className='me-2'
                style={{ color: 'var(--success-primary)' }}
                size={16}
              />
              <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                To ensure your authenticator is properly configured, please
                retrieve the code from your authenticator app and enter it
                below.
                <br />
                <br />
                This step verifies the setup and secures your account.
                <br />
                <br />
                Once verified, you will be redirected to the login page, where
                you can use your authenticator code to log in.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <VerificationForm
                otp={authCode}
                setOtp={setAuthCode}
                isLoading={isVerifying}
                handleSubmit={handleSubmit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Button */}
      <motion.div
        className='text-center py-3'
        style={{ borderTop: '1px solid var(--border-subtle)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.button
          className='btn'
          style={cancelButtonStyle}
          onClick={() => onDone()}
          whileHover={{
            scale: 1.02,
            borderColor: 'var(--error-primary)',
            color: 'var(--error-primary)',
            boxShadow: `
              0 4px 20px var(--error-20),
              0 2px 8px rgba(0, 0, 0, 0.1)
            `,
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <FaTimes className='me-2' size={14} />
          Cancel
        </motion.button>
      </motion.div>

      {/* Enhanced Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            style={errorStyle}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {renderErrors(error)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default QrCodeDisplay;
