import Cookies from 'js-cookie';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import { postData } from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';

import ApplicantsPart from './FormParts/ApplicantsPart';
import ApplicationPart from './FormParts/ApplicationPart';

export default function NewApplicationForm() {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token.access);
  const navigate = useNavigate();

  // Get country from cookies to set proper defaults
  const countrySolicitors = Cookies.get('country_solicitors') || 'IE';
  const countryName = countrySolicitors === 'IE' ? 'Ireland' : 'United Kingdom';

  const [formData, setFormData] = useState({
    amount: '',
    term: 12,
    deceased: { first_name: '', last_name: '' },
    dispute: { details: '' },
    applicants: [
      {
        title: 'Mr',
        first_name: '',
        last_name: '',
        pps_number: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        county: '',
        postal_code: '',
        country: countryName,
        date_of_birth: '',
        email: '',
        phone_number: '',
      },
    ],
    was_will_prepared_by_solicitor: null,
  });

  const idNumberArray = JSON.parse(Cookies.get('id_number'));

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setLoading(true);

    const data = { ...formData };
    if (data.dispute.details.trim() === '') {
      data.dispute.details = 'No dispute';
    }

    try {
      const endpoint = `/api/applications/solicitor_applications/`;
      const response = await postData(token, endpoint, data);
      if (response.status === 201) {
        setIsError(false);
        setMessage([{ value: response.statusText }]);
        const new_app_id = response.data.id;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        navigate(`/applications/${new_app_id}`);
      } else {
        setIsError(true);
        setMessage(response.data);
        setLoading(false);
      }
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        setMessage(renderErrors(error.response.data));
      } else {
        setMessage(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className='card mt-5' style={{ marginBottom: '200px' }}>
      <div className='card-header text-center'>
        <div className='card-title'>
          <h1>Create New Application</h1>
        </div>
      </div>
      <div className='card-body'>
        <form onSubmit={submitHandler}>
          <ApplicationPart formData={formData} setFormData={setFormData} />
          <ApplicantsPart
            applicants={formData.applicants}
            setFormData={setFormData}
            idNumberArray={idNumberArray}
          />
          <div className='row'>
            <button
              type='submit'
              className='btn btn-info my-2'
              disabled={loading}
            >
              {loading ? (
                <LoadingComponent message='Adding application...' />
              ) : (
                'Create Application'
              )}
            </button>
            {message && (
              <div
                className={`alert text-center ${
                  isError ? 'alert-danger' : 'alert-success'
                }`}
                role='alert'
              >
                {renderErrors(message)}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
