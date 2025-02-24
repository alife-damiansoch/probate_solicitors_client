import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import {
  fetchData,
  postData,
  deleteData,
  patchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import Cookies from 'js-cookie';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';
import { useEffect, useState } from 'react';

const Solicitors = () => {
  const token = Cookies.get('auth_token');
  const [errors, setErrors] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [solicitors, setSolicitors] = useState([]);
  const [editMode, setEditMode] = useState(null); // Changed to null to represent no field in edit mode
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isAddingSolicitor, setIsAddingSolicitor] = useState(false);
  const [solicitorAddedMessage, setSolicitorAddedMessage] = useState('');

  const [newSolicitor, setNewSolicitor] = useState({
    title: '',
    first_name: '',
    last_name: '',
    own_email: '',
    own_phone_number: '',
  });

  const TITLE_CHOICES = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
  ];

  useEffect(() => {
    const fetchSolicitors = async () => {
      setIsLoading(true);
      if (token) {
        const endpoint = `/api/applications/solicitors/`;
        const response = await fetchData(token, endpoint);
        if (response.status === 200) {
          setSolicitors(response.data);
          setIsLoading(false);
        } else {
          setErrors(response.data);
          setIsLoading(false);
        }
      }
    };

    fetchSolicitors();
  }, [token, refresh]);

  const handleNewSolicitorChange = (e, field) => {
    const value = e.target.value;
    setNewSolicitor({
      ...newSolicitor,
      [field]: value,
    });
  };

  const addSolicitor = async () => {
    setErrors(null);
    setIsError(false);
    if (!isSolicitorFormValid) return;

    const endpoint = `/api/applications/solicitors/`;
    setIsAddingSolicitor(true);
    const response = await postData(token, endpoint, newSolicitor);
    if (response.status === 201) {
      setSolicitors([...solicitors, response.data]);
      setNewSolicitor({
        title: '',
        first_name: '',
        last_name: '',
        own_email: '',
        own_phone_number: '',
      });
      setIsError(false);
      setIsAddingSolicitor(false);
      setSolicitorAddedMessage([
        'Solicitor has been successfully added.',
        ' To continue with the application, click the back icon above.',
        'If you need to add more solicitors, you may do so before proceeding.',
      ]);
      setTimeout(() => {
        setSolicitorAddedMessage('');
      }, 8000);
      window.scrollTo(0, 0);
    } else {
      setErrors(response.data);
      setIsError(true);
      setIsAddingSolicitor(false);
      window.scrollTo(0, 0);
    }
  };

  const handleListChange = (e, index, field) => {
    const updatedSolicitors = [...solicitors];
    updatedSolicitors[index][field] = e.target.value;
    setSolicitors(updatedSolicitors);
  };

  const toggleEditMode = (field) => {
    // If the field is already in edit mode, disable it; otherwise, enable it and disable others
    setEditMode((prev) => (prev === field ? null : field));
  };

  const submitChangesHandler = async (index) => {
    setIsAddingSolicitor(true);
    setErrors(null);
    setIsError(false);
    const solicitor = solicitors[index];
    const endpoint = `/api/applications/solicitors/${solicitor.id}/`;
    const response = await patchData(endpoint, solicitor);
    if (response.status === 200) {
      setRefresh(!refresh);
      setEditMode(null); // Exit edit mode after submitting changes
      setErrors(null);
      setIsError(false);
      setIsAddingSolicitor(false);
    } else {
      setRefresh(!refresh);
      setErrors(response.data);
      setIsError(true);
      setIsAddingSolicitor(false);
    }
  };

  const removeItem = async (index) => {
    setIsAddingSolicitor(true);
    const solicitor = solicitors[index];
    const endpoint = `/api/applications/solicitors/${solicitor.id}/`;
    const response = await deleteData(endpoint);
    if (response.status === 204) {
      setRefresh(!refresh);
      setErrors(null);
      setIsError(false);
      setIsAddingSolicitor(false);
    } else {
      setErrors(response.data);
      setIsError(true);
      setIsAddingSolicitor(false);
    }
  };

  // Update form validation to only require certain fields
  const isSolicitorFormValid =
    newSolicitor.title && newSolicitor.first_name && newSolicitor.last_name;

  const getFieldClassName = (field, isRequired = false) => {
    // Add red border styling only to required fields when empty
    return `form-control form-control-sm ${
      isRequired &&
      !newSolicitor[field] &&
      Object.values(newSolicitor).some((value) => value !== '')
        ? 'border-1 border-danger'
        : ''
    }`;
  };

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className='mb-1'>
          <BackToApplicationsIcon backUrl={-1} />
          <div className='card mt-1 rounded shadow'>
            <div className='card-body'>
              <div className='card-header mb-3  rounded-top py-3 '>
                <h4 className='card-subtitle text-info-emphasis'>Solicitors</h4>
              </div>
              {errors && (
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
              {solicitorAddedMessage && (
                <div className='alert alert-success text-center'>
                  {renderErrors(solicitorAddedMessage)}
                </div>
              )}
              {solicitors.map((solicitor, index) => (
                <div
                  key={index}
                  className='mb-3 py-3 shadow rounded m-2 d-flex flex-wrap align-items-center justify-content-between'
                >
                  <div className='col-12 col-md-auto px-2'>
                    <label className='form-label col-12'>
                      Title:
                      <div className='input-group input-group-sm shadow'>
                        <select
                          className={`form-control ${
                            editMode === `solicitor_${index}_title` &&
                            'border border-danger'
                          }`}
                          value={solicitor.title}
                          onChange={(e) => handleListChange(e, index, 'title')}
                          disabled={editMode !== `solicitor_${index}_title`}
                        >
                          {TITLE_CHOICES.map((choice) => (
                            <option key={choice.value} value={choice.value}>
                              {choice.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type='button'
                          className='btn btn-dark'
                          onClick={() => {
                            if (editMode === `solicitor_${index}_title`)
                              submitChangesHandler(index);
                            toggleEditMode(`solicitor_${index}_title`);
                          }}
                          disabled={isAddingSolicitor}
                        >
                          {editMode === `solicitor_${index}_title` ? (
                            <FaSave size={20} color='red' />
                          ) : (
                            <FaEdit size={20} />
                          )}
                        </button>
                      </div>
                    </label>
                  </div>
                  <div className='col-12 col-md-auto px-2'>
                    <label className='form-label col-12'>
                      First Name:
                      <div className='input-group input-group-sm shadow'>
                        <input
                          type='text'
                          className={`form-control ${
                            editMode === `solicitor_${index}_first_name` &&
                            'border border-danger'
                          }`}
                          value={solicitor.first_name}
                          onChange={(e) =>
                            handleListChange(e, index, 'first_name')
                          }
                          readOnly={
                            editMode !== `solicitor_${index}_first_name`
                          }
                        />
                        <button
                          type='button'
                          className='btn btn-dark'
                          onClick={() => {
                            if (editMode === `solicitor_${index}_first_name`)
                              submitChangesHandler(index);
                            toggleEditMode(`solicitor_${index}_first_name`);
                          }}
                        >
                          {editMode === `solicitor_${index}_first_name` ? (
                            <FaSave size={20} color='red' />
                          ) : (
                            <FaEdit size={20} />
                          )}
                        </button>
                      </div>
                    </label>
                  </div>
                  <div className='col-12 col-md-auto px-2'>
                    <label className='form-label col-12'>
                      Last Name:
                      <div className='input-group input-group-sm  shadow'>
                        <input
                          type='text'
                          className={`form-control ${
                            editMode === `solicitor_${index}_last_name` &&
                            'border border-danger'
                          }`}
                          value={solicitor.last_name}
                          onChange={(e) =>
                            handleListChange(e, index, 'last_name')
                          }
                          readOnly={editMode !== `solicitor_${index}_last_name`}
                        />
                        <button
                          type='button'
                          className='btn btn-dark'
                          onClick={() => {
                            if (editMode === `solicitor_${index}_last_name`)
                              submitChangesHandler(index);
                            toggleEditMode(`solicitor_${index}_last_name`);
                          }}
                        >
                          {editMode === `solicitor_${index}_last_name` ? (
                            <FaSave size={20} color='red' />
                          ) : (
                            <FaEdit size={20} />
                          )}
                        </button>
                      </div>
                    </label>
                  </div>
                  {/* <div className='col-12 col-md-auto px-2'>
                    <label className='form-label col-12'>
                      Email:
                      <div className='input-group input-group-sm  shadow'>
                        <input
                          type='text'
                          className='form-control'
                          value={solicitor.own_email ? solicitor.own_email : ''}
                          onChange={(e) =>
                            handleListChange(e, index, 'own_email')
                          }
                          readOnly={editMode !== `solicitor_${index}_own_email`}
                        />
                        <button
                          type='button'
                          className='btn btn-dark'
                          onClick={() => {
                            if (editMode === `solicitor_${index}_own_email`)
                              submitChangesHandler(index);
                            toggleEditMode(`solicitor_${index}_own_email`);
                          }}
                        >
                          {editMode === `solicitor_${index}_own_email` ? (
                            <FaSave size={20} color='red' />
                          ) : (
                            <FaEdit size={20} />
                          )}
                        </button>
                      </div>
                    </label>
                  </div>
                  <div className='col-12 col-md-auto px-2'>
                    <label className='form-label col-12'>Phone Number:</label>
                    <div className='input-group input-group-sm  shadow'>
                      <input
                        type='text'
                        className='form-control'
                        value={
                          solicitor.own_phone_number
                            ? solicitor.own_phone_number
                            : ''
                        }
                        onChange={(e) =>
                          handleListChange(e, index, 'own_phone_number')
                        }
                        readOnly={
                          editMode !== `solicitor_${index}_own_phone_number`
                        }
                      />
                      <button
                        type='button'
                        className='btn btn-dark'
                        onClick={() => {
                          if (
                            editMode === `solicitor_${index}_own_phone_number`
                          )
                            submitChangesHandler(index);
                          toggleEditMode(`solicitor_${index}_own_phone_number`);
                        }}
                      >
                        {editMode === `solicitor_${index}_own_phone_number` ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                  </div> */}
                  <div className='col-12 col-md-auto my-auto text-center'>
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-danger mt-2 border-0'
                      onClick={() => removeItem(index)}
                      disabled={isAddingSolicitor}
                    >
                      <FaTrash size={15} className=' icon-shadow' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {isAddingSolicitor && <LoadingComponent message='Updating...' />}
          </div>
          <hr />
          {/* Add New Solicitor Form */}
          <div className='card col-md-5 rounded border border-3 border-warning mx-auto shadow mb-3'>
            <div className='card-body mx-auto'>
              <h4 className='card-subtitle text-warning-emthasis my-2'>
                Add Solicitor
              </h4>
              <div className='row mb-3'>
                <div className='col-12 mx-auto'>
                  <label className='form-label col-12'>
                    Title:
                    <select
                      className={`shadow ${getFieldClassName('title', true)}`} // Pass `true` for required fields
                      value={newSolicitor.title}
                      onChange={(e) => handleNewSolicitorChange(e, 'title')}
                    >
                      <option value=''>Select Title</option>
                      {TITLE_CHOICES.map((choice) => (
                        <option key={choice.value} value={choice.value}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className='col-12'>
                  <label className='form-label col-12'>
                    First Name:
                    <input
                      type='text'
                      className={`shadow ${getFieldClassName(
                        'first_name',
                        true
                      )}`} // Pass `true` for required fields
                      value={newSolicitor.first_name}
                      onChange={(e) =>
                        handleNewSolicitorChange(e, 'first_name')
                      }
                    />
                  </label>
                </div>
                <div className='col-12 '>
                  <label className='form-label col-12'>
                    Last Name:
                    <input
                      type='text'
                      className={`shadow ${getFieldClassName(
                        'last_name',
                        true
                      )}`} // Pass `true` for required fields
                      value={newSolicitor.last_name}
                      onChange={(e) => handleNewSolicitorChange(e, 'last_name')}
                    />
                  </label>
                </div>
                {/* <div className='col-12 '>
                  <label className='form-label col-12'>
                    Email:
                    <sub> (not required)</sub>
                    <input
                      type='text'
                      className={`shadow ${getFieldClassName('own_email')}`} // Optional field
                      value={newSolicitor.own_email}
                      onChange={(e) => handleNewSolicitorChange(e, 'own_email')}
                    />
                  </label>
                </div> */}

                {/* <div className='col-12'>
                  <label className='form-label col-12'>
                    Phone Number:<sub> (not required)</sub>
                    <input
                      type='text'
                      className={`shadow ${getFieldClassName(
                        'own_phone_number'
                      )}`} // Optional field
                      value={newSolicitor.own_phone_number}
                      onChange={(e) =>
                        handleNewSolicitorChange(e, 'own_phone_number')
                      }
                    />
                    <div className='text-center'>
                      <sub id='phoneHelp' className='form-text text-info'>
                        Please provide your phone number in international format
                        starting with
                        <strong> +[country code]</strong> followed by the full
                        number (no spaces or special characters). <br />
                        Example: <strong>+447911123456</strong> for the UK or{' '}
                        <strong>+353871234567</strong> for Ireland.
                      </sub>
                    </div>
                  </label>
                </div> */}
              </div>
              <div className='  m-2'>
                <div className='row my-auto text-center text-md-end'>
                  {!isAddingSolicitor ? (
                    <button
                      type='button'
                      className='btn btn-dark mb-2 shadow'
                      onClick={addSolicitor}
                      disabled={!isSolicitorFormValid} // Button only enabled if required fields are filled
                    >
                      <FaSave
                        size={20}
                        color={isSolicitorFormValid ? 'red' : undefined}
                      />
                    </button>
                  ) : (
                    <LoadingComponent message='Updating solicitors...' />
                  )}

                  {/* <div className=' card-footer text-warning text-center'>
                    Email and phone number are optional fields. <br />
                    If they are not provided, the default contact details from
                    the firm will be used.
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Solicitors;
