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
        setErrors(response.data);
      }
    } catch (error) {
      setErrors(error.response?.data || { general: ['An error occurred'] });
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
      await registerUser(formData);
    } catch (error) {
      setErrors(error.response?.data || { general: ['An error occurred'] });
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
      <div
        className='min-vh-100 py-4'
        style={{
          background: 'linear-gradient(120deg, #f0f3fa 0%, #e0e7ef 100%)',
        }}
      >
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-md-9 col-lg-7 col-xl-6'>
              <div
                className='card border-0 shadow-lg'
                style={{
                  borderRadius: 22,
                  background: 'rgba(255,255,255,0.97)',
                  boxShadow:
                    '0 8px 32px rgba(16,185,129,0.10), 0 2px 8px rgba(239,68,68,0.07)',
                  backdropFilter: 'blur(12px)',
                  overflow: 'hidden',
                }}
              >
                {/* Success Header */}
                <div
                  className='card-header border-0 py-4 text-center'
                  style={{
                    background:
                      'linear-gradient(135deg,#10b981 55%,#3b82f6 100%)',
                    borderBottom: 'none',
                    borderTopLeftRadius: 22,
                    borderTopRightRadius: 22,
                    color: '#fff',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.08)',
                  }}
                >
                  <div
                    className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                    style={{
                      width: 72,
                      height: 72,
                      background: 'rgba(255,255,255,0.14)',
                      color: '#fff',
                      boxShadow: '0 4px 16px rgba(16,185,129,0.10)',
                    }}
                  >
                    <FaCheckCircle size={32} />
                  </div>
                  <h3 className='mb-1 fw-bold'>Registration Successful!</h3>
                  <div className='mb-0 small' style={{ opacity: 0.94 }}>
                    Your account has been created successfully
                  </div>
                </div>

                {/* Success Body */}
                <div className='card-body p-4'>
                  <div className='text-center mb-4'>
                    <h5 className='fw-bold mb-3' style={{ color: '#0f172a' }}>
                      What's Next?
                    </h5>
                    <div className='text-start'>
                      {[1, 2, 3].map((step) => (
                        <div
                          className='d-flex align-items-start mb-3'
                          key={step}
                        >
                          <div
                            className='rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0'
                            style={{
                              width: 32,
                              height: 32,
                              background: '#3b82f6',
                              color: 'white',
                              fontSize: 15,
                              fontWeight: 700,
                            }}
                          >
                            {step}
                          </div>
                          <div>
                            {step === 1 && (
                              <>
                                <div
                                  className='mb-1 fw-medium'
                                  style={{ color: '#1e293b' }}
                                >
                                  Check Your Email
                                </div>
                                <small className='text-muted'>
                                  We've sent an activation link to your email
                                  address.
                                </small>
                              </>
                            )}
                            {step === 2 && (
                              <>
                                <div
                                  className='mb-1 fw-medium'
                                  style={{ color: '#1e293b' }}
                                >
                                  Click the Activation Link
                                </div>
                                <small className='text-muted'>
                                  Click the link in the email to activate your
                                  account.
                                </small>
                              </>
                            )}
                            {step === 3 && (
                              <>
                                <div
                                  className='mb-1 fw-medium'
                                  style={{ color: '#1e293b' }}
                                >
                                  Start Using Your Account
                                </div>
                                <small className='text-muted'>
                                  Once activated, you can sign in and start
                                  managing your applications.
                                </small>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important Notice */}
                  <div
                    className='p-3 rounded mb-4'
                    style={{
                      background: 'rgba(253,224,71,0.10)',
                      border: '1.5px solid #fde047',
                    }}
                  >
                    <div className='d-flex align-items-center mb-2'>
                      <FaCheckCircle
                        className='me-2'
                        style={{ color: '#f59e42' }}
                        size={16}
                      />
                      <strong style={{ color: '#d97706' }}>
                        Important Notice
                      </strong>
                    </div>
                    <ul
                      className='mb-0'
                      style={{ color: '#d97706', fontSize: '0.97rem' }}
                    >
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
    <div
      className='min-vh-100 py-4'
      style={{
        background: 'linear-gradient(120deg, #f0f3fa 0%, #e0e7ef 100%)',
      }}
    >
      <div className='container'>
        {/* Header Section */}
        <div className='d-flex align-items-center mb-4'>
          <button
            className='btn d-flex align-items-center px-3 py-2 glassy-btn'
            style={{
              background: 'rgba(255,255,255,0.93)',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              color: '#64748b',
              fontWeight: 500,
              fontSize: '1rem',
              boxShadow: '0 2px 10px rgba(16,185,129,0.07)',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)',
            }}
            onClick={() => navigate(-1)}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(240,255,249,0.98)';
              e.target.style.borderColor = '#a7f3d0';
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
        {/* Main Registration Card */}
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-9 col-xl-7'>
            <div
              className='card border-0 shadow-lg'
              style={{
                borderRadius: 22,
                background: 'rgba(255,255,255,0.97)',
                boxShadow:
                  '0 8px 32px rgba(16,185,129,0.10), 0 2px 8px rgba(59,130,246,0.07)',
                backdropFilter: 'blur(12px)',
                overflow: 'hidden',
              }}
            >
              {/* Card Header */}
              <div
                className='card-header border-0 py-4 text-center'
                style={{
                  background:
                    'linear-gradient(135deg,#10b981 60%,#3b82f6 100%)',
                  borderBottom: 'none',
                  borderTopLeftRadius: 22,
                  borderTopRightRadius: 22,
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(16,185,129,0.08)',
                }}
              >
                <div
                  className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                  style={{
                    width: 60,
                    height: 60,
                    background: 'rgba(255,255,255,0.13)',
                    color: '#fff',
                  }}
                >
                  <FaUserPlus size={26} />
                </div>
                <h3 className='mb-1 fw-bold'>Create Your Account</h3>
                <div className='mb-0 small' style={{ opacity: 0.94 }}>
                  Register your law firm to get started
                </div>
              </div>

              {/* Error Display */}
              {errors && (
                <div className='mx-4 mt-3'>
                  <div
                    className='alert border-0'
                    style={{
                      background: 'rgba(239,68,68,0.09)',
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
                  <div className='row'>
                    {/* Left Column */}
                    <div className='col-md-6 mb-4 mb-md-0'>
                      <h6
                        className='fw-bold mb-3 d-flex align-items-center'
                        style={{ color: '#134e4a' }}
                      >
                        <FaBuilding className='me-2 text-success' size={16} />
                        Account & Firm Information
                      </h6>
                      {/* Email */}
                      <div className='mb-3'>
                        <label
                          className='form-label fw-medium mb-1 small'
                          style={{ color: '#0f172a' }}
                        >
                          Firm Email Address *
                        </label>
                        <input
                          type='email'
                          className='form-control'
                          style={{
                            borderRadius: 10,
                            border: '1.5px solid #a7f3d0',
                            fontSize: '1.03rem',
                            transition: 'border-color 0.2s',
                          }}
                          name='email'
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <small className='text-info'>
                          This will be used for authentication and login
                          purposes
                        </small>
                      </div>
                      {/* Firm Name */}
                      <div className='mb-3'>
                        <label
                          className='form-label fw-medium mb-1 small'
                          style={{ color: '#0f172a' }}
                        >
                          Law Firm Name *
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 10,
                            border: '1.5px solid #a7f3d0',
                            fontSize: '1.03rem',
                            transition: 'border-color 0.2s',
                          }}
                          name='name'
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {/* Password */}
                      <div className='mb-3'>
                        <label
                          className='form-label fw-medium mb-2 small'
                          style={{ color: '#0f172a' }}
                        >
                          Password *
                        </label>
                        <div className='position-relative'>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className='form-control'
                            style={{
                              borderRadius: 10,
                              border: '1.5px solid #a7f3d0',
                              fontSize: '1.03rem',
                              paddingRight: 40,
                              transition: 'border-color 0.2s',
                            }}
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
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
                      {/* Confirm Password */}
                      <div className='mb-3'>
                        <label
                          className='form-label fw-medium mb-2 small'
                          style={{ color: '#0f172a' }}
                        >
                          Confirm Password *
                        </label>
                        <div className='position-relative'>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className='form-control'
                            style={{
                              borderRadius: 10,
                              border: '1.5px solid #a7f3d0',
                              fontSize: '1.03rem',
                              paddingRight: 40,
                              transition: 'border-color 0.2s',
                            }}
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                              <FaEyeSlash size={16} />
                            ) : (
                              <FaEye size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      {/* Phone */}
                      <div className='mb-3'>
                        <label
                          className='form-label fw-medium mb-1 small'
                          style={{ color: '#0f172a' }}
                        >
                          Phone Number *
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 10,
                            border: '1.5px solid #a7f3d0',
                            fontSize: '1.03rem',
                            transition: 'border-color 0.2s',
                          }}
                          name='phone_number'
                          value={formData.phone_number}
                          onChange={handleChange}
                          required
                        />
                        <small className='text-info'>
                          Format: <strong>{phone_nr_placeholder}</strong>
                        </small>
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className='col-md-6'>
                      <h6
                        className='fw-bold mb-3 d-flex align-items-center'
                        style={{ color: '#134e4a' }}
                      >
                        <FaMapMarkerAlt
                          className='me-2 text-success'
                          size={16}
                        />
                        Firm Address
                      </h6>
                      {/* Address Line 1 */}
                      <div className='mb-3'>
                        <label
                          className='form-label fw-medium mb-1 small'
                          style={{ color: '#0f172a' }}
                        >
                          Address Line 1 *
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 10,
                            border: '1.5px solid #3b82f6',
                            fontSize: '1.03rem',
                            transition: 'border-color 0.2s',
                          }}
                          name='address.line1'
                          value={formData.address.line1}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {/* Address Line 2 */}
                      <div className='mb-3'>
                        <label
                          className='form-label fw-medium mb-1 small'
                          style={{ color: '#0f172a' }}
                        >
                          Address Line 2
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 10,
                            border: '1.5px solid #3b82f6',
                            fontSize: '1.03rem',
                            transition: 'border-color 0.2s',
                          }}
                          name='address.line2'
                          value={formData.address.line2}
                          onChange={handleChange}
                        />
                      </div>
                      {/* Town and County Row */}
                      <div className='row'>
                        <div className='col-7 mb-3'>
                          <label
                            className='form-label fw-medium mb-1 small'
                            style={{ color: '#0f172a' }}
                          >
                            Town/City *
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            style={{
                              borderRadius: 10,
                              border: '1.5px solid #3b82f6',
                              fontSize: '1.03rem',
                              transition: 'border-color 0.2s',
                            }}
                            name='address.town_city'
                            value={formData.address.town_city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className='col-5 mb-3'>
                          <label
                            className='form-label fw-medium mb-1 small'
                            style={{ color: '#0f172a' }}
                          >
                            County *
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            style={{
                              borderRadius: 10,
                              border: '1.5px solid #3b82f6',
                              fontSize: '1.03rem',
                              transition: 'border-color 0.2s',
                            }}
                            name='address.county'
                            value={formData.address.county}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      {/* Postcode */}
                      <div className='mb-3'>
                        <label
                          className='form-label fw-medium mb-1 small'
                          style={{ color: '#0f172a' }}
                        >
                          {postcode_placeholders[0]} *
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 10,
                            border: '1.5px solid #3b82f6',
                            fontSize: '1.03rem',
                            transition: 'border-color 0.2s',
                          }}
                          name='address.eircode'
                          value={formData.address.eircode}
                          onChange={handleChange}
                          required
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
                    style={{ borderTop: '1px solid #e5e7eb' }}
                  >
                    {isRegistering ? (
                      <LoadingComponent message='Creating your account...' />
                    ) : (
                      <button
                        type='submit'
                        className='btn px-5 py-2 fw-medium w-100'
                        style={{
                          background:
                            'linear-gradient(90deg, #10b981, #3b82f6 90%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 10,
                          fontSize: '1.05rem',
                          transition: 'all 0.2s',
                          maxWidth: 340,
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background =
                            'linear-gradient(90deg, #059669, #2563eb 90%)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background =
                            'linear-gradient(90deg, #10b981, #3b82f6 90%)';
                        }}
                      >
                        <FaUserPlus className='me-2' size={16} />
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
      <style>{`
        .glassy-btn:active {
          box-shadow: 0 2px 12px rgba(16,185,129,0.13);
        }
      `}</style>
    </div>
  );
};

export default RegisterComponent;
