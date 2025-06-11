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

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setErrors(null);
        alert('Password updated successfully!');
        setRedirect(true);
      } else {
        console.log(res);
        setErrors(res.data);
        setIsSending(false);
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setErrors(err.response.data || { error: 'An error occurred' });
      setIsSending(false);
    }
  };

  return (
    <div className='min-vh-100 py-4' style={{ backgroundColor: '#f8fafc' }}>
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
          <div className='col-lg-5 col-md-7'>
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
                    backgroundColor: '#ef4444',
                    color: 'white',
                  }}
                >
                  <FaShieldAlt size={24} />
                </div>
                <h4 className='mb-1 fw-bold text-slate-800'>Update Password</h4>
                <p className='mb-0 text-slate-500 small'>
                  Change your account password securely
                </p>
              </div>

              {/* Error Display */}
              {errors && (
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
                    {renderErrors(errors)}
                  </div>
                </div>
              )}

              {/* Form Body */}
              <div className='card-body px-4 pb-4'>
                <form onSubmit={handleSubmit}>
                  {/* Old Password */}
                  <div className='mb-3'>
                    <label className='form-label fw-medium text-slate-600 mb-2 small'>
                      <FaLock className='me-2 text-slate-400' size={12} />
                      Current Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        className='form-control form-control-sm'
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '0.9rem',
                          paddingRight: '40px',
                          transition: 'border-color 0.2s ease',
                        }}
                        id='oldPassword'
                        name='oldPassword'
                        value={oldPassword}
                        onChange={handleOldPasswordChange}
                        required
                        onFocus={(e) =>
                          (e.target.style.borderColor = '#ef4444')
                        }
                        onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                      />
                      <button
                        type='button'
                        className='btn btn-sm position-absolute'
                        style={{
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'none',
                          color: '#64748b',
                          padding: '0',
                          width: '24px',
                          height: '24px',
                        }}
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <FaEyeSlash size={14} />
                        ) : (
                          <FaEye size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className='mb-3'>
                    <label className='form-label fw-medium text-slate-600 mb-2 small'>
                      <FaLock className='me-2 text-slate-400' size={12} />
                      New Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className='form-control form-control-sm'
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '0.9rem',
                          paddingRight: '40px',
                          transition: 'border-color 0.2s ease',
                        }}
                        id='newPassword'
                        name='newPassword'
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                        onFocus={(e) =>
                          (e.target.style.borderColor = '#10b981')
                        }
                        onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                      />
                      <button
                        type='button'
                        className='btn btn-sm position-absolute'
                        style={{
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'none',
                          color: '#64748b',
                          padding: '0',
                          width: '24px',
                          height: '24px',
                        }}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <FaEyeSlash size={14} />
                        ) : (
                          <FaEye size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className='mb-4'>
                    <label className='form-label fw-medium text-slate-600 mb-2 small'>
                      <FaLock className='me-2 text-slate-400' size={12} />
                      Confirm New Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className='form-control form-control-sm'
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '0.9rem',
                          paddingRight: '40px',
                          transition: 'border-color 0.2s ease',
                        }}
                        id='confirmNewPassword'
                        name='confirmNewPassword'
                        value={confirmNewPassword}
                        onChange={handleConfirmNewPasswordChange}
                        required
                        onFocus={(e) =>
                          (e.target.style.borderColor = '#10b981')
                        }
                        onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                      />
                      <button
                        type='button'
                        className='btn btn-sm position-absolute'
                        style={{
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'none',
                          color: '#64748b',
                          padding: '0',
                          width: '24px',
                          height: '24px',
                        }}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash size={14} />
                        ) : (
                          <FaEye size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div
                    className='mb-4 p-3 rounded'
                    style={{
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bae6fd',
                    }}
                  >
                    <small className='text-info'>
                      <strong>Password Requirements:</strong>
                      <br />
                      • At least 8 characters long
                      <br />
                      • Mix of uppercase and lowercase letters
                      <br />• Include numbers and special characters
                    </small>
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
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          transition: 'all 0.2s ease',
                        }}
                        disabled={isSending}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#dc2626';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#ef4444';
                        }}
                      >
                        <FaShieldAlt className='me-2' size={14} />
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
    </div>
  );
};

export default UpdatePasswordComponent;
