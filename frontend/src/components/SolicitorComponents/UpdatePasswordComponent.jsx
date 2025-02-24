import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import { useSelector } from 'react-redux';
import { patchData } from '../GenericFunctions/AxiosGenericFunctions';
import RedirectCountdown from '../GenericComponents/RedirectCountdown';
import { useState } from 'react';
import LoadingComponent from '../GenericComponents/LoadingComponent';

const UpdatePasswordComponent = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const token = useSelector((state) => state.auth.token.access);

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setErrors({ password: 'New passwords do not match' });
      return;
    }
    try {
      setIsSending(true);
      const res = await patchData(
        `/api/user/update_password/`,
        { old_password: oldPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setErrors(null); // Clear errors on successful submission
        alert('Password updated successfully!');
        setRedirect(true);
      } else {
        console.log(res);
        setErrors(res.data);
        setIsSending(false);
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setErrors(err.response.data || { error: 'An error occurred' });
      setIsSending(false);
    }
  };

  return (
    <div className='row my-5 mx-1'>
      <div className='card col-12 col-md-6 mx-auto shadow'>
        <div className='card-body'>
          <h2 className='card-title mb-4'>Update Password</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='oldPassword' className='form-label'>
                Old Password
              </label>
              <input
                type='password'
                className='form-control form-control-sm shadow'
                id='oldPassword'
                name='oldPassword'
                value={oldPassword}
                onChange={handleOldPasswordChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='newPassword' className='form-label'>
                New Password
              </label>
              <input
                type='password'
                className='form-control form-control-sm shadow'
                id='newPassword'
                name='newPassword'
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='confirmNewPassword' className='form-label'>
                Confirm New Password
              </label>
              <input
                type='password'
                className='form-control form-control-sm shadow'
                id='confirmNewPassword'
                name='confirmNewPassword'
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
                required
              />
            </div>
            {isSending ? (
              <LoadingComponent message='Updating password...' />
            ) : (
              <button
                type='submit'
                className='btn btn-outline-primary btn-sm shadow'
                disabled={isSending}
              >
                Update Password
              </button>
            )}
          </form>
          {errors && (
            <div className=' alert text-center alert-danger mt-2'>
              {renderErrors(errors)}
            </div>
          )}

          {redirect && (
            <RedirectCountdown
              message='Redirecting to login'
              redirectPath='/login'
              countdownTime={3}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordComponent;
