import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaEdit,
  FaLock,
  FaMapMarkerAlt,
  FaUser,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../../store/userSlice';
import LoadingComponent from '../GenericComponents/LoadingComponent';
import { patchData } from '../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';

const UserProfile = () => {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const postcode_placeholders = JSON.parse(
    Cookies.get('postcode_placeholders')
  );
  const phone_nr_placeholder = Cookies.get('phone_nr_placeholder');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone_number: '',
    address: {
      line1: '',
      line2: '',
      town_city: '',
      county: '',
      eircode: '',
    },
  });

  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user?.email ?? '',
        name: user?.name ?? '',
        phone_number: user.phone_number,
        address: {
          line1: user?.address?.line1 ?? '',
          line2: user?.address?.line2 ?? '',
          town_city: user?.address?.town_city ?? '',
          county: user?.address?.county ?? '',
          eircode: user?.address?.eircode ?? '',
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    try {
      setIsUpdatingProfile(true);
      const endpoint = `/api/user/me/`;
      const response = await patchData(endpoint, formData);
      if (response.status === 200) {
        alert('Profile updated successfully!');
        dispatch(fetchUser());
      } else {
        setErrors(response.data);
        dispatch(fetchUser());
      }
    } catch (err) {
      setErrors(err.response?.data || { error: 'An error occurred' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!user) {
    return (
      <div
        className='min-vh-100 d-flex align-items-center justify-content-center'
        style={{ background: 'var(--gradient-main-bg)' }}
      >
        <LoadingComponent message='Loading user data...' />
      </div>
    );
  }

  return (
    <motion.div
      className='min-vh-100 pb-3'
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
      {/* Glassy, animated BG */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 22% 26%, var(--primary-10) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, var(--success-20) 0%, transparent 52%),
            radial-gradient(circle at 60% 8%, var(--primary-20) 0%, transparent 32%)
          `,
          opacity: 0.7,
          animation: 'backgroundFloat 21s linear infinite',
        }}
      />

      <div className='container position-relative' style={{ zIndex: 2 }}>
        {/* Header Section */}
        <motion.div
          className='d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2'
          initial={{ y: -40, opacity: 0 }}
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
              boxShadow: '0 2px 10px var(--primary-10)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{
              background: 'var(--surface-primary)',
              color: 'var(--primary-blue)',
            }}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className='me-2' size={15} />
            Back
          </motion.button>

          <motion.button
            className='btn d-flex align-items-center px-3 py-2'
            style={{
              background: 'var(--error-primary)',
              border: 'none',
              borderRadius: '13px',
              color: '#fff',
              fontWeight: 500,
              fontSize: '1rem',
              boxShadow: '0 2px 10px var(--error-20)',
              transition: 'all 0.2s ease',
            }}
            whileHover={{
              background: 'var(--error-dark)',
              color: '#fff',
            }}
            onClick={() => navigate('/update_password')}
          >
            <FaLock className='me-2' size={14} />
            Change Password
          </motion.button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className='row justify-content-center'
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div className='col-12 col-lg-10 col-xl-8'>
            <motion.div
              className='card border-0'
              style={{
                borderRadius: 26,
                background: 'var(--surface-primary)',
                boxShadow: `
                  0 12px 32px var(--primary-10),
                  0 4px 12px var(--primary-20),
                  inset 0 1px 0 var(--white-10)
                `,
                backdropFilter: 'blur(18px)',
                overflow: 'hidden',
              }}
              initial={{ scale: 0.99, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{
                scale: 1.01,
                boxShadow: `
                  0 22px 48px var(--primary-20),
                  0 10px 22px var(--primary-30),
                  0 7px 18px var(--success-20),
                  inset 0 1px 0 var(--white-15)
                `,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            >
              {/* Card Header */}
              <motion.div
                className='card-header border-0 py-4'
                style={{
                  background: 'var(--gradient-header)',
                  borderBottom: 'none',
                  borderTopLeftRadius: 26,
                  borderTopRightRadius: 26,
                  color: 'var(--text-primary)',
                  boxShadow: '0 8px 22px var(--primary-20)',
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.7 }}
              >
                <div className='text-center'>
                  <motion.div
                    className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                    style={{
                      width: 64,
                      height: 64,
                      background: 'var(--primary-20)',
                      color: 'var(--primary-blue)',
                      boxShadow: '0 4px 16px var(--primary-20)',
                    }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.28, duration: 0.6 }}
                  >
                    <FaUser size={28} />
                  </motion.div>
                  <motion.h3
                    className='mb-1 fw-bold'
                    style={{
                      background:
                        'linear-gradient(135deg, var(--text-primary), var(--primary-blue-light))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    User Profile
                  </motion.h3>
                  <motion.div
                    className='mb-0 small'
                    style={{ opacity: 0.97, color: 'var(--text-tertiary)' }}
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Manage your account information
                  </motion.div>
                </div>
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
              <div className='card-body px-4 px-md-5 pb-4'>
                <form onSubmit={handleSubmit}>
                  <div className='row gy-4'>
                    {/* Left Column - Personal Info */}
                    <div className='col-12 col-md-6'>
                      <h6
                        className='fw-bold mb-3 d-flex align-items-center'
                        style={{
                          color: 'var(--primary-blue)',
                          letterSpacing: '.01em',
                        }}
                      >
                        <FaUser className='me-2' size={16} />
                        Personal Information
                      </h6>
                      {/* Email */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium mb-1'>
                          Email Address <span className='status-error'>*</span>
                        </label>
                        <input
                          type='email'
                          className='form-control'
                          style={{
                            borderRadius: 11,
                            border: '1.5px solid var(--border-primary)',
                            fontSize: '1.03rem',
                            background: 'var(--surface-secondary)',
                            color: 'var(--text-primary)',
                          }}
                          name='email'
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <small className='text-muted'>
                          Login email will be updated
                        </small>
                      </div>
                      {/* Name */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium mb-1'>
                          Firm Name <span className='status-error'>*</span>
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 11,
                            border: '1.5px solid var(--border-primary)',
                            fontSize: '1.03rem',
                            background: 'var(--surface-secondary)',
                            color: 'var(--text-primary)',
                          }}
                          name='name'
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {/* Phone */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium mb-1'>
                          Phone Number
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 11,
                            border: '1.5px solid var(--border-primary)',
                            fontSize: '1.03rem',
                            background: 'var(--surface-secondary)',
                            color: 'var(--text-primary)',
                          }}
                          name='phone_number'
                          value={formData.phone_number}
                          onChange={handleChange}
                        />
                        <small className='text-info'>
                          Format: <strong>{phone_nr_placeholder}</strong>
                        </small>
                      </div>
                    </div>

                    {/* Right Column - Address */}
                    <div className='col-12 col-md-6'>
                      <h6
                        className='fw-bold mb-3 d-flex align-items-center'
                        style={{
                          color: 'var(--success-primary)',
                          letterSpacing: '.01em',
                        }}
                      >
                        <FaMapMarkerAlt className='me-2' size={16} />
                        Address Information
                      </h6>
                      {/* Address Line 1 */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium mb-1'>
                          Address Line 1 <span className='status-error'>*</span>
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 11,
                            border: '1.5px solid var(--border-primary)',
                            fontSize: '1.03rem',
                            background: 'var(--surface-secondary)',
                            color: 'var(--text-primary)',
                          }}
                          name='address.line1'
                          value={formData.address.line1}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {/* Address Line 2 */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium mb-1'>
                          Address Line 2
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 11,
                            border: '1.5px solid var(--border-primary)',
                            fontSize: '1.03rem',
                            background: 'var(--surface-secondary)',
                            color: 'var(--text-primary)',
                          }}
                          name='address.line2'
                          value={formData.address.line2}
                          onChange={handleChange}
                        />
                      </div>
                      {/* Town/County Row */}
                      <div className='row'>
                        <div className='col-12 col-sm-7 mb-3'>
                          <label className='form-label fw-medium mb-1'>
                            Town/City <span className='status-error'>*</span>
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            style={{
                              borderRadius: 11,
                              border: '1.5px solid var(--border-primary)',
                              fontSize: '1.03rem',
                              background: 'var(--surface-secondary)',
                              color: 'var(--text-primary)',
                            }}
                            name='address.town_city'
                            value={formData.address.town_city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className='col-12 col-sm-5 mb-3'>
                          <label className='form-label fw-medium mb-1'>
                            County
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            style={{
                              borderRadius: 11,
                              border: '1.5px solid var(--border-primary)',
                              fontSize: '1.03rem',
                              background: 'var(--surface-secondary)',
                              color: 'var(--text-primary)',
                            }}
                            name='address.county'
                            value={formData.address.county}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {/* Postcode */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium mb-1'>
                          {postcode_placeholders[0]}{' '}
                          <span className='status-error'>*</span>
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 11,
                            border: '1.5px solid var(--border-primary)',
                            fontSize: '1.03rem',
                            background: 'var(--surface-secondary)',
                            color: 'var(--text-primary)',
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
                    style={{
                      borderTop: '1px solid var(--border-muted)',
                    }}
                  >
                    {isUpdatingProfile ? (
                      <LoadingComponent message='Updating profile...' />
                    ) : (
                      <motion.button
                        type='submit'
                        className='btn px-4 py-2 fw-medium'
                        style={{
                          background: 'var(--primary-blue)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '1.09rem',
                          minWidth: '170px',
                          boxShadow: '0 4px 14px var(--primary-20)',
                          transition: 'all 0.19s',
                        }}
                        whileHover={{
                          background: 'var(--primary-blue-dark)',
                        }}
                      >
                        <FaEdit className='me-2' size={15} />
                        Update Profile
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes backgroundFloat {
          0%,100%{transform:translateY(0) rotate(0deg);opacity:.68;}
          40%{transform:translateY(-12px) rotate(60deg);opacity:.83;}
          80%{transform:translateY(7px) rotate(140deg);opacity:.74;}
        }
      `}</style>
    </motion.div>
  );
};

export default UserProfile;
