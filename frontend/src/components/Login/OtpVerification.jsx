import React, { useState, useEffect } from 'react';
import { signup, clearAuthError } from '../../store/authSlice';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import { fetchData, postData } from '../GenericFunctions/AxiosGenericFunctions';
import QrCodeDisplay from './QrCodeDisplay';
import LoadingComponent from '../GenericComponents/LoadingComponent';
import VerificationForm from './VerificationForm';

const VerifyOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [qrCode, setQrCode] = useState(null);
  const [manualKey, setManualKey] = useState(null); // For the manual key
  const [isCooldown, setIsCooldown] = useState(false);
  const [timer, setTimer] = useState(0);
  const [step, setStep] = useState('emailValidation');

  // const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email and password from navigation state
  const {
    email,
    password,
    authMethod: initialAuthMethod,
  } = location.state || {};
  const [authMethod, setAuthMethod] = useState(initialAuthMethod || 'otp');
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    // Clear authError when the component is rendered
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    // Check authentication status
    const checkAuthStatus = async () => {
      if (email) {
        try {
          setIsLoading(true);
          const response = await fetchData(
            'check',
            `/api/user/update-auth-method/?email=${encodeURIComponent(email)}`
          );

          if (response.status === 200) {
            const { auth_method, qr_code, manual_key, is_active } =
              response.data;
            setAuthMethod(auth_method);

            if (!is_active && qr_code) {
              setQrCode(qr_code);
              setManualKey(manual_key);
            }
          }
        } catch (error) {
          setErrors(
            error.response?.data || 'Failed to check authentication status.'
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuthStatus();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null);
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      console.log('OTP submitted:', enteredOtp);

      const resultAction = await dispatch(signup({ email, password, otp }));

      if (signup.fulfilled.match(resultAction)) {
        setIsLoading(false);
        navigate('/applications');
      } else if (signup.rejected.match(resultAction)) {
        console.error('Login error:', resultAction.payload);
        setErrors(resultAction.payload);
        setIsLoading(false);
      }
    }
  };

  // const isSubmitDisabled = otp.some((digit) => digit === '');

  const handleSwitchMethod = async (refreshCurrent = false) => {
    setQrCode(null);
    setManualKey(null);
    try {
      setIsLoading(true);
      setErrors(null);

      // Determine the method to be sent in the API call

      let methodToSend;

      if (refreshCurrent) {
        // If refreshCurrent is true, keep the current method
        methodToSend = authMethod;
      } else {
        // Otherwise, toggle between 'otp' and 'authenticator'
        methodToSend = authMethod === 'otp' ? 'authenticator' : 'otp';
      }

      console.log(methodToSend);
      setAuthMethod(methodToSend);

      const response = await postData(
        'token',
        '/api/user/update-auth-method/',
        {
          email,
          preferred_auth_method: methodToSend,
        }
      );

      if (response.status === 200) {
        const { auth_method, qr_code, manual_key } = response.data;

        // Handle QR code and manual key for authenticator method
        if (qr_code && auth_method === 'authenticator') {
          setQrCode(qr_code);
          setManualKey(manual_key);
        } else {
          setQrCode(null);
          setManualKey(null);
        }
      } else {
        setErrors(response.data);
      }
    } catch (error) {
      setErrors(error.response?.data || 'Failed to switch method.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (authCode) => {
    setErrors(null);
    const response = await postData(
      'verify',
      '/api/user/verify-authenticator-code/',
      {
        email: email,
        code: authCode,
      }
    );
    console.log(response);

    if (response.status === 200) {
      alert('Authenticator successfully activated!');
      setQrCode(null); // Close QR code display
      setAuthMethod('authenticator'); // Update preferred method
    } else {
      setErrors(response.data);
    }
  };

  // this useffect is used to set timed on refresh validation code, just to stop misusing it
  useEffect(() => {
    let countdownInterval;

    if (isCooldown && timer > 0) {
      countdownInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      clearInterval(countdownInterval);
      setIsCooldown(false);
    }

    return () => clearInterval(countdownInterval);
  }, [isCooldown, timer]);

  const handleClick = () => {
    if (!isCooldown) {
      handleSwitchMethod(true); // Trigger the resend functionality
      setIsCooldown(true); // Start cooldown
      setTimer(120); // Set timer to 2 minutes (120 seconds)
    }
  };

  // Redirect to login if state is missing
  useEffect(() => {
    if (!email || !password) {
      navigate('/login'); // Redirect to a safe page
    }
  }, [email, password, navigate]);

  if (!email || !password) {
    return null; // Prevent rendering until redirect happens
  }

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-light my-5'>
      <div className='card shadow-sm p-4 my-5'>
        {qrCode ? (
          <QrCodeDisplay
            qrCode={qrCode}
            manualKey={manualKey}
            onDone={() => {
              setQrCode(null);
              handleSwitchMethod();
            }}
            onVerify={handleVerifyCode}
            email={email}
            step={step}
            setStep={setStep}
          />
        ) : (
          <div className='card-body' style={{ maxWidth: '500px' }}>
            <h3 className='card-title text-center mb-4'>
              Enter Verification Code
            </h3>
            <p
              className='text-center'
              style={{
                // Slightly larger text for better visibility
                color: '#343a40', // Neutral dark gray for a professional look
              }}
            >
              {authMethod === 'otp'
                ? 'Enter the verification code sent to your email.'
                : 'Enter the code generated by your authenticator app.'}
            </p>

            <VerificationForm
              otp={otp}
              setOtp={setOtp}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
            />

            <div className='card-footer my-2 text-center'>
              <sub className='text-info'>
                {authMethod === 'otp' ? (
                  <>
                    A security code has been sent to your firm's default email
                    address: <br />
                    <strong>{email}</strong>. <br />
                  </>
                ) : (
                  <>
                    Open your authenticator app to retrieve the verification
                    code associated with your account. <br />
                  </>
                )}
              </sub>
            </div>
            <div className=' text-end'>
              <button
                type='button'
                className='btn btn-link text-end w-100 mt-3'
                onClick={() => handleSwitchMethod(false)}
                disabled={isLoading}
              >
                Use{' '}
                {authMethod === 'otp'
                  ? 'Authenticator App'
                  : 'Email Verification'}
              </button>
            </div>
          </div>
        )}
        {(!qrCode || step === 'emailValidation') && (
          <>
            <div className='text-end '>
              <button
                className='btn  bg-body text-info'
                onClick={() => {
                  handleClick();
                }}
                disabled={isCooldown}
              >
                <span className=' text-decoration-underline'>
                  Resend validation code
                </span>
              </button>
            </div>
            {isCooldown && (
              <sub className='text-muted text-end'>
                You can resend the validation code in {timer} seconds.
              </sub>
            )}
          </>
        )}

        {errors && (
          <div className='alert alert-danger text-center'>
            {renderErrors(errors)}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
