import { useEffect, useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { patchData } from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import DocumentsUpload from '../Applications/DocumentsUpload';
import ApplicantsPart from './ApplicantsPart';
import EstatesPart from './EstatesPart';
import SolicitorPart from './SolicitorPart';

import Cookies from 'js-cookie';
import LoadingComponent from '../../GenericComponents/LoadingComponent';

const RequiredDetailsPart = ({
  application,
  setApplication,
  id,
  refresh,
  setRefresh,
  highlitedSectionId,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [triggerHandleChange, setTriggerChandleChange] = useState(false);
  const [originalApplication, setOriginalApplication] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const currency_sign = Cookies.get('currency_sign');

  // Initialize the original application state when the component mounts
  useEffect(() => {
    if (application) {
      setOriginalApplication(JSON.parse(JSON.stringify(application))); // Deep copy of the application state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFilteredApplicationData = (application) => {
    const {
      amount,
      term,
      deceased,
      dispute,
      applicants,
      was_will_prepared_by_solicitor,
    } = application;

    return {
      amount,
      term,
      deceased: {
        first_name: deceased.first_name,
        last_name: deceased.last_name,
      },
      dispute: {
        details: dispute.details,
      },
      applicants: applicants.map(
        ({ title, first_name, last_name, pps_number }) => ({
          title,
          first_name,
          last_name,
          pps_number,
        })
      ),
      was_will_prepared_by_solicitor, // Include this field
    };
  };

  const handleChange = (e, field) => {
    setApplication({
      ...application,
      [field]: e.target.value,
    });
  };

  const handleNestedChange = (e, parentField, field) => {
    setApplication({
      ...application,
      [parentField]: {
        ...application[parentField],
        [field]: e.target.value,
      },
    });
  };

  const handleListChange = (e, index, listName, field) => {
    const newList = application[listName].slice();
    newList[index][field] = e.target.value;
    setApplication({
      ...application,
      [listName]: newList,
    });
  };

  const addItem = (listName, newItem) => {
    setApplication({
      ...application,
      [listName]: [...application[listName], newItem],
    });
  };

  const removeItem = (listName, index) => {
    const newList = application[listName].slice();
    newList.splice(index, 1);
    console.log(newList);
    setApplication({
      ...application,
      [listName]: newList,
    });
    setTriggerChandleChange(!triggerHandleChange);
  };

  const toggleEditMode = (field) => {
    setEditMode({
      [field]: !editMode[field], // Toggle the current field
    });
  };

  const submitChangesHandler = async () => {
    setErrorMessage('');
    setIsError(false);

    if (application && originalApplication) {
      if (JSON.stringify(application) === JSON.stringify(originalApplication)) {
        console.log('No changes detected, skipping update.');
        return;
      }

      // Ensure dispute.details is not empty
      const filteredApplication = getFilteredApplicationData(application);
      if (filteredApplication.dispute.details.trim() === '') {
        filteredApplication.dispute.details = 'No dispute';
      }
      console.log('Application Data:', application);
      console.log('Filtered Application Data:', filteredApplication);

      try {
        setIsUpdating(true);
        const endpoint = `/api/applications/solicitor_applications/${id}/`;
        const response = await patchData(endpoint, filteredApplication);
        if (response.status !== 200) {
          setIsError(true);
          setErrorMessage(response.data);
        } else {
          // console.log(response);
          setErrorMessage({ Application: 'updated' });
          setIsError(false);

          setTimeout(function () {
            setErrorMessage('');
          }, 3000);
        }
      } catch (error) {
        console.error('Error updating application:', error);
        setIsError(true);

        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage(error.message);
        }
      } finally {
        setIsUpdating(false);
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setRefresh(!refresh);
      }
    }
  };

  useEffect(() => {
    submitChangesHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerHandleChange]);

  return (
    <>
      {/* Status Messages */}
      {errorMessage && (
        <div
          className={`alert border-0 text-center mx-auto mb-4 ${
            isError ? 'alert-danger' : 'alert-success'
          }`}
          style={{
            maxWidth: '600px',
            borderRadius: '12px',
            boxShadow: isError
              ? '0 4px 6px rgba(239, 68, 68, 0.1)'
              : '0 4px 6px rgba(34, 197, 94, 0.1)',
            backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
            color: isError ? '#dc2626' : '#16a34a',
            fontWeight: '500',
          }}
          role='alert'
        >
          <div className='d-flex align-items-center justify-content-center'>
            <i
              className={`fas ${
                isError ? 'fa-exclamation-triangle' : 'fa-check-circle'
              } me-2`}
            ></i>
            {renderErrors(errorMessage)}
          </div>
        </div>
      )}

      {isUpdating && <LoadingComponent message='Saving changes ...' />}

      {/* Basic Details Section */}
      <div
        className={`mb-4 ${
          highlitedSectionId === 'Basic Details' && 'highlited_section'
        }`}
        id='Basic Details'
        style={{
          borderRadius: '16px',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className='card-header border-0 d-flex align-items-center'
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            padding: '1.5rem',
          }}
        >
          <div
            className='rounded-circle d-flex align-items-center justify-content-center me-3'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <i className='fas fa-info-circle'></i>
          </div>
          <h4 className='mb-0 fw-semibold'>Basic Details</h4>
        </div>

        {/* Content */}
        <div className='card-body' style={{ padding: '2rem' }}>
          <form>
            {/* Amount and Term Row */}
            <div className='row g-4 mb-4'>
              <div className='col-md-6'>
                <label className='form-label fw-semibold text-slate-700 mb-2'>
                  <i className='fas fa-euro-sign me-2 text-success'></i>
                  Amount
                </label>
                <div
                  className='input-group'
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <input
                    type='text'
                    className={`form-control border-0 ${
                      editMode.amount ? 'border-end border-danger border-2' : ''
                    }`}
                    style={{
                      backgroundColor: editMode.amount ? '#fef2f2' : '#f8fafc',
                      fontSize: '1rem',
                      fontWeight: '500',
                      padding: '0.75rem 1rem',
                    }}
                    value={
                      editMode.amount
                        ? application.amount
                        : `${currency_sign} ${application.amount}`
                    }
                    onChange={(e) => handleChange(e, 'amount')}
                    readOnly={!editMode.amount}
                  />
                  <button
                    type='button'
                    className='btn'
                    style={{
                      backgroundColor: editMode.amount ? '#ef4444' : '#1f2937',
                      color: 'white',
                      border: 'none',
                      padding: '0 1rem',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => {
                      if (editMode.amount) submitChangesHandler();
                      toggleEditMode('amount');
                    }}
                    disabled={application.approved || application.is_rejected}
                    onMouseOver={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {editMode.amount ? (
                      <FaSave size={16} />
                    ) : (
                      <FaEdit size={16} />
                    )}
                  </button>
                </div>
                {(application.amount === '' ||
                  isNaN(parseFloat(application.amount)) ||
                  parseFloat(application.amount) <= 0) && (
                  <div className='text-danger mt-2 small fw-medium'>
                    <i className='fas fa-exclamation-circle me-1'></i>
                    Please enter a valid amount greater than zero.
                  </div>
                )}
              </div>

              <div className='col-md-6'>
                <label className='form-label fw-semibold text-slate-700 mb-2'>
                  <i className='fas fa-calendar-alt me-2 text-blue-500'></i>
                  Initial Term
                </label>
                <div
                  className='input-group'
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <input
                    type='text'
                    className={`form-control border-0 ${
                      editMode.term ? 'border-end border-danger border-2' : ''
                    }`}
                    style={{
                      backgroundColor: '#f1f5f9',
                      fontSize: '1rem',
                      fontWeight: '500',
                      padding: '0.75rem 1rem',
                    }}
                    value={
                      editMode.term
                        ? application.term
                        : `${application.term} months`
                    }
                    onChange={(e) => handleChange(e, 'term')}
                    readOnly={!editMode.term}
                  />
                  <button
                    type='button'
                    className='btn'
                    style={{
                      backgroundColor: '#94a3b8',
                      color: 'white',
                      border: 'none',
                      padding: '0 1rem',
                      cursor: 'not-allowed',
                    }}
                    disabled
                  >
                    <FaEdit size={16} />
                  </button>
                </div>
                {(application.term === '' ||
                  isNaN(parseFloat(application.term)) ||
                  parseFloat(application.term) <= 0 ||
                  parseFloat(application.term) > 36) && (
                  <div className='text-danger mt-2 small fw-medium'>
                    <i className='fas fa-exclamation-circle me-1'></i>
                    Term must be between 1 and 36 months.
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div
              className='my-4'
              style={{
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
              }}
            ></div>

            {/* Deceased Details Row */}
            <div className='row g-4 mb-4'>
              <div className='col-md-6'>
                <label className='form-label fw-semibold text-slate-700 mb-2'>
                  <i className='fas fa-user me-2 text-purple-500'></i>
                  Deceased First Name
                </label>
                <div
                  className='input-group'
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <input
                    type='text'
                    className={`form-control border-0 ${
                      editMode.deceased_first_name
                        ? 'border-end border-danger border-2'
                        : ''
                    }`}
                    style={{
                      backgroundColor: editMode.deceased_first_name
                        ? '#fef2f2'
                        : '#f8fafc',
                      fontSize: '1rem',
                      fontWeight: '500',
                      padding: '0.75rem 1rem',
                    }}
                    value={application.deceased.first_name}
                    onChange={(e) =>
                      handleNestedChange(e, 'deceased', 'first_name')
                    }
                    readOnly={!editMode.deceased_first_name}
                  />
                  <button
                    type='button'
                    className='btn'
                    style={{
                      backgroundColor: editMode.deceased_first_name
                        ? '#ef4444'
                        : '#1f2937',
                      color: 'white',
                      border: 'none',
                      padding: '0 1rem',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => {
                      if (editMode.deceased_first_name) submitChangesHandler();
                      toggleEditMode('deceased_first_name');
                    }}
                    disabled={application.approved || application.is_rejected}
                    onMouseOver={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {editMode.deceased_first_name ? (
                      <FaSave size={16} />
                    ) : (
                      <FaEdit size={16} />
                    )}
                  </button>
                </div>
                {(!application.deceased.first_name ||
                  application.deceased.first_name === '') && (
                  <div className='text-danger mt-2 small fw-medium'>
                    <i className='fas fa-exclamation-circle me-1'></i>
                    Deceased's first name is required.
                  </div>
                )}
              </div>

              <div className='col-md-6'>
                <label className='form-label fw-semibold text-slate-700 mb-2'>
                  <i className='fas fa-user me-2 text-purple-500'></i>
                  Deceased Last Name
                </label>
                <div
                  className='input-group'
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <input
                    type='text'
                    className={`form-control border-0 ${
                      editMode.deceased_last_name
                        ? 'border-end border-danger border-2'
                        : ''
                    }`}
                    style={{
                      backgroundColor: editMode.deceased_last_name
                        ? '#fef2f2'
                        : '#f8fafc',
                      fontSize: '1rem',
                      fontWeight: '500',
                      padding: '0.75rem 1rem',
                    }}
                    value={application.deceased.last_name}
                    onChange={(e) =>
                      handleNestedChange(e, 'deceased', 'last_name')
                    }
                    readOnly={!editMode.deceased_last_name}
                  />
                  <button
                    type='button'
                    className='btn'
                    style={{
                      backgroundColor: editMode.deceased_last_name
                        ? '#ef4444'
                        : '#1f2937',
                      color: 'white',
                      border: 'none',
                      padding: '0 1rem',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => {
                      if (editMode.deceased_last_name) submitChangesHandler();
                      toggleEditMode('deceased_last_name');
                    }}
                    disabled={application.approved || application.is_rejected}
                    onMouseOver={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {editMode.deceased_last_name ? (
                      <FaSave size={16} />
                    ) : (
                      <FaEdit size={16} />
                    )}
                  </button>
                </div>
                {(!application.deceased.last_name ||
                  application.deceased.last_name === '') && (
                  <div className='text-danger mt-2 small fw-medium'>
                    <i className='fas fa-exclamation-circle me-1'></i>
                    Deceased's last name is required.
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div
              className='my-4'
              style={{
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
              }}
            ></div>

            {/* Will Preparation Question */}
            <div className='mb-4'>
              <label className='form-label fw-semibold text-slate-700 mb-3'>
                <i className='fas fa-gavel me-2 text-amber-500'></i>
                Was this will professionally prepared by a solicitor?
              </label>
              <div
                className='d-flex gap-4 p-3 rounded-3'
                style={{ backgroundColor: '#f8fafc' }}
              >
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='was_will_prepared_by_solicitor'
                    id='will_prepared_yes'
                    value={true}
                    checked={!!application.was_will_prepared_by_solicitor}
                    onChange={() => {
                      setApplication({
                        ...application,
                        was_will_prepared_by_solicitor: true,
                      });
                      setTriggerChandleChange(!triggerHandleChange);
                    }}
                    disabled={application.approved || application.is_rejected}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <label
                    className='form-check-label fw-medium ms-2'
                    htmlFor='will_prepared_yes'
                    style={{ color: '#059669' }}
                  >
                    <i className='fas fa-check-circle me-1'></i>
                    Yes
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='was_will_prepared_by_solicitor'
                    id='will_prepared_no'
                    value={false}
                    checked={!application.was_will_prepared_by_solicitor}
                    onChange={() => {
                      setApplication({
                        ...application,
                        was_will_prepared_by_solicitor: false,
                      });
                      setTriggerChandleChange(!triggerHandleChange);
                    }}
                    disabled={application.approved || application.is_rejected}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <label
                    className='form-check-label fw-medium ms-2'
                    htmlFor='will_prepared_no'
                    style={{ color: '#dc2626' }}
                  >
                    <i className='fas fa-times-circle me-1'></i>
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              className='my-4'
              style={{
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
              }}
            ></div>

            {/* Dispute Details */}
            <div className='mb-4'>
              <label className='form-label fw-semibold text-slate-700 mb-2'>
                <i className='fas fa-exclamation-triangle me-2 text-orange-500'></i>
                Dispute Details
              </label>
              <div
                className='input-group'
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                }}
              >
                <textarea
                  className={`form-control border-0 ${
                    editMode.dispute_details
                      ? 'border-end border-danger border-2'
                      : ''
                  }`}
                  style={{
                    backgroundColor: editMode.dispute_details
                      ? '#fef2f2'
                      : '#f8fafc',
                    fontSize: '1rem',
                    fontWeight: '400',
                    padding: '1rem',
                    minHeight: '120px',
                    resize: 'vertical',
                  }}
                  value={
                    application.dispute.details === 'No dispute'
                      ? ''
                      : application.dispute.details
                  }
                  onChange={(e) => handleNestedChange(e, 'dispute', 'details')}
                  readOnly={!editMode.dispute_details}
                  placeholder={
                    editMode.dispute_details
                      ? "Describe any disputes or leave empty for 'No dispute'"
                      : ''
                  }
                />
                <button
                  type='button'
                  className='btn align-self-stretch'
                  style={{
                    backgroundColor: editMode.dispute_details
                      ? '#ef4444'
                      : '#1f2937',
                    color: 'white',
                    border: 'none',
                    padding: '1rem',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => {
                    if (editMode.dispute_details) submitChangesHandler();
                    toggleEditMode('dispute_details');
                  }}
                  disabled={application.approved || application.is_rejected}
                  onMouseOver={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {editMode.dispute_details ? (
                    <FaSave size={16} />
                  ) : (
                    <FaEdit size={16} />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sub-components */}
        <ApplicantsPart
          addItem={addItem}
          application={application}
          handleListChange={handleListChange}
          editMode={editMode}
          submitChangesHandler={submitChangesHandler}
          toggleEditMode={toggleEditMode}
          removeItem={removeItem}
          triggerHandleChange={triggerHandleChange}
          setTriggerChandleChange={setTriggerChandleChange}
        />
        <EstatesPart
          application={application}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </div>

      <SolicitorPart
        application_id={application.id}
        solicitor_id={application.solicitor}
        refresh={refresh}
        setRefresh={setRefresh}
        highlitedSectionId={highlitedSectionId}
      />
      <DocumentsUpload
        application={application}
        highlitedSectionId={highlitedSectionId}
      />
    </>
  );
};

export default RequiredDetailsPart;
