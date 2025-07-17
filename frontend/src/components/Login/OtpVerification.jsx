import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearAuthError, signup } from '../../store/authSlice';
import LoadingComponent from '../GenericComponents/LoadingComponent';
import { fetchData, postData } from '../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import QrCodeDisplay from './QrCodeDisplay';
import VerificationForm from './VerificationForm';

const VerifyOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [qrCode, setQrCode] = useState(null);
  const [manualKey, setManualKey] = useState(null); // For manual key
  const [isCooldown, setIsCooldown] = useState(false);
  const [timer, setTimer] = useState(0);
  const [step, setStep] = useState('emailValidation');

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
      const resultAction = await dispatch(signup({ email, password, otp }));

      if (signup.fulfilled.match(resultAction)) {
        setIsLoading(false);
        navigate('/applications');
      } else if (signup.rejected.match(resultAction)) {
        setErrors(resultAction.payload);
        setIsLoading(false);
      }
    }
  };

  const handleSwitchMethod = async (refreshCurrent = false) => {
    setQrCode(null);
    setManualKey(null);
    try {
      setIsLoading(true);
      setErrors(null);
      let methodToSend;
      if (refreshCurrent) {
        methodToSend = authMethod;
      } else {
        methodToSend = authMethod === 'otp' ? 'authenticator' : 'otp';
      }
      setAuthMethod(methodToSend);
      const response = await postData(
        'token',
        '/api/user/update-auth-method/',
        { email, preferred_auth_method: methodToSend }
      );
      if (response.status === 200) {
        const { auth_method, qr_code, manual_key } = response.data;
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
      { email: email, code: authCode }
    );
    if (response.status === 200) {
      alert('Authenticator successfully activated!');
      setQrCode(null);
      setAuthMethod('authenticator');
    } else {
      setErrors(response.data);
    }
  };

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
      handleSwitchMethod(true);
      setIsCooldown(true);
      setTimer(120);
    }
  };

  useEffect(() => {
    if (!email || !password) {
      navigate('/login');
    }
  }, [email, password, navigate]);

  if (!email || !password) return null;
  if (isLoading) return <LoadingComponent />;

  return (
    <div
      className='min-vh-100 d-flex align-items-center justify-content-center'
      style={{
        background: 'linear-gradient(120deg, #f0f3fa 0%, #e0e7ef 100%)',
        minHeight: '100vh',
      }}
    >
      <div className='container py-5'>
        <div className='row justify-content-center'>
          <div className='col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5'>
            <div
              className='card border-0 shadow-lg p-0'
              style={{
                borderRadius: 22,
                background: 'rgba(255,255,255,0.98)',
                boxShadow:
                  '0 8px 32px rgba(16,185,129,0.10), 0 2px 8px rgba(59,130,246,0.07)',
                backdropFilter: 'blur(14px)',
                overflow: 'hidden',
              }}
            >
              <div
                className='card-header border-0 py-4 text-center'
                style={{
                  background:
                    'linear-gradient(135deg,#3b82f6 60%,#10b981 100%)',
                  borderBottom: 'none',
                  borderTopLeftRadius: 22,
                  borderTopRightRadius: 22,
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(16,185,129,0.08)',
                }}
              >
                <h3 className='fw-bold mb-0'>Verify Your Account</h3>
                <div className='small' style={{ opacity: 0.96 }}>
                  {authMethod === 'otp'
                    ? 'Enter the 6-digit code sent to your email'
                    : 'Enter the code from your authenticator app'}
                </div>
              </div>
              {/* QR or Verification */}
              <div className='card-body px-4 pt-4 pb-2'>
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
                  <>
                    <VerificationForm
                      otp={otp}
                      setOtp={setOtp}
                      isLoading={isLoading}
                      handleSubmit={handleSubmit}
                    />
                    <div className='my-2 text-center small text-muted'>
                      {authMethod === 'otp' ? (
                        <>
                          A security code was sent to:
                          <br />
                          <span className='fw-bold'>{email}</span>
                        </>
                      ) : (
                        <>Open your authenticator app to retrieve your code.</>
                      )}
                    </div>
                    <div className='text-center my-3'>
                      <button
                        type='button'
                        className='btn btn-link px-0 fw-medium'
                        style={{
                          color: '#3b82f6',
                          fontSize: '0.98rem',
                        }}
                        onClick={() => handleSwitchMethod(false)}
                        disabled={isLoading}
                      >
                        Use{' '}
                        {authMethod === 'otp'
                          ? 'Authenticator App'
                          : 'Email Verification'}
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* Resend and Cooldown */}
              {(!qrCode || step === 'emailValidation') && (
                <div className='px-4 pb-3'>
                  <div className='d-flex flex-column flex-sm-row align-items-center justify-content-between'>
                    <button
                      className='btn btn-link text-info p-0'
                      style={{
                        textDecoration: 'underline',
                        fontSize: '0.97rem',
                        fontWeight: 500,
                        letterSpacing: '0.01em',
                      }}
                      onClick={handleClick}
                      disabled={isCooldown}
                    >
                      Resend validation code
                    </button>
                    {isCooldown && (
                      <sub className='text-muted text-end ms-sm-2 mt-2 mt-sm-0'>
                        You can resend in {timer} sec
                      </sub>
                    )}
                  </div>
                </div>
              )}
              {/* Error Display */}
              {errors && (
                <div className='mx-4 mb-3'>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
