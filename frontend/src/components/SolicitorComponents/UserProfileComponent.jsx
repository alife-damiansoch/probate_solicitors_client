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
import { fetchUser } from '../../store/userSlice';

import { useNavigate } from 'react-router-dom';
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
      console.error('Error updating profile:', err);
      setErrors(err.response.data || { error: 'An error occurred' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!user) {
    return (
      <div
        className='min-vh-100 d-flex align-items-center justify-content-center'
        style={{ backgroundColor: '#f8fafc' }}
      >
        <LoadingComponent message='Loading user data...' />
      </div>
    );
  }

  return (
    <div className='min-vh-100 py-4' style={{ backgroundColor: '#f8fafc' }}>
      <div className='container'>
        {/* Header Section */}
        <div className='d-flex align-items-center justify-content-between mb-4'>
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

          <button
            className='btn d-flex align-items-center px-3 py-2'
            style={{
              backgroundColor: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
            }}
            onClick={() => navigate('/update_password')}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#dc2626';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#ef4444';
            }}
          >
            <FaLock className='me-2' size={12} />
            Change Password
          </button>
        </div>

        {/* Main Profile Card */}
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
                      backgroundColor: '#3b82f6',
                      color: 'white',
                    }}
                  >
                    <FaUser size={24} />
                  </div>
                  <h4 className='mb-1 fw-bold text-slate-800'>User Profile</h4>
                  <p className='mb-0 text-slate-500 small'>
                    Manage your account information
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
                    {/* Left Column - Personal Info */}
                    <div className='col-md-6'>
                      <h6 className='fw-bold text-slate-700 mb-3 d-flex align-items-center'>
                        <FaUser className='me-2 text-slate-400' size={14} />
                        Personal Information
                      </h6>

                      {/* Email */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium text-slate-600 mb-1 small'>
                          Email Address *
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
                            (e.target.style.borderColor = '#3b82f6')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = '#d1d5db')
                          }
                        />
                        <small className='text-muted'>
                          Login email will be updated
                        </small>
                      </div>

                      {/* Name */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium text-slate-600 mb-1 small'>
                          Firm Name *
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
                            (e.target.style.borderColor = '#3b82f6')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = '#d1d5db')
                          }
                        />
                      </div>

                      {/* Phone */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium text-slate-600 mb-1 small'>
                          Phone Number
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
                          onFocus={(e) =>
                            (e.target.style.borderColor = '#3b82f6')
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
                        Address Information
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
                            (e.target.style.borderColor = '#10b981')
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
                            (e.target.style.borderColor = '#10b981')
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
                              (e.target.style.borderColor = '#10b981')
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = '#d1d5db')
                            }
                          />
                        </div>
                        <div className='col-5 mb-3'>
                          <label className='form-label fw-medium text-slate-600 mb-1 small'>
                            County
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
                            onFocus={(e) =>
                              (e.target.style.borderColor = '#10b981')
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
                            (e.target.style.borderColor = '#10b981')
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
                    {isUpdatingProfile ? (
                      <LoadingComponent message='Updating profile...' />
                    ) : (
                      <button
                        type='submit'
                        className='btn px-4 py-2 fw-medium'
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          transition: 'all 0.2s ease',
                          minWidth: '160px',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#2563eb';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#3b82f6';
                        }}
                      >
                        <FaEdit className='me-2' size={14} />
                        Update Profile
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

export default UserProfile;
