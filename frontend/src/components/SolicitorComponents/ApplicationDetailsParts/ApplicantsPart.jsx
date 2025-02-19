import { useState } from 'react';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import Cookies from 'js-cookie';

const ApplicantsPart = ({
  addItem,
  application,
  handleListChange,
  editMode,
  submitChangesHandler,
  toggleEditMode,
  removeItem,
  triggerHandleChange,
  setTriggerChandleChange,
}) => {
  const [newApplicant, setNewApplicant] = useState({
    title: '',
    first_name: '',
    last_name: '',
    pps_number: '',
  });

  const TITLE_CHOICES = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
  ];

  const idNumberArray = JSON.parse(Cookies.get('id_number'));

  const handleNewApplicantChange = (e, field) => {
    const value = e.target.value;
    setNewApplicant({
      ...newApplicant,
      [field]: value,
    });
  };

  const addApplicant = () => {
    addItem('applicants', newApplicant);
    setNewApplicant({
      title: '',
      first_name: '',
      last_name: '',
      pps_number: '',
    });
    setTriggerChandleChange(!triggerHandleChange);
  };

  const isAnyFieldFilled = Object.values(newApplicant).some(
    (value) => value !== ''
  );

  // Validate forms
  const isApplicantFormValid =
    newApplicant.title &&
    newApplicant.first_name &&
    newApplicant.last_name &&
    newApplicant.pps_number;

  const getFieldClassName = (field) => {
    return `form-control form-control-sm ${
      !newApplicant[field] && isAnyFieldFilled ? 'border-1 border-danger' : ''
    }`;
  };

  return (
    <>
      {application ? (
        <div className='card mt-3  mx-md-3 rounded border-0'>
          <div className='card-header mb-2  rounded-top py-3 '>
            <h4 className='card-subtitle text-info-emphasis'>Applicants</h4>
          </div>
          {(!application.applicants || application.applicants.length === 0) && (
            <div className='row mt-3'>
              <div className=' alert alert-danger col-auto mx-auto'>
                Please provide details for at least one applicant.
              </div>
            </div>
          )}
          <div className='card-body p-0 p-md-3'>
            {application.applicants.map((applicant, index) => (
              <div
                key={index}
                className='row mb-3  py-2 rounded m-1 d-flex align-items-center shadow'
              >
                <div className='col-md-2'>
                  <label className='form-label col-12'>Title:</label>
                  <div className='input-group input-group-sm shadow'>
                    <select
                      className={`form-control ${
                        editMode[`applicant_${index}_title`] &&
                        ' border border-danger'
                      }`}
                      value={applicant.title}
                      onChange={(e) =>
                        handleListChange(e, index, 'applicants', 'title')
                      }
                      disabled={!editMode[`applicant_${index}_title`]}
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
                        if (editMode[`applicant_${index}_title`])
                          submitChangesHandler();
                        toggleEditMode(`applicant_${index}_title`);
                      }}
                      disabled={application.approved || application.is_rejected}
                    >
                      {editMode[`applicant_${index}_title`] ? (
                        <FaSave size={20} color='red' />
                      ) : (
                        <FaEdit size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <div className='col-md-3'>
                  <label className='form-label col-12'>First Name:</label>
                  <div className='input-group input-group-sm shadow'>
                    <input
                      type='text'
                      className={`form-control ${
                        editMode[`applicant_${index}_first_name`] &&
                        ' border border-danger'
                      }`}
                      value={applicant.first_name}
                      onChange={(e) =>
                        handleListChange(e, index, 'applicants', 'first_name')
                      }
                      readOnly={!editMode[`applicant_${index}_first_name`]}
                    />
                    <button
                      type='button'
                      className='btn  btn-dark'
                      onClick={() => {
                        if (editMode[`applicant_${index}_first_name`])
                          submitChangesHandler();
                        toggleEditMode(`applicant_${index}_first_name`);
                      }}
                      disabled={application.approved || application.is_rejected}
                    >
                      {editMode[`applicant_${index}_first_name`] ? (
                        <FaSave size={20} color='red' />
                      ) : (
                        <FaEdit size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <div className='col-md-3'>
                  <label className='form-label col-12'>Last Name:</label>
                  <div className='input-group input-group-sm shadow'>
                    <input
                      type='text'
                      className={`form-control ${
                        editMode[`applicant_${index}_last_name`] &&
                        ' border border-danger'
                      }`}
                      value={applicant.last_name}
                      onChange={(e) =>
                        handleListChange(e, index, 'applicants', 'last_name')
                      }
                      readOnly={!editMode[`applicant_${index}_last_name`]}
                    />
                    <button
                      type='button'
                      className='btn  btn-dark'
                      onClick={() => {
                        if (editMode[`applicant_${index}_last_name`])
                          submitChangesHandler();
                        toggleEditMode(`applicant_${index}_last_name`);
                      }}
                      disabled={application.approved || application.is_rejected}
                    >
                      {editMode[`applicant_${index}_last_name`] ? (
                        <FaSave size={20} color='red' />
                      ) : (
                        <FaEdit size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <div className='col-md-3'>
                  <label className='form-label col-12'>
                    {idNumberArray[0]} Number:
                  </label>
                  <div className='input-group input-group-sm shadow'>
                    <input
                      type='text'
                      className={`form-control ${
                        editMode[`applicant_${index}_pps_number`] &&
                        ' border border-danger'
                      } `}
                      value={applicant.pps_number}
                      onChange={(e) =>
                        handleListChange(e, index, 'applicants', 'pps_number')
                      }
                      readOnly={!editMode[`applicant_${index}_pps_number`]}
                    />
                    <button
                      type='button'
                      className='btn  btn-dark'
                      onClick={() => {
                        if (editMode[`applicant_${index}_pps_number`])
                          submitChangesHandler();
                        toggleEditMode(`applicant_${index}_pps_number`);
                      }}
                      disabled={application.approved || application.is_rejected}
                    >
                      {editMode[`applicant_${index}_pps_number`] ? (
                        <FaSave size={20} color='red' />
                      ) : (
                        <FaEdit size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <div className='col-md-1 col-12 my-auto text-end'>
                  <button
                    type='button'
                    className='btn btn-sm btn-outline-danger mt-2 border-0 icon-shadow'
                    onClick={() => removeItem('applicants', index)}
                    disabled={application.approved || application.is_rejected}
                  >
                    <FaTrash size={15} />
                  </button>
                </div>
              </div>
            ))}
            {/* Add New Applicant Form */}
            <hr />
            {!application.approved && !application.is_rejected && (
              <div className='row border border-3 border-warning rounded mx-1 pb-1 mx-md-5 shadow'>
                <div className='col-md-10  rounded border-0 '>
                  <div className='card-body px-0 mx-md-2'>
                    <h4 className='card-subtitle text-warning-emphasis'>
                      Add Applicant
                    </h4>

                    <div className='row mb-3'>
                      <div className='col-md-2'>
                        <label className='form-label col-12'>Title:</label>
                        <select
                          className={`shadow ${getFieldClassName('title')}`}
                          value={newApplicant.title}
                          onChange={(e) => handleNewApplicantChange(e, 'title')}
                        >
                          <option value=''>Select Title</option>
                          {TITLE_CHOICES.map((choice) => (
                            <option key={choice.value} value={choice.value}>
                              {choice.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='col-md-3'>
                        <label className='form-label col-12'>First Name:</label>
                        <input
                          type='text'
                          className={`shadow ${getFieldClassName(
                            'first_name'
                          )}`}
                          value={newApplicant.first_name}
                          onChange={(e) =>
                            handleNewApplicantChange(e, 'first_name')
                          }
                        />
                      </div>
                      <div className='col-md-3'>
                        <label className='form-label col-12'>Last Name:</label>
                        <input
                          type='text'
                          className={`shadow ${getFieldClassName('last_name')}`}
                          value={newApplicant.last_name}
                          onChange={(e) =>
                            handleNewApplicantChange(e, 'last_name')
                          }
                        />
                      </div>
                      <div className='col-md-3'>
                        <label className='form-label col-12'>
                          {idNumberArray[0]} Number:
                        </label>
                        <input
                          type='text'
                          className={`shadow ${getFieldClassName(
                            'pps_number'
                          )}`}
                          value={newApplicant.pps_number}
                          onChange={(e) =>
                            handleNewApplicantChange(e, 'pps_number')
                          }
                          placeholder={idNumberArray[1]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-md-2 my-auto text-end'>
                  <button
                    type='button'
                    className='btn btn-sm btn-dark me-0 shadow'
                    onClick={addApplicant}
                    disabled={!isApplicantFormValid}
                  >
                    <FaSave size={20} color={isApplicantFormValid && 'red'} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default ApplicantsPart;
