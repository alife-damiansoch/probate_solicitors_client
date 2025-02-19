import React, { useRef } from 'react';

const VerificationForm = ({ otp, setOtp, isLoading, handleSubmit }) => {
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      // Allow only digits
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next field if a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(paste)) {
      const newOtp = paste.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const isSubmitDisabled = otp.some((digit) => digit === '');

  return (
    <form onSubmit={handleSubmit} onPaste={handlePaste}>
      <div className='d-flex justify-content-between my-4'>
        {otp.map((digit, index) => (
          <input
            key={index}
            type='text'
            maxLength='1'
            className='form-control mx-1 text-center m-0 p-2 rounded border-2 border-info'
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </div>

      <button
        type='submit'
        className='btn btn-outline-success w-100'
        disabled={isSubmitDisabled || isLoading}
      >
        Submit
      </button>
    </form>
  );
};

export default VerificationForm;
