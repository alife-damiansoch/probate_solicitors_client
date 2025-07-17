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
    <div
      className='min-vh-100 py-4'
      style={{
        background: 'linear-gradient(120deg, #f0f3fa 0%, #e0e7ef 100%)',
        minHeight: '100vh',
      }}
    >
      <div className='container'>
        {/* Header Section */}
        <div className='d-flex align-items-center mb-4 gap-2'>
          <button
            className='btn d-flex align-items-center px-3 py-2 glassy-btn'
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              color: '#64748b',
              fontWeight: 500,
              fontSize: '1rem',
              boxShadow: '0 2px 10px rgba(59,130,246,0.07)',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)',
            }}
            onClick={() => navigate(-1)}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(240,240,255,0.98)';
              e.target.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.92)';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            <FaArrowLeft className='me-2' size={16} />
            Back
          </button>
        </div>

        {/* Main Card */}
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-lg-6 col-xl-5'>
            <div
              className='card border-0 shadow-lg'
              style={{
                borderRadius: 22,
                background: 'rgba(255,255,255,0.98)',
                boxShadow:
                  '0 8px 32px rgba(59,130,246,0.10), 0 2px 8px rgba(239,68,68,0.09)',
                backdropFilter: 'blur(14px)',
                overflow: 'hidden',
              }}
            >
              {/* Card Header */}
              <div
                className='card-header border-0 py-4 text-center'
                style={{
                  background: 'linear-gradient(135deg,#ef4444,#fdba74)',
                  borderBottom: 'none',
                  borderTopLeftRadius: 22,
                  borderTopRightRadius: 22,
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(239,68,68,0.10)',
                }}
              >
                <div
                  className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                  style={{
                    width: 64,
                    height: 64,
                    background: 'rgba(255,255,255,0.20)',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(239,68,68,0.10)',
                  }}
                >
                  <FaShieldAlt size={26} />
                </div>
                <h3 className='mb-1 fw-bold'>Update Password</h3>
                <div className='mb-0 small' style={{ opacity: 0.94 }}>
                  Change your account password securely
                </div>
              </div>

              {/* Error Display */}
              {errors && (
                <div className='mx-4 mt-3'>
                  <div
                    className='alert border-0'
                    style={{
                      background: 'rgba(239,68,68,0.07)',
                      color: '#dc2626',
                      borderRadius: 12,
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
                      <FaLock className='me-2 text-danger' size={13} />
                      Current Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        className='form-control'
                        style={{
                          borderRadius: 10,
                          border: '1.5px solid #fda4af',
                          fontSize: '1.02rem',
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
                          color: '#64748b',
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
                      <FaLock className='me-2 text-success' size={13} />
                      New Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className='form-control'
                        style={{
                          borderRadius: 10,
                          border: '1.5px solid #a7f3d0',
                          fontSize: '1.02rem',
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
                          color: '#64748b',
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
                      <FaLock className='me-2 text-success' size={13} />
                      Confirm New Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className='form-control'
                        style={{
                          borderRadius: 10,
                          border: '1.5px solid #a7f3d0',
                          fontSize: '1.02rem',
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
                          color: '#64748b',
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
                      background: 'rgba(59,130,246,0.07)',
                      border: '1px solid #bae6fd',
                      fontSize: '0.96rem',
                    }}
                  >
                    <strong>Password Requirements:</strong>
                    <ul className='mb-0 ps-3'>
                      <li>At least 8 characters</li>
                      <li>Upper & lower case letters</li>
                      <li>Include numbers and special characters</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className='text-center'>
                    {isSending ? (
                      <LoadingComponent message='Updating password...' />
                    ) : (
                      <button
                        type='submit'
                        className='btn px-4 py-2 fw-medium w-100'
                        style={{
                          background:
                            'linear-gradient(90deg, #ef4444, #fdba74)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '1.07rem',
                          boxShadow: '0 4px 14px rgba(239,68,68,0.12)',
                          transition: 'all 0.2s',
                        }}
                        disabled={isSending}
                        onMouseOver={(e) => {
                          e.target.style.background =
                            'linear-gradient(90deg, #dc2626, #b91c1c)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background =
                            'linear-gradient(90deg, #ef4444, #fdba74)';
                        }}
                      >
                        <FaShieldAlt className='me-2' size={15} />
                        Update Password
                      </button>
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
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .glassy-btn:active {
          box-shadow: 0 2px 12px rgba(239,68,68,0.14);
        }
      `}</style>
    </div>
  );
};

export default UpdatePasswordComponent;
