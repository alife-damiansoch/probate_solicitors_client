import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useState } from 'react';
import {
  FaArrowLeft,
  FaBuilding,
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
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
  const [focusedField, setFocusedField] = useState(null);

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

  // Enhanced theme-aware styles
  const containerStyle = {
    minHeight: 'calc(100vh - 90px)',
    paddingTop: '150px',
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
      linear-gradient(135deg, var(--success-primary) 0%, var(--primary-blue) 80%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
    `,
    backgroundBlendMode: 'overlay',
    borderBottom: 'none',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    color: '#ffffff',
    boxShadow: `
      0 8px 32px var(--success-20),
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
      linear-gradient(135deg, var(--success-primary) 0%, var(--primary-blue) 100%),
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
      0 8px 32px var(--success-30),
      0 4px 16px var(--success-20),
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

  const sectionHeaderStyle = {
    color: 'var(--text-primary)',
    fontSize: '1.1rem',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid var(--border-subtle)',
  };

  if (!showForm) {
    return (
      <motion.div
        className=' py-4'
        style={containerStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-md-9 col-lg-7 col-xl-6'>
              <motion.div
                className='card border-0'
                style={{
                  ...cardStyle,
                  background: 'var(--gradient-surface)',
                }}
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
              >
                {/* Success Header */}
                <div
                  className='card-header border-0 py-4 text-center position-relative'
                  style={{
                    ...headerStyle,
                    background: `
                      linear-gradient(135deg, var(--success-primary) 0%, var(--primary-blue) 100%),
                      linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
                    `,
                  }}
                >
                  <motion.div
                    className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                    style={iconContainerStyle}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                  >
                    <FaCheckCircle size={26} />
                  </motion.div>
                  <h3 className='mb-1 fw-bold'>Registration Successful!</h3>
                  <div
                    className='mb-0'
                    style={{ opacity: 0.94, fontSize: '0.95rem' }}
                  >
                    Your account has been created successfully
                  </div>
                </div>

                {/* Success Body */}
                <div className='card-body p-4'>
                  <div className='text-center mb-4'>
                    <h5
                      className='fw-bold mb-3'
                      style={{ color: 'var(--text-primary)' }}
                    >
                      What's Next?
                    </h5>
                    <div className='text-start'>
                      {[1, 2, 3].map((step) => (
                        <motion.div
                          className='d-flex align-items-start mb-3'
                          key={step}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.5 + step * 0.1,
                            duration: 0.5,
                          }}
                        >
                          <div
                            className='rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0'
                            style={{
                              width: 32,
                              height: 32,
                              background: 'var(--primary-blue)',
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
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  Check Your Email
                                </div>
                                <small style={{ color: 'var(--text-muted)' }}>
                                  We've sent an activation link to your email
                                  address.
                                </small>
                              </>
                            )}
                            {step === 2 && (
                              <>
                                <div
                                  className='mb-1 fw-medium'
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  Click the Activation Link
                                </div>
                                <small style={{ color: 'var(--text-muted)' }}>
                                  Click the link in the email to activate your
                                  account.
                                </small>
                              </>
                            )}
                            {step === 3 && (
                              <>
                                <div
                                  className='mb-1 fw-medium'
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  Start Using Your Account
                                </div>
                                <small style={{ color: 'var(--text-muted)' }}>
                                  Once activated, you can sign in and start
                                  managing your applications.
                                </small>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Important Notice */}
                  <motion.div
                    className='p-3 rounded mb-4'
                    style={{
                      background: 'var(--warning-20)',
                      border: '1.5px solid var(--warning-30)',
                      borderRadius: '12px',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <div className='d-flex align-items-center mb-2'>
                      <FaCheckCircle
                        className='me-2'
                        style={{ color: 'var(--warning-primary)' }}
                        size={16}
                      />
                      <strong style={{ color: 'var(--warning-primary)' }}>
                        Important Notice
                      </strong>
                    </div>
                    <ul
                      className='mb-0'
                      style={{
                        color: 'var(--warning-primary)',
                        fontSize: '0.97rem',
                      }}
                    >
                      <li>
                        Check your spam/junk folder if you don't see the email
                      </li>
                      <li>The activation link expires in 24 hours</li>
                      <li>Mark our emails as safe to ensure future delivery</li>
                    </ul>
                  </motion.div>

                  <RedirectCountdown
                    message='Redirecting to login in'
                    redirectPath='/login'
                    countdownTime={30}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className='min-vh-100 pb-4'
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

        {/* Enhanced Main Registration Card */}
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-9 col-xl-8'>
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
                  0 12px 40px var(--success-15),
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
                      radial-gradient(circle at 20% 20%, var(--success-20), transparent 50%),
                      radial-gradient(circle at 80% 80%, var(--primary-15), transparent 50%)
                    `,
                    animation: 'float 6s ease-in-out infinite',
                  }}
                />

                <motion.div
                  className='rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center position-relative'
                  style={iconContainerStyle}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.6, type: 'spring' }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <FaUserPlus size={24} />
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
                  Create Your Account
                </motion.h3>

                <motion.div
                  className='mb-0'
                  style={{ opacity: 0.9, fontSize: '0.95rem' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Register your law firm to get started
                </motion.div>
              </div>

              {/* Enhanced Error Display */}
              <AnimatePresence>
                {errors && (
                  <motion.div
                    className='mx-4 mt-3'
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

              {/* Enhanced Form Body */}
              <div className='card-body px-4 pb-4'>
                <form onSubmit={handleSubmit}>
                  <div className='row'>
                    {/* Left Column - Account & Firm Information */}
                    <div className='col-md-6 mb-4 mb-md-0'>
                      <motion.h6
                        className='fw-bold mb-3 d-flex align-items-center'
                        style={sectionHeaderStyle}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        <FaBuilding
                          className='me-2'
                          style={{ color: 'var(--success-primary)' }}
                          size={16}
                        />
                        Account & Firm Information
                      </motion.h6>

                      {/* Email */}
                      <motion.div
                        className='mb-3'
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
                          <FaEnvelope
                            className='me-2'
                            style={{ color: 'var(--success-primary)' }}
                            size={14}
                          />
                          Firm Email Address *
                        </label>
                        <input
                          type='email'
                          className='form-control'
                          style={inputStyle('email')}
                          name='email'
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          required
                          placeholder='Enter your firm email address'
                        />
                        <small
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                          }}
                        >
                          This will be used for authentication and login
                          purposes
                        </small>
                      </motion.div>

                      {/* Firm Name */}
                      <motion.div
                        className='mb-3'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                      >
                        <label
                          className='form-label fw-semibold mb-2'
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                          }}
                        >
                          <FaBuilding
                            className='me-2'
                            style={{ color: 'var(--success-primary)' }}
                            size={14}
                          />
                          Law Firm Name *
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={inputStyle('name')}
                          name='name'
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          required
                          placeholder='Enter your law firm name'
                        />
                      </motion.div>

                      {/* Password */}
                      <motion.div
                        className='mb-3'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
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
                            style={{ color: 'var(--success-primary)' }}
                            size={14}
                          />
                          Password *
                        </label>
                        <div className='position-relative'>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className='form-control'
                            style={{
                              ...inputStyle('password'),
                              paddingRight: '50px',
                            }}
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
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
                              color: 'var(--success-primary)',
                              background: 'var(--success-20)',
                              transform: 'translateY(-50%) scale(1.1)',
                            }}
                            whileTap={{
                              scale: 0.9,
                              transform: 'translateY(-50%) scale(0.9)',
                            }}
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash size={16} />
                            ) : (
                              <FaEye size={16} />
                            )}
                          </motion.button>
                        </div>
                      </motion.div>

                      {/* Phone */}
                      <motion.div
                        className='mb-3'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                      >
                        <label
                          className='form-label fw-semibold mb-2'
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                          }}
                        >
                          <FaPhone
                            className='me-2'
                            style={{ color: 'var(--success-primary)' }}
                            size={14}
                          />
                          Phone Number *
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={inputStyle('phone_number')}
                          name='phone_number'
                          value={formData.phone_number}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('phone_number')}
                          onBlur={() => setFocusedField(null)}
                          required
                          placeholder={`e.g., ${phone_nr_placeholder}`}
                        />
                        <small
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                          }}
                        >
                          Format: <strong>{phone_nr_placeholder}</strong>
                        </small>
                      </motion.div>
                    </div>

                    {/* Right Column - Firm Address */}
                    <div className='col-md-6'>
                      <motion.h6
                        className='fw-bold mb-3 d-flex align-items-center'
                        style={sectionHeaderStyle}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        <FaMapMarkerAlt
                          className='me-2'
                          style={{ color: 'var(--primary-blue)' }}
                          size={16}
                        />
                        Firm Address
                      </motion.h6>

                      {/* Address Line 1 */}
                      <motion.div
                        className='mb-3'
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
                          Address Line 1 *
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={inputStyle('address.line1')}
                          name='address.line1'
                          value={formData.address.line1}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('address.line1')}
                          onBlur={() => setFocusedField(null)}
                          required
                          placeholder='Enter address line 1'
                        />
                      </motion.div>

                      {/* Address Line 2 */}
                      <motion.div
                        className='mb-3'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                      >
                        <label
                          className='form-label fw-semibold mb-2'
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                          }}
                        >
                          Address Line 2
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={inputStyle('address.line2')}
                          name='address.line2'
                          value={formData.address.line2}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('address.line2')}
                          onBlur={() => setFocusedField(null)}
                          placeholder='Enter address line 2 (optional)'
                        />
                      </motion.div>

                      {/* Town and County Row */}
                      <div className='row'>
                        <div className='col-7 mb-3'>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.0, duration: 0.5 }}
                          >
                            <label
                              className='form-label fw-semibold mb-2'
                              style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.95rem',
                              }}
                            >
                              Town/City *
                            </label>
                            <input
                              type='text'
                              className='form-control'
                              style={inputStyle('address.town_city')}
                              name='address.town_city'
                              value={formData.address.town_city}
                              onChange={handleChange}
                              onFocus={() =>
                                setFocusedField('address.town_city')
                              }
                              onBlur={() => setFocusedField(null)}
                              required
                              placeholder='Enter town/city'
                            />
                          </motion.div>
                        </div>
                        <div className='col-5 mb-3'>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                          >
                            <label
                              className='form-label fw-semibold mb-2'
                              style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.95rem',
                              }}
                            >
                              County *
                            </label>
                            <input
                              type='text'
                              className='form-control'
                              style={inputStyle('address.county')}
                              name='address.county'
                              value={formData.address.county}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('address.county')}
                              onBlur={() => setFocusedField(null)}
                              required
                              placeholder='Enter county'
                            />
                          </motion.div>
                        </div>
                      </div>

                      {/* Postcode */}
                      <motion.div
                        className='mb-3'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                      >
                        <label
                          className='form-label fw-semibold mb-2'
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                          }}
                        >
                          {postcode_placeholders[0]} *
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={inputStyle('address.eircode')}
                          name='address.eircode'
                          value={formData.address.eircode}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('address.eircode')}
                          onBlur={() => setFocusedField(null)}
                          required
                          placeholder={`e.g., ${postcode_placeholders[2]}`}
                        />
                        <small
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                          }}
                        >
                          Format: {postcode_placeholders[1]} (e.g.,{' '}
                          {postcode_placeholders[2]})
                        </small>
                      </motion.div>
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <motion.div
                    className='text-center mt-4 pt-3'
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                  >
                    {isRegistering ? (
                      <LoadingComponent message='Creating your account...' />
                    ) : (
                      <motion.button
                        type='submit'
                        className='btn w-100'
                        style={{
                          ...submitButtonStyle,
                          maxWidth: '400px',
                        }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: `
                            0 12px 40px var(--success-40),
                            0 6px 20px var(--success-30),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3)
                          `,
                        }}
                        whileTap={{ scale: 0.98 }}
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
                            animation: 'shimmer 2s infinite',
                          }}
                        />
                        <FaUserPlus className='me-2' size={16} />
                        Create Account
                      </motion.button>
                    )}
                  </motion.div>
                </form>
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

export default RegisterComponent;
