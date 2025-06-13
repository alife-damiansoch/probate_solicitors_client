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

  const authError = useSelector((state) => state.auth.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authError when the component is rendered
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

      console.log(response);

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

        {/* Main Login Card */}
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
                    backgroundColor: '#3b82f6',
                    color: 'white',
                  }}
                >
                  <FaUser size={24} />
                </div>
                <h4 className='mb-1 fw-bold text-slate-800'>Welcome Back</h4>
                <p className='mb-0 text-slate-500 small'>
                  Sign in to your account
                </p>
              </div>

              {/* Error Display */}
              {(authError || errors) && (
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
                    {renderErrors(authError || errors)}
                  </div>
                </div>
              )}

              {/* Form Body */}
              <div className='card-body px-4 pb-4'>
                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className='mb-3'>
                    <label className='form-label fw-medium text-slate-600 mb-2 small'>
                      <FaUser className='me-2 text-slate-400' size={12} />
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
                      onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                      onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                      placeholder='Enter your email'
                    />
                  </div>

                  {/* Password Field */}
                  <div className='mb-3'>
                    <label className='form-label fw-medium text-slate-600 mb-2 small'>
                      <FaLock className='me-2 text-slate-400' size={12} />
                      Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className='form-control form-control-sm'
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '0.9rem',
                          paddingRight: '40px',
                          transition: 'border-color 0.2s ease',
                        }}
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        onFocus={(e) =>
                          (e.target.style.borderColor = '#3b82f6')
                        }
                        onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                        placeholder='Enter your password'
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
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash size={14} />
                        ) : (
                          <FaEye size={14} />
                        )}
                      </button>
                    </div>

                    {/* Forgot Password Link */}
                    <div className='text-end mt-2'>
                      <Link
                        to='/forgotPassword'
                        className='text-decoration-none'
                        style={{
                          color: '#3b82f6',
                          fontSize: '0.85rem',
                          transition: 'color 0.2s ease',
                        }}
                        onMouseOver={(e) => (e.target.style.color = '#2563eb')}
                        onMouseOut={(e) => (e.target.style.color = '#3b82f6')}
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className='mt-4'>
                    <button
                      type='submit'
                      className='btn w-100 py-2 fw-medium'
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease',
                      }}
                      disabled={isLoading}
                      onMouseOver={(e) => {
                        if (!isLoading) {
                          e.target.style.backgroundColor = '#2563eb';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isLoading) {
                          e.target.style.backgroundColor = '#3b82f6';
                        }
                      }}
                    >
                      {isLoading ? (
                        <div className='d-flex align-items-center justify-content-center'>
                          <div
                            className='spinner-border spinner-border-sm me-2'
                            role='status'
                            style={{ width: '16px', height: '16px' }}
                          >
                            <span className='visually-hidden'>Loading...</span>
                          </div>
                          Signing in...
                        </div>
                      ) : (
                        <>
                          <FaSignInAlt className='me-2' size={14} />
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Register Link */}
                <div
                  className='text-center mt-4 pt-3'
                  style={{ borderTop: '1px solid #f1f5f9' }}
                >
                  <p className='mb-0 text-slate-500 small'>
                    Don't have an account?{' '}
                    <Link
                      to='/register'
                      className='text-decoration-none fw-medium'
                      style={{
                        color: '#3b82f6',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseOver={(e) => (e.target.style.color = '#2563eb')}
                      onMouseOut={(e) => (e.target.style.color = '#3b82f6')}
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
