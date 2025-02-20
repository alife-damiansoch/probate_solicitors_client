
import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import VerificationForm from './VerificationForm';
import { postData } from '../GenericFunctions/AxiosGenericFunctions';
import {useState} from "react";

const QrCodeDisplay = ({
  qrCode,
  manualKey,
  onDone,
  onVerify,
  email,
  step,
  setStep,
}) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [authCode, setAuthCode] = useState(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setError(null);

    try {
      const response = await postData('token', '/api/user/validate-otp/', {
        email,
        otp,
      });
      if (response.status === 200) {
        setStep('AuthenicatorSetup');
      } else setError(response.data);
    } catch (err) {
      setError(err.response?.data || 'Something went wrong.'); // Error message from the API
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    try {
      await onVerify(authCode); // Trigger verification callback

    } catch  {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className=' border border-2 border-success shadow'>
      <div className=' card-header'>
        <h4 className='text-center'>Authenticator App Setup</h4>
      </div>
      {/* step 1 -> email validation */}
      {step === 'emailValidation' && (
        <div
          style={{ maxWidth: '500px' }}
          className='qr-code-display card-body'
        >
          <h6 className='card-title text-center mb-4'>
            User identity verification
          </h6>
          <div className=' alert alert-info text-center'>
            <small>
              To verify your identity, a one-time code has been sent to your
              default email address. <br />
              <br />
              Please enter this code to complete the verification process.{' '}
              <br />
              <br />
              Once verified, you will have the option to set up an authenticator
              app for added security.
            </small>
          </div>
          <VerificationForm
            otp={otp}
            setOtp={setOtp}
            isLoading={isLoading}
            handleSubmit={handleEmailVerification}
          />
        </div>
      )}
      {/* step 2 -> Setting up the authenicator */}
      {step === 'AuthenicatorSetup' && (
        <div
          style={{ maxWidth: '500px' }}
          className='qr-code-display card-body'
        >
          <h5 className='text-center mb-3'>Set Up Your Authenticator</h5>
          <p className='text-center'>
            Scan the QR code below with your authenticator app:
          </p>
          <div className='text-center'>
            <img
              src={`data:image/png;base64,${btoa(qrCode)}`}
              alt='QR Code'
              style={{ width: '150px', height: '150px' }} // Smaller dimensions
            />
          </div>
          {manualKey && (
            <p className='text-center mt-3'>
              Or manually enter this key: <strong>{manualKey}</strong>
            </p>
          )}

          <div className=' alert alert-info text-center'>
            <small>
              To ensure your authenticator is properly configured, please
              retrieve the code from your authenticator app and enter it below.{' '}
              <br />
              <br />
              This step verifies the setup and secures your account. <br />
              <br />
              Once verified, you will be redirected to the login page, where you
              can use your authenticator code to log in.
            </small>
          </div>

          <VerificationForm
            otp={authCode}
            setOtp={setAuthCode}
            isLoading={isVerifying}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
      <div className='text-center mt-4'>
        <button className='btn btn-secondary' onClick={() => onDone()}>
          Cancel
        </button>
      </div>
      {error && (
        <div className='alert alert-danger text-center'>
          {renderErrors(error)}
        </div>
      )}
    </div>
  );
};

export default QrCodeDisplay;
