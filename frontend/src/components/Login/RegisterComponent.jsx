import axios from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';
import {
  FaArrowLeft,
  FaBuilding,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaMapMarkerAlt,
  FaUserPlus,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../baseUrls';
import LoadingComponent from '../GenericComponents/LoadingComponent';
import RedirectCountdown from '../GenericComponents/RedirectCountdown';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';

const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone_number: '',
    address: {
      line1: '',
      line2: '',
      town_city: '',
      county: '',
      eircode: '',
    },
    team: {
      name: 'solicitors',
    },
  });
  const [errors, setErrors] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const country = Cookies.get('country_solicitors');
  const postcode_placeholders = JSON.parse(
    Cookies.get('postcode_placeholders')
  );
  const phone_nr_placeholder = Cookies.get('phone_nr_placeholder');
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(true);

  const registerUser = async (formData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/user/create/`,
        formData,
        {
          headers: {
            Country: country,
            'Frontend-Host': window.location.origin,
          },
        }
      );

      if (response.status === 201) {
        setShowForm(false);
        return response.data;
      } else {
        console.log(response.data);
        setErrors(response.data);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    setIsRegistering(true);
    setErrors(null);
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: ['Passwords do not match'] });
      setIsRegistering(false);
      return;
    }
    try {
      const response = await registerUser(formData);
      console.log('Registration successful:', response);
    } catch (error) {
      console.error('Registration error:', error.response.data);
      setErrors(error.response.data || { general: ['An error occurred'] });
      window.scrollTo(0, document.body.scrollHeight);
      setIsRegistering(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else if (name.includes('team.')) {
      const teamField = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        team: {
          ...prevData.team,
          [teamField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  if (!showForm) {
    return (
      <div className='min-vh-100 py-4' style={{ backgroundColor: '#f8fafc' }}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-6 col-md-8'>
              <div
                className='card border-0'
                style={{
                  borderRadius: '12px',
                  boxShadow:
                    '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                  backgroundColor: 'white',
                }}
              >
                {/* Success Header */}
                <div
                  className='card-header border-0 py-4 text-center'
                  style={{
                    backgroundColor: '#f0fdf4',
                    borderBottom: '1px solid #dcfce7',
                    borderRadius: '12px 12px 0 0',
                  }}
                >
                  <div
                    className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#10b981',
                      color: 'white',
                    }}
                  >
                    <FaCheckCircle size={32} />
                  </div>
                  <h3 className='mb-1 fw-bold text-green-800'>
                    Registration Successful!
                  </h3>
                  <p className='mb-0 text-green-600'>
                    Your account has been created successfully
                  </p>
                </div>

                {/* Success Body */}
                <div className='card-body p-4'>
                  <div className='text-center mb-4'>
                    <h5 className='fw-bold text-slate-800 mb-3'>
                      What's Next?
                    </h5>
                    <div className='text-start'>
                      <div className='d-flex align-items-start mb-3'>
                        <div
                          className='rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0'
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          1
                        </div>
                        <div>
                          <p className='mb-1 fw-medium text-slate-700'>
                            Check Your Email
                          </p>
                          <small className='text-slate-500'>
                            We've sent an activation link to your email address.
                            Please check your inbox.
                          </small>
                        </div>
                      </div>

                      <div className='d-flex align-items-start mb-3'>
                        <div
                          className='rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0'
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          2
                        </div>
                        <div>
                          <p className='mb-1 fw-medium text-slate-700'>
                            Click the Activation Link
                          </p>
                          <small className='text-slate-500'>
                            Click the link in the email to activate your
                            account.
                          </small>
                        </div>
                      </div>

                      <div className='d-flex align-items-start mb-3'>
                        <div
                          className='rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0'
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          3
                        </div>
                        <div>
                          <p className='mb-1 fw-medium text-slate-700'>
                            Start Using Your Account
                          </p>
                          <small className='text-slate-500'>
                            Once activated, you can sign in and start managing
                            your applications.
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Important Notice */}
                  <div
                    className='p-3 rounded mb-4'
                    style={{
                      backgroundColor: '#fef3c7',
                      border: '1px solid #fbbf24',
                    }}
                  >
                    <div className='d-flex align-items-center mb-2'>
                      <FaCheckCircle
                        className='me-2 text-amber-600'
                        size={16}
                      />
                      <strong className='text-amber-800'>
                        Important Notice
                      </strong>
                    </div>
                    <ul className='mb-0 text-amber-800 small'>
                      <li>
                        Check your spam/junk folder if you don't see the email
                      </li>
                      <li>The activation link expires in 24 hours</li>
                      <li>Mark our emails as safe to ensure future delivery</li>
                    </ul>
                  </div>

                  <RedirectCountdown
                    message='Redirecting to login in'
                    redirectPath='/login'
                    countdownTime={30}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Main Registration Card */}
        <div className='row justify-content-center'>
          <div className='col-lg-8 col-xl-7'>
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
                className='card-header border-0 py-4'
                style={{
                  backgroundColor: 'white',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div className='text-center'>
                  <div
                    className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#10b981',
                      color: 'white',
                    }}
                  >
                    <FaUserPlus size={24} />
                  </div>
                  <h4 className='mb-1 fw-bold text-slate-800'>
                    Create Your Account
                  </h4>
                  <p className='mb-0 text-slate-500 small'>
                    Register your law firm to get started
                  </p>
                </div>
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
                  <div className='row'>
                    {/* Left Column - Account & Firm Info */}
                    <div className='col-md-6'>
                      <h6 className='fw-bold text-slate-700 mb-3 d-flex align-items-center'>
                        <FaBuilding className='me-2 text-slate-400' size={14} />
                        Account & Firm Information
                      </h6>

                      {/* Email */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium text-slate-600 mb-1 small'>
                          Firm Email Address *
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
                          name='email'
                          value={formData.email}
                          onChange={handleChange}
                          required
                          onFocus={(e) =>
                            (e.target.style.borderColor = '#10b981')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = '#d1d5db')
                          }
                        />
                        <small className='text-info'>
                          This will be used for authentication and login
                          purposes
                        </small>
                      </div>

                      {/* Firm Name */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium text-slate-600 mb-1 small'>
                          Law Firm Name *
                        </label>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          style={{
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontSize: '0.9rem',
                            transition: 'border-color 0.2s ease',
                          }}
                          name='name'
                          value={formData.name}
                          onChange={handleChange}
                          required
                          onFocus={(e) =>
                            (e.target.style.borderColor = '#10b981')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = '#d1d5db')
                          }
                        />
                      </div>

                      {/* Password */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium text-slate-600 mb-2 small'>
                          Password *
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
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                            onFocus={(e) =>
                              (e.target.style.borderColor = '#10b981')
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = '#d1d5db')
                            }
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
                      </div>

                      {/* Confirm Password */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium text-slate-600 mb-2 small'>
                          Confirm Password *
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
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            onFocus={(e) =>
                              (e.target.style.borderColor = '#10b981')
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = '#d1d5db')
                            }
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

                      {/* Phone */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium text-slate-600 mb-1 small'>
                          Phone Number *
                        </label>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          style={{
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontSize: '0.9rem',
                            transition: 'border-color 0.2s ease',
                          }}
                          name='phone_number'
                          value={formData.phone_number}
                          onChange={handleChange}
                          required
                          onFocus={(e) =>
                            (e.target.style.borderColor = '#10b981')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = '#d1d5db')
                          }
                        />
                        <small className='text-info'>
                          Format: <strong>{phone_nr_placeholder}</strong>
                        </small>
                      </div>
                    </div>

                    {/* Right Column - Address */}
                    <div className='col-md-6'>
                      <h6 className='fw-bold text-slate-700 mb-3 d-flex align-items-center'>
                        <FaMapMarkerAlt
                          className='me-2 text-slate-400'
                          size={14}
                        />
                        Firm Address
                      </h6>

                      {/* Address Line 1 */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium text-slate-600 mb-1 small'>
                          Address Line 1 *
                        </label>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          style={{
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontSize: '0.9rem',
                            transition: 'border-color 0.2s ease',
                          }}
                          name='address.line1'
                          value={formData.address.line1}
                          onChange={handleChange}
                          required
                          onFocus={(e) =>
                            (e.target.style.borderColor = '#3b82f6')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = '#d1d5db')
                          }
                        />
                      </div>

                      {/* Address Line 2 */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium text-slate-600 mb-1 small'>
                          Address Line 2
                        </label>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          style={{
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontSize: '0.9rem',
                            transition: 'border-color 0.2s ease',
                          }}
                          name='address.line2'
                          value={formData.address.line2}
                          onChange={handleChange}
                          onFocus={(e) =>
                            (e.target.style.borderColor = '#3b82f6')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = '#d1d5db')
                          }
                        />
                      </div>

                      {/* Town and County Row */}
                      <div className='row'>
                        <div className='col-7 mb-3'>
                          <label className='form-label fw-medium text-slate-600 mb-1 small'>
                            Town/City *
                          </label>
                          <input
                            type='text'
                            className='form-control form-control-sm'
                            style={{
                              borderRadius: '6px',
                              border: '1px solid #d1d5db',
                              fontSize: '0.9rem',
                              transition: 'border-color 0.2s ease',
                            }}
                            name='address.town_city'
                            value={formData.address.town_city}
                            onChange={handleChange}
                            required
                            onFocus={(e) =>
                              (e.target.style.borderColor = '#3b82f6')
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = '#d1d5db')
                            }
                          />
                        </div>
                        <div className='col-5 mb-3'>
                          <label className='form-label fw-medium text-slate-600 mb-1 small'>
                            County *
                          </label>
                          <input
                            type='text'
                            className='form-control form-control-sm'
                            style={{
                              borderRadius: '6px',
                              border: '1px solid #d1d5db',
                              fontSize: '0.9rem',
                              transition: 'border-color 0.2s ease',
                            }}
                            name='address.county'
                            value={formData.address.county}
                            onChange={handleChange}
                            required
                            onFocus={(e) =>
                              (e.target.style.borderColor = '#3b82f6')
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = '#d1d5db')
                            }
                          />
                        </div>
                      </div>

                      {/* Postcode */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium text-slate-600 mb-1 small'>
                          {postcode_placeholders[0]} *
                        </label>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          style={{
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontSize: '0.9rem',
                            transition: 'border-color 0.2s ease',
                          }}
                          name='address.eircode'
                          value={formData.address.eircode}
                          onChange={handleChange}
                          required
                          onFocus={(e) =>
                            (e.target.style.borderColor = '#3b82f6')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = '#d1d5db')
                          }
                        />
                        <small className='text-muted'>
                          Format: {postcode_placeholders[1]} (e.g.,{' '}
                          {postcode_placeholders[2]})
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div
                    className='text-center mt-4 pt-3'
                    style={{ borderTop: '1px solid #f1f5f9' }}
                  >
                    {isRegistering ? (
                      <LoadingComponent message='Creating your account...' />
                    ) : (
                      <button
                        type='submit'
                        className='btn px-5 py-2 fw-medium w-100'
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          transition: 'all 0.2s ease',
                          maxWidth: '300px',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#059669';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#10b981';
                        }}
                      >
                        <FaUserPlus className='me-2' size={14} />
                        Create Account
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
