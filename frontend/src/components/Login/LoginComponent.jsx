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
              background: 'rgba(255,255,255,0.93)',
              border: '1.5px solid #e2e8f0',
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
              e.target.style.background = 'rgba(255,255,255,0.93)';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            <FaArrowLeft className='me-2' size={16} />
            Back
          </button>
        </div>

        {/* Main Login Card */}
        <div className='row justify-content-center'>
          <div className='col-12 col-md-7 col-lg-5 col-xl-4'>
            <div
              className='card border-0 shadow-lg'
              style={{
                borderRadius: 22,
                background: 'rgba(255,255,255,0.98)',
                boxShadow:
                  '0 8px 32px rgba(59,130,246,0.10), 0 2px 8px rgba(239,68,68,0.07)',
                backdropFilter: 'blur(12px)',
                overflow: 'hidden',
              }}
            >
              {/* Card Header */}
              <div
                className='card-header border-0 py-4 text-center'
                style={{
                  background: 'linear-gradient(135deg,#3b82f6,#2563eb 80%)',
                  borderBottom: 'none',
                  borderTopLeftRadius: 22,
                  borderTopRightRadius: 22,
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(59,130,246,0.08)',
                }}
              >
                <div
                  className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                  style={{
                    width: 64,
                    height: 64,
                    background: 'rgba(255,255,255,0.14)',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(59,130,246,0.12)',
                  }}
                >
                  <FaUser size={26} />
                </div>
                <h3 className='mb-1 fw-bold'>Welcome Back</h3>
                <div className='mb-0 small' style={{ opacity: 0.94 }}>
                  Sign in to your account
                </div>
              </div>

              {/* Error Display */}
              {(authError || errors) && (
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
                    {renderErrors(authError || errors)}
                  </div>
                </div>
              )}

              {/* Form Body */}
              <div className='card-body px-4 pb-4'>
                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className='mb-3'>
                    <label className='form-label fw-medium mb-2'>
                      <FaUser className='me-2 text-primary' size={13} />
                      Email Address
                    </label>
                    <input
                      type='email'
                      className='form-control'
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #a5b4fc',
                        fontSize: '1.04rem',
                        transition: 'border-color 0.2s',
                        boxShadow: '0 2px 12px rgba(59,130,246,0.02)',
                      }}
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder='Enter your email'
                    />
                  </div>

                  {/* Password Field */}
                  <div className='mb-2'>
                    <label className='form-label fw-medium mb-2'>
                      <FaLock className='me-2 text-primary' size={13} />
                      Password
                    </label>
                    <div className='position-relative'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className='form-control'
                        style={{
                          borderRadius: 10,
                          border: '1.5px solid #a5b4fc',
                          fontSize: '1.04rem',
                          paddingRight: 40,
                          transition: 'border-color 0.2s',
                        }}
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='Enter your password'
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
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <FaEyeSlash size={16} />
                        ) : (
                          <FaEye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className='text-end mt-2'>
                    <Link
                      to='/forgotPassword'
                      className='text-decoration-none fw-medium'
                      style={{
                        color: '#3b82f6',
                        fontSize: '0.95rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseOver={(e) => (e.target.style.color = '#2563eb')}
                      onMouseOut={(e) => (e.target.style.color = '#3b82f6')}
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <div className='mt-4'>
                    <button
                      type='submit'
                      className='btn w-100 py-2 fw-medium'
                      style={{
                        background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: '1.07rem',
                        boxShadow: '0 4px 12px rgba(59,130,246,0.09)',
                        transition: 'all 0.2s',
                      }}
                      disabled={isLoading}
                      onMouseOver={(e) => {
                        if (!isLoading)
                          e.target.style.background =
                            'linear-gradient(90deg, #2563eb, #1e40af)';
                      }}
                      onMouseOut={(e) => {
                        if (!isLoading)
                          e.target.style.background =
                            'linear-gradient(90deg, #3b82f6, #2563eb)';
                      }}
                    >
                      {isLoading ? (
                        <div className='d-flex align-items-center justify-content-center'>
                          <div
                            className='spinner-border spinner-border-sm me-2'
                            role='status'
                            style={{ width: 18, height: 18 }}
                          >
                            <span className='visually-hidden'>Loading...</span>
                          </div>
                          Signing in...
                        </div>
                      ) : (
                        <>
                          <FaSignInAlt className='me-2' size={15} />
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
                  <p
                    className='mb-0'
                    style={{ color: '#64748b', fontSize: '0.97rem' }}
                  >
                    Don&apos;t have an account?{' '}
                    <Link
                      to='/register'
                      className='text-decoration-none fw-semibold'
                      style={{
                        color: '#3b82f6',
                        transition: 'color 0.2s',
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

      {/* Animations */}
      <style>{`
        .glassy-btn:active {
          box-shadow: 0 2px 12px rgba(59,130,246,0.12);
        }
      `}</style>
    </div>
  );
};

export default LoginComponent;
