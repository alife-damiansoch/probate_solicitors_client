import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../GenericComponents/LoadingComponent';
import RedirectCountdown from '../GenericComponents/RedirectCountdown';
import { patchData } from '../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';

const UpdatePasswordComponent = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = useSelector((state) => state.auth.token.access);
  const navigate = useNavigate();

  const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmNewPasswordChange = (e) =>
    setConfirmNewPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setErrors({ password: 'New passwords do not match' });
      return;
    }
    try {
      setIsSending(true);
      const res = await patchData(
        `/api/user/update_password/`,
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setErrors(null);
        alert('Password updated successfully!');
        setRedirect(true);
      } else {
        setErrors(res.data);
        setIsSending(false);
      }
    } catch (err) {
      setErrors(err.response?.data || { error: 'An error occurred' });
      setIsSending(false);
    }
  };

  return (
    <motion.div
      className='min-vh-100 pb-4'
      style={{
        background: 'var(--gradient-main-bg)',
        minHeight: '100vh',
        paddingTop: '120px',
        position: 'relative',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Glassy animated background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 25% 18%, var(--error-20) 0%, transparent 60%),
            radial-gradient(circle at 85% 86%, var(--primary-10) 0%, transparent 52%),
            radial-gradient(circle at 65% 7%, var(--primary-30) 0%, transparent 35%)
          `,
          opacity: 0.7,
          animation: 'backgroundFloat 23s linear infinite',
        }}
      />

      <div className='container position-relative' style={{ zIndex: 2 }}>
        {/* Header Section */}
        <motion.div
          className='d-flex align-items-center mb-4 gap-2'
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.7 }}
        >
          <motion.button
            className='btn d-flex align-items-center px-3 py-2'
            style={{
              background: 'var(--surface-secondary)',
              border: '1.5px solid var(--border-muted)',
              borderRadius: '13px',
              color: 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '1rem',
              boxShadow: '0 2px 10px var(--error-20)',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{
              background: 'var(--surface-primary)',
              color: 'var(--error-primary)',
            }}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className='me-2' size={16} />
            Back
          </motion.button>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className='row justify-content-center'
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div className='col-12 col-md-8 col-lg-6 col-xl-5'>
            <motion.div
              className='card border-0'
              style={{
                borderRadius: 26,
                background: 'var(--surface-primary)',
                boxShadow: `
                  0 12px 32px var(--error-20),
                  0 4px 12px var(--primary-20),
                  inset 0 1px 0 var(--white-10)
                `,
                backdropFilter: 'blur(18px)',
                overflow: 'hidden',
              }}
              initial={{ scale: 0.98, opacity: 0.82 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{
                scale: 1.01,
                boxShadow: `
                  0 22px 48px var(--error-30),
                  0 10px 22px var(--primary-30),
                  0 7px 18px var(--success-20),
                  inset 0 1px 0 var(--white-15)
                `,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            >
              {/* Card Header */}
              <motion.div
                className='card-header border-0 py-4 text-center'
                style={{
                  background: 'var(--gradient-header), var(--error-20)',
                  borderBottom: 'none',
                  borderTopLeftRadius: 26,
                  borderTopRightRadius: 26,
                  color: 'var(--text-primary)',
                  boxShadow: '0 8px 22px var(--error-20)',
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.7 }}
              >
                <motion.div
                  className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                  style={{
                    width: 64,
                    height: 64,
                    background: 'var(--error-20)',
                    color: 'var(--error-primary)',
                    boxShadow: '0 4px 16px var(--error-20)',
                  }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.28, duration: 0.6 }}
                >
                  <FaShieldAlt size={26} />
                </motion.div>
                <motion.h3
                  className='mb-1 fw-bold'
                  style={{
                    background:
                      'linear-gradient(135deg, var(--error-primary), var(--warning-primary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Update Password
                </motion.h3>
                <motion.div
                  className='mb-0 small'
                  style={{ opacity: 0.94, color: 'var(--text-tertiary)' }}
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Change your account password securely
                </motion.div>
              </motion.div>

              {/* Error Display */}
              {errors && (
                <div className='mx-4 mt-3'>
                  <div
                    className='alert border-0'
                    style={{
                      background: 'var(--error-20)',
                      color: 'var(--error-primary)',
                      borderRadius: 13,
                      fontSize: '1rem',
                    }}
                  >
                    {renderErrors(errors)}
                  </div>
                </div>
              )}

              {/* Form Body */}
              <div className='card-body px-4 pb-4'>
                <form onSubmit={handleSubmit}>
                  {/* Old Password */}
                  <div className='mb-3'>
                    <label className='form-label fw-medium mb-2'>
                      <FaLock className='me-2 status-error' size={13} />
                      Current Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        className='form-control'
                        style={{
                          borderRadius: 11,
                          border: '1.5px solid var(--error-20)',
                          fontSize: '1.03rem',
                          background: 'var(--surface-secondary)',
                          color: 'var(--text-primary)',
                          paddingRight: 40,
                        }}
                        id='oldPassword'
                        name='oldPassword'
                        value={oldPassword}
                        onChange={handleOldPasswordChange}
                        required
                      />
                      <button
                        type='button'
                        className='btn btn-sm position-absolute'
                        style={{
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'none',
                          color: 'var(--text-muted)',
                          padding: 0,
                          width: 28,
                          height: 28,
                        }}
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        tabIndex={-1}
                      >
                        {showOldPassword ? (
                          <FaEyeSlash size={15} />
                        ) : (
                          <FaEye size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className='mb-3'>
                    <label className='form-label fw-medium mb-2'>
                      <FaLock className='me-2 status-success' size={13} />
                      New Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className='form-control'
                        style={{
                          borderRadius: 11,
                          border: '1.5px solid var(--success-20)',
                          fontSize: '1.03rem',
                          background: 'var(--surface-secondary)',
                          color: 'var(--text-primary)',
                          paddingRight: 40,
                        }}
                        id='newPassword'
                        name='newPassword'
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                      />
                      <button
                        type='button'
                        className='btn btn-sm position-absolute'
                        style={{
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'none',
                          color: 'var(--text-muted)',
                          padding: 0,
                          width: 28,
                          height: 28,
                        }}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
                          <FaEyeSlash size={15} />
                        ) : (
                          <FaEye size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className='mb-4'>
                    <label className='form-label fw-medium mb-2'>
                      <FaLock className='me-2 status-success' size={13} />
                      Confirm New Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className='form-control'
                        style={{
                          borderRadius: 11,
                          border: '1.5px solid var(--success-20)',
                          fontSize: '1.03rem',
                          background: 'var(--surface-secondary)',
                          color: 'var(--text-primary)',
                          paddingRight: 40,
                        }}
                        id='confirmNewPassword'
                        name='confirmNewPassword'
                        value={confirmNewPassword}
                        onChange={handleConfirmNewPasswordChange}
                        required
                      />
                      <button
                        type='button'
                        className='btn btn-sm position-absolute'
                        style={{
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'none',
                          color: 'var(--text-muted)',
                          padding: 0,
                          width: 28,
                          height: 28,
                        }}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash size={15} />
                        ) : (
                          <FaEye size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div
                    className='mb-4 p-3 rounded'
                    style={{
                      background: 'var(--primary-10)',
                      border: '1.5px solid var(--primary-20)',
                      fontSize: '0.96rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <strong>Password Requirements:</strong>
                    <ul className='mb-0 ps-3'>
                      <li>At least 8 characters</li>
                      <li>Upper &amp; lower case letters</li>
                      <li>Include numbers and special characters</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className='text-center'>
                    {isSending ? (
                      <LoadingComponent message='Updating password...' />
                    ) : (
                      <motion.button
                        type='submit'
                        className='btn px-4 py-2 fw-medium w-100'
                        style={{
                          background: 'var(--error-primary)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '1.09rem',
                          boxShadow: '0 4px 14px var(--error-20)',
                          transition: 'all 0.19s',
                        }}
                        whileHover={{
                          background: 'var(--error-dark)',
                        }}
                        disabled={isSending}
                      >
                        <FaShieldAlt className='me-2' size={15} />
                        Update Password
                      </motion.button>
                    )}
                  </div>
                </form>

                {/* Redirect Countdown */}
                {redirect && (
                  <div className='mt-4'>
                    <RedirectCountdown
                      message='Redirecting to login'
                      redirectPath='/login'
                      countdownTime={3}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes backgroundFloat {
          0%,100%{transform:translateY(0) rotate(0deg);opacity:.67;}
          33%{transform:translateY(-13px) rotate(88deg);opacity:.82;}
          66%{transform:translateY(8px) rotate(180deg);opacity:.75;}
        }
      `}</style>
    </motion.div>
  );
};

export default UpdatePasswordComponent;
