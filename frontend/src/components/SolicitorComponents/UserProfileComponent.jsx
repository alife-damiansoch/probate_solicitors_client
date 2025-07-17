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
        style={{ background: '#f8fafc' }}
      >
        <LoadingComponent message='Loading user data...' />
      </div>
    );
  }

  return (
    <div
      className='min-vh-100 py-4'
      style={{
        background: `linear-gradient(120deg, #f0f3fa 0%, #e0e7ef 100%)`,
        minHeight: '100vh',
      }}
    >
      <div className='container'>
        {/* Header Section */}
        <div className='d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2'>
          <button
            className='btn d-flex align-items-center px-3 py-2 glassy-btn'
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              color: '#64748b',
              fontWeight: 500,
              fontSize: '1rem',
              boxShadow: '0 2px 10px rgba(59,130,246,0.07)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
            }}
            onClick={() => navigate(-1)}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(240,240,255,0.98)';
              e.target.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.85)';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            <FaArrowLeft className='me-2' size={15} />
            Back
          </button>

          <button
            className='btn d-flex align-items-center px-3 py-2 glassy-btn'
            style={{
              background: 'linear-gradient(90deg, #ef4444, #dc2626)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: 500,
              fontSize: '1rem',
              boxShadow: '0 2px 10px rgba(239,68,68,0.14)',
              transition: 'all 0.2s ease',
            }}
            onClick={() => navigate('/update_password')}
            onMouseOver={(e) => {
              e.target.style.background =
                'linear-gradient(90deg, #dc2626, #b91c1c)';
            }}
            onMouseOut={(e) => {
              e.target.style.background =
                'linear-gradient(90deg, #ef4444, #dc2626)';
            }}
          >
            <FaLock className='me-2' size={14} />
            Change Password
          </button>
        </div>

        {/* Profile Card */}
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-8'>
            <div
              className='card border-0 shadow-lg'
              style={{
                borderRadius: 22,
                background: 'rgba(255,255,255,0.92)',
                boxShadow:
                  '0 8px 32px rgba(59,130,246,0.10), 0 2px 8px rgba(102,126,234,0.07)',
                backdropFilter: 'blur(14px)',
                overflow: 'hidden',
              }}
            >
              {/* Card Header */}
              <div
                className='card-header border-0 py-4'
                style={{
                  background: 'linear-gradient(135deg,#667eea,#764ba2)',
                  borderBottom: 'none',
                  borderTopLeftRadius: 22,
                  borderTopRightRadius: 22,
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(59,130,246,0.12)',
                }}
              >
                <div className='text-center'>
                  <div
                    className='rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center'
                    style={{
                      width: 64,
                      height: 64,
                      background: 'rgba(255,255,255,0.16)',
                      color: '#fff',
                      boxShadow: '0 4px 16px rgba(59,130,246,0.09)',
                    }}
                  >
                    <FaUser size={26} />
                  </div>
                  <h3 className='mb-1 fw-bold'>User Profile</h3>
                  <div className='mb-0 small' style={{ opacity: 0.95 }}>
                    Manage your account information
                  </div>
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
              <div className='card-body px-4 px-md-5 pb-4'>
                <form onSubmit={handleSubmit}>
                  <div className='row gy-4'>
                    {/* Left Column - Personal Info */}
                    <div className='col-12 col-md-6'>
                      <h6 className='fw-bold mb-3 text-primary d-flex align-items-center'>
                        <FaUser className='me-2' size={16} />
                        Personal Information
                      </h6>

                      {/* Email */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium mb-1'>
                          Email Address <span className='text-danger'>*</span>
                        </label>
                        <input
                          type='email'
                          className='form-control'
                          style={{
                            borderRadius: 10,
                            border: '1.5px solid #c7d1ee',
                            fontSize: '1.02rem',
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
                          Firm Name <span className='text-danger'>*</span>
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 10,
                            border: '1.5px solid #c7d1ee',
                            fontSize: '1.02rem',
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
                            borderRadius: 10,
                            border: '1.5px solid #c7d1ee',
                            fontSize: '1.02rem',
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
                      <h6 className='fw-bold mb-3 text-success d-flex align-items-center'>
                        <FaMapMarkerAlt className='me-2' size={16} />
                        Address Information
                      </h6>

                      {/* Address Line 1 */}
                      <div className='mb-3'>
                        <label className='form-label fw-medium mb-1'>
                          Address Line 1 <span className='text-danger'>*</span>
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 10,
                            border: '1.5px solid #badbcc',
                            fontSize: '1.02rem',
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
                            borderRadius: 10,
                            border: '1.5px solid #badbcc',
                            fontSize: '1.02rem',
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
                            Town/City <span className='text-danger'>*</span>
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            style={{
                              borderRadius: 10,
                              border: '1.5px solid #badbcc',
                              fontSize: '1.02rem',
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
                              borderRadius: 10,
                              border: '1.5px solid #badbcc',
                              fontSize: '1.02rem',
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
                          <span className='text-danger'>*</span>
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            borderRadius: 10,
                            border: '1.5px solid #badbcc',
                            fontSize: '1.02rem',
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
                      borderTop: '1px solid #f3f4f6',
                    }}
                  >
                    {isUpdatingProfile ? (
                      <LoadingComponent message='Updating profile...' />
                    ) : (
                      <button
                        type='submit'
                        className='btn px-4 py-2 fw-medium'
                        style={{
                          background:
                            'linear-gradient(90deg, #667eea, #764ba2)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '1.07rem',
                          minWidth: '170px',
                          boxShadow: '0 4px 14px rgba(59,130,246,0.12)',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background =
                            'linear-gradient(90deg, #2563eb, #4f46e5)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background =
                            'linear-gradient(90deg, #667eea, #764ba2)';
                        }}
                      >
                        <FaEdit className='me-2' size={15} />
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

      {/* Animations */}
      <style>{`
        .glassy-btn:active {
          box-shadow: 0 2px 12px rgba(102,126,234,0.12);
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
