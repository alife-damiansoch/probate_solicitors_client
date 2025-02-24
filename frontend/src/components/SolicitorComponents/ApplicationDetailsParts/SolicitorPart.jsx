import Cookies from 'js-cookie';
import {
  fetchData,
  patchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../GenericComponents/LoadingComponent';

const SolicitorPart = ({
  solicitor_id,
  application_id,
  refresh,
  setRefresh,
  highlitedSectionId,
}) => {
  const token = Cookies.get('auth_token');
  const [errors, setErrors] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [solicitors, setSolicitors] = useState([]);
  const [assignedSolicitor, setAssignedSolicitor] = useState(null);
  const [isUpdatingSolicitorAssigned, setIsUpdatingSolicitorAssigned] =
    useState(false);

  // Fetch all solicitors for the logged-in user
  useEffect(() => {
    const fetchSolicitors = async () => {
      setIsLoading(true);
      if (token) {
        const endpoint = `/api/applications/solicitors/`;
        try {
          const response = await fetchData(token, endpoint);

          if (response.status === 200) {
            setSolicitors(response.data);
            setIsError(false);
          } else {
            setErrors(response.data);
            setIsError(true);
          }
        } catch (error) {
          console.error('Error fetching solicitors:', error);
          setErrors('An error occurred while fetching solicitors.');
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSolicitors();
  }, [token, refresh]); // Ensure `refresh` is a dependency for re-fetching data

  // Setup selected Solicitor if any is selected
  useEffect(() => {
    if (solicitor_id && solicitors.length > 0) {
      setIsLoading(true);
      const selectedSolicitor = solicitors.find(
        (solicitor) => solicitor.id === solicitor_id
      );

      setAssignedSolicitor(selectedSolicitor || null);
      setIsLoading(false);
    }
  }, [solicitor_id, solicitors]);

  const updateSelectedSolicitor = async (solicitor_id) => {
    const data = {
      solicitor: solicitor_id,
    };

    try {
      setIsUpdatingSolicitorAssigned(true);
      const endpoint = `/api/applications/solicitor_applications/${application_id}/`;
      const response = await patchData(endpoint, data);
      if (response.status !== 200) {
        setIsError(true);
        setErrors(response.data);
        setIsUpdatingSolicitorAssigned(false);
      } else {
        setIsError(false);
        setRefresh(!refresh); // Trigger a refresh to fetch updated data
        setErrors({ Solicitor: 'updated' });
        setIsUpdatingSolicitorAssigned(false);
        setTimeout(() => {
          setErrors('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      setIsError(true);
      setIsUpdatingSolicitorAssigned(false);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors(error.message);
      }
    }
  };

  return (
    <div
      className={`card my-2 rounded   shadow ${
        highlitedSectionId === 'Solicitor Part' && 'highlited_section'
      }`}
      id='Solicitor Part'
    >
      <div className='card-header rounded-top'>
        <h4 className=' card-subtitle text-info-emphasis'>
          Assigned Solicitor
        </h4>
      </div>
      {isUpdatingSolicitorAssigned ? (
        <LoadingComponent message='Updating solicitors...' />
      ) : (
        <>
          {!assignedSolicitor && (
            <div className='row mt-3'>
              <div className=' alert alert-danger col-12 col-md-6 mx-auto text-center'>
                <p>Please select a solicitor from the list.</p>
                <p>
                  {' '}
                  If the desired solicitor is not listed, click &#39;Add or Edit
                  Solicitor&#39; to add a new solicitor.
                </p>
              </div>
            </div>
          )}
          <div className='card-body'>
            {isLoading ? ( // Show loading spinner or message when data is loading
              <LoadingComponent message='Loading solicitors...' />
            ) : (
              <>
                <div className='row mb-3'>
                  <div className='col-md-6 '>
                    <label htmlFor='solicitor-select' className='form-label'>
                      Assigned Solicitor:
                    </label>
                    {solicitors.length === 0 ? (
                      <div className='alert alert-warning'>
                        <p>
                          No solicitors have been created for this firm. Please
                          create them by clicking the &#39;ADD OR EDIT
                          SOLICITORS&#39; button.
                        </p>
                      </div>
                    ) : (
                      <select
                        id='solicitor-select'
                        className={`form-select form-select-sm shadow ${
                          !assignedSolicitor ? 'bg-danger-subtle' : ''
                        }`}
                        onChange={(e) =>
                          updateSelectedSolicitor(e.target.value)
                        }
                        value={assignedSolicitor ? assignedSolicitor.id : ''}
                      >
                        <option value='' disabled>
                          {assignedSolicitor
                            ? `${assignedSolicitor.title} ${assignedSolicitor.first_name} ${assignedSolicitor.last_name}`
                            : 'Select assigned solicitor'}
                        </option>
                        {solicitors.map((solicitor) => (
                          <option
                            key={solicitor.id}
                            value={solicitor.id}
                            className={
                              solicitor.id === solicitor_id
                                ? 'text-bg-info'
                                : ''
                            }
                          >
                            {solicitor.title} {solicitor.first_name}{' '}
                            {solicitor.last_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className='col-md-6 mt-4 text-center mt-md-auto'>
                    <div className='col-12'>
                      <Link
                        className='btn btn-sm btn-primary shadow'
                        to={`/solicitors`}
                      >
                        Add or edit solicitors
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isError &&
              errors && ( // Display error messages if any
                <div
                  className={`col-8 mx-auto alert text-center ${
                    isError
                      ? 'alert-warning text-danger'
                      : 'alert-success text-success'
                  }`}
                  role='alert'
                >
                  {renderErrors(errors)}
                </div>
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default SolicitorPart;
