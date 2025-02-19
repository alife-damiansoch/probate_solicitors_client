import axios from 'axios';
import React, { useState } from 'react';

import { API_URL } from '../../baseUrls';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import Cookies from 'js-cookie';
import RedirectCountdown from '../GenericComponents/RedirectCountdown';

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

  const country = Cookies.get('country_solicitors');
  const postcode_placeholders = JSON.parse(
    Cookies.get('postcode_placeholders')
  );
  const phone_nr_placeholder = Cookies.get('phone_nr_placeholder');

  const [showForm, setShowForm] = useState(true);

  const registerUser = async (formData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/user/create/`,
        formData,
        {
          headers: {
            Country: country, // Adding the country header
            'Frontend-Host': window.location.origin, // Sends the current frontend's URL
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

  return (
    <>
      {showForm ? (
        <div className='container my-5'>
          <div className='row justify-content-center px-sm-0 mx-sm-0'>
            <div className='col-md-8 px-sm-0'>
              <div className='card shadow-lg'>
                <div className='card-body shadow-lg text-center'>
                  <h3 className='card-title text-center'>Register</h3>
                  <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                      <label
                        htmlFor='email'
                        className='form-label col-12 col-md-10'
                      >
                        Email:
                        <input
                          type='email'
                          id='email'
                          name='email'
                          className='form-control form-control-sm shadow'
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </label>
                      <div className='text-center'>
                        <sub className='text-info '>
                          This should be the solicitor firm's default email
                          address. <br />
                          It will be used to authenticate the account, login and
                          for multi-factor authentication purposes. <br />
                          Solicitor-specific email addresses can be added later
                          when assigning solicitors to applications.
                        </sub>
                      </div>
                    </div>
                    <div className='mb-3'>
                      <label
                        htmlFor='password'
                        className='form-label col-12 col-md-10'
                      >
                        Password:
                        <input
                          type='password'
                          id='password'
                          name='password'
                          className='form-control form-control-sm shadow'
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </label>
                    </div>
                    <div className='mb-3'>
                      <label
                        htmlFor='confirmPassword'
                        className='form-label col-12 col-md-10'
                      >
                        Confirm Password:
                        <input
                          type='password'
                          id='confirmPassword'
                          name='confirmPassword'
                          className='form-control form-control-sm shadow'
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </label>
                    </div>
                    <div className='mb-3'>
                      <label
                        htmlFor='name'
                        className='form-label col-12 col-md-10'
                      >
                        Law Firm Name:
                        <input
                          type='text'
                          id='name'
                          name='name'
                          className='form-control form-control-sm shadow'
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </label>
                    </div>
                    <div className='mb-3'>
                      <label
                        htmlFor='phone_number'
                        className='form-label col-12 col-md-10'
                      >
                        Phone Number:
                        <input
                          type='text'
                          id='phone_number'
                          name='phone_number'
                          className='form-control form-control-sm shadow'
                          value={formData.phone_number}
                          onChange={handleChange}
                          required
                        />
                        <sub id='phoneHelp' className='form-text text-info'>
                          Please provide your phone number in international
                          format starting with <br />
                          <strong> +[country code]</strong> followed by the full
                          number. <br />
                          Example:<strong>{phone_nr_placeholder}</strong>
                        </sub>
                      </label>
                    </div>
                    <div className='mb-3'>
                      <label
                        htmlFor='line1'
                        className='form-label col-12 col-md-10'
                      >
                        Address Line 1:
                        <input
                          type='text'
                          id='line1'
                          name='address.line1'
                          className='form-control form-control-sm shadow'
                          value={formData.address.line1}
                          onChange={handleChange}
                          required
                        />
                      </label>
                    </div>
                    <div className='mb-3'>
                      <label
                        htmlFor='line2'
                        className='form-label col-12 col-md-10'
                      >
                        Address Line 2:
                        <input
                          type='text'
                          id='line2'
                          name='address.line2'
                          className='form-control form-control-sm shadow'
                          value={formData.address.line2}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div className='mb-3'>
                      <label
                        htmlFor='town_city'
                        className='form-label col-12 col-md-10'
                      >
                        Town/City:
                        <input
                          type='text'
                          id='town_city'
                          name='address.town_city'
                          className='form-control form-control-sm shadow'
                          value={formData.address.town_city}
                          onChange={handleChange}
                          required
                        />
                      </label>
                    </div>
                    <div className='mb-3'>
                      <label
                        htmlFor='county'
                        className='form-label col-12 col-md-10'
                      >
                        County:
                        <input
                          type='text'
                          id='county'
                          name='address.county'
                          className='form-control form-control-sm shadow'
                          value={formData.address.county}
                          onChange={handleChange}
                          required
                        />
                      </label>
                    </div>
                    <div className='mb-3'>
                      <label
                        htmlFor='eircode'
                        className='form-label col-12 col-md-10'
                      >
                        {postcode_placeholders[0]}:
                        <input
                          type='text'
                          id='eircode'
                          name='address.eircode'
                          className='form-control form-control-sm shadow'
                          value={formData.address.eircode}
                          onChange={handleChange}
                          required
                        />
                      </label>
                      <br />
                      <small className='form-text text-info'>
                        Please enter a valid {postcode_placeholders[0]} in the
                        format <strong>{postcode_placeholders[1]}</strong>{' '}
                        (e.g., {postcode_placeholders[2]}).
                      </small>
                    </div>
                    <button
                      type='submit'
                      className='btn btn-outline-primary w-100 shadow mt-2'
                      disabled={isRegistering}
                    >
                      {isRegistering ? 'Registering...' : 'Register'}
                    </button>
                    {errors ? (
                      <div
                        className='alert alert-danger text-start mt-2'
                        role='alert'
                      >
                        {renderErrors(errors)}
                      </div>
                    ) : null}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=' card  my-5 shadow rounded'>
          <div className=' card-header bg-success-subtle'>
            <h4 className='text-center'> Registration successfull</h4>
          </div>
          <div className='card-body my-5 text-center'>
            <h2 className=' text-success'>
              Your account has been successfully created!
            </h2>{' '}
            <br /> <br />
            <br />
            <p style={{ fontSize: '20px' }}>
              Please check your email inbox to activate your account. <br />
              <br />
              If you don't see the email in your inbox, please check your spam
              or junk folder. <br />
              <br />
              To ensure you receive future emails, mark our messages as safe or
              move them to your primary inbox. <br />
              <br />
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                Important: The activation link is valid for 24 hours only. If
                you do not activate your account within this time, the link will
                expire, and you will need to contact our support team to
                complete the activation process.
              </span>
            </p>
          </div>
          <RedirectCountdown
            message='Redirecting to login in'
            redirectPath='/login'
            countdownTime={30}
          />
        </div>
      )}
    </>
  );
};

export default RegisterComponent;
