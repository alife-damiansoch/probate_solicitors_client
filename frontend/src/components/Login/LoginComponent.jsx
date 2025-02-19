import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearAuthError } from '../../store/authSlice';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import BackToApplicationsIcon from '../GenericComponents/BackToApplicationsIcon';
import { postData } from '../GenericFunctions/AxiosGenericFunctions';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);

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
    <div className='container my-5'>
      <BackToApplicationsIcon backUrl={-1} />
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card shadow-lg'>
            <div className='card-body shadow-lg '>
              <h3 className='card-title text-center'>Login</h3>
              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor='email' className='form-label   col-12'>
                    Email:
                    <input
                      type='email'
                      id='email'
                      className='form-control shadow'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className='mb-3'>
                  <label htmlFor='password' className='form-label col-12'>
                    Password:
                    <input
                      type='password'
                      id='password'
                      className='form-control shadow'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </label>
                  <div className='text-end mt-1'>
                    <Link
                      className='link link-info text-decoration-underline'
                      to='/forgotPassword'
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <button
                  type='submit'
                  className='btn btn-outline-primary w-100 shadow mt-3'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className='spinner-border text-warning' role='status'>
                      <span className='visually-hidden'>Loading...</span>
                    </div>
                  ) : (
                    'Login'
                  )}
                </button>

                {authError ? (
                  <div
                    className='alert alert-danger text-center mt-2'
                    role='alert'
                  >
                    {renderErrors(authError)}
                  </div>
                ) : null}
                {errors ? (
                  <div
                    className='alert alert-danger text-center mt-2'
                    role='alert'
                  >
                    {renderErrors(errors)}
                  </div>
                ) : null}
              </form>
              <div className='text-center mt-3'>
                <Link
                  className='link link-info text-decoration-underline'
                  to='/register'
                >
                  Don't have an account? Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
