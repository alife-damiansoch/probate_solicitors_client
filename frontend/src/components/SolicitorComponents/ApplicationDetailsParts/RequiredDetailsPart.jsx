import { FaEdit, FaSave } from 'react-icons/fa';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import { useEffect, useState } from 'react';
import { patchData } from '../../GenericFunctions/AxiosGenericFunctions';
import ApplicantsPart from './ApplicantsPart';
import EstatesPart from './EstatesPart';
import SolicitorPart from './SolicitorPart';
import DocumentsUpload from '../Applications/DocumentsUpload';

import Cookies from 'js-cookie';

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

  const currency_sign = Cookies.get('currency_sign');

  // Initialize the original application state when the component mounts
  useEffect(() => {
    if (application) {
      setOriginalApplication(JSON.parse(JSON.stringify(application))); // Deep copy of the application state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFilteredApplicationData = (application) => {
    const { amount, term, deceased, dispute, applicants, estates } =
      application;

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
      estates: estates.map(({ description, value }) => ({
        description,
        value,
      })),
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

      try {
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
      }
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setRefresh(!refresh);
    }
  };
  useEffect(() => {
    submitChangesHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerHandleChange]);

  return (
    <>
      {errorMessage && (
        <div
          className={` col-8 mx-auto alert text-center ${
            isError ? 'alert-warning text-danger' : 'alert-success text-success'
          }`}
          role='alert'
        >
          {renderErrors(errorMessage)}
        </div>
      )}

      <div
        className={`card rounded  shadow pb-3 ${
          highlitedSectionId === 'Basic Details' && 'highlited_section'
        }`}
        id='Basic Details'
      >
        <div className='card-header  rounded-top'>
          <h4 className={` card-subtitle text-info-emphasis `}>
            Basic Details
          </h4>
        </div>
        <div className='card-body'>
          <form>
            <div className='card rounded  border-0'>
              <div className='card-body px-0 px-md-2'>
                <div className='row mb-3'>
                  <div className='col-12 col-md-6'>
                    <label className='form-label col-12'>Amount:</label>
                    <div className='input-group input-group-sm shadow mb-2'>
                      <input
                        type='text'
                        className={`form-control  ${
                          editMode.amount && ' border border-danger'
                        }`}
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
                        className='btn btn-dark'
                        onClick={() => {
                          if (editMode.amount) submitChangesHandler();
                          toggleEditMode('amount');
                        }}
                        disabled={
                          application.approved || application.is_rejected
                        }
                      >
                        {editMode.amount ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                    {(application.amount === '' ||
                      isNaN(parseFloat(application.amount)) ||
                      parseFloat(application.amount) <= 0) && (
                      <sup className='text-danger'>
                        Please enter a valid amount greater than zero.
                      </sup>
                    )}
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label col-12'>Term:</label>
                    <div className='input-group input-group-sm shadow mb-2'>
                      <input
                        type='text'
                        className={`form-control ${
                          editMode.term && ' border border-danger'
                        }`}
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
                        className='btn  btn-dark'
                        onClick={() => {
                          if (editMode.term) submitChangesHandler();
                          toggleEditMode('term');
                        }}
                        disabled={
                          application.approved || application.is_rejected
                        }
                      >
                        {editMode.term ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                    {(application.term === '' ||
                      isNaN(parseFloat(application.term)) ||
                      parseFloat(application.term) <= 0 ||
                      parseFloat(application.term) > 36) && (
                      <sup className='text-danger'>
                        Term must be a positive number of months, between 1 and
                        36.
                      </sup>
                    )}
                  </div>
                </div>
                <hr />
                <div className='row mb-3'>
                  <div className='col-md-6 '>
                    <label className='form-label col-12'>
                      Deceased First Name:
                    </label>
                    <div className='input-group input-group-sm shadow mb-2'>
                      <input
                        type='text'
                        className={`form-control ${
                          editMode.deceased_first_name &&
                          ' border border-danger'
                        }`}
                        value={application.deceased.first_name}
                        onChange={(e) =>
                          handleNestedChange(e, 'deceased', 'first_name')
                        }
                        readOnly={!editMode.deceased_first_name}
                      />
                      <button
                        type='button'
                        className='btn  btn-dark'
                        onClick={() => {
                          if (editMode.deceased_first_name)
                            submitChangesHandler();
                          toggleEditMode('deceased_first_name');
                        }}
                        disabled={
                          application.approved || application.is_rejected
                        }
                      >
                        {editMode.deceased_first_name ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                    {(!application.deceased.first_name ||
                      application.deceased.first_name === '') && (
                      <sup className='text-danger'>
                        Deceased&#39;s first name is required.
                      </sup>
                    )}
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label col-12'>
                      Deceased Last Name:
                    </label>
                    <div className='input-group input-group-sm shadow mb-2'>
                      <input
                        type='text'
                        className={`form-control ${
                          editMode.deceased_last_name && ' border border-danger'
                        }`}
                        value={application.deceased.last_name}
                        onChange={(e) =>
                          handleNestedChange(e, 'deceased', 'last_name')
                        }
                        readOnly={!editMode.deceased_last_name}
                      />
                      <button
                        type='button'
                        className='btn btn-dark'
                        onClick={() => {
                          if (editMode.deceased_last_name)
                            submitChangesHandler();
                          toggleEditMode('deceased_last_name');
                        }}
                        disabled={
                          application.approved || application.is_rejected
                        }
                      >
                        {editMode.deceased_last_name ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                    {(!application.deceased.last_name ||
                      application.deceased.last_name === '') && (
                      <sup className='text-danger'>
                        Deceased&#39;s last name is required.
                      </sup>
                    )}
                  </div>
                </div>

                <hr />
                <div className='row '>
                  <div className='col-md-12'>
                    <label className='form-label col-12'>
                      Dispute Details:
                    </label>
                    <div className='input-group input-group-sm shadow'>
                      <textarea
                        // type='text'
                        className={`form-control ${
                          editMode.dispute_details && '  border border-danger'
                        }`}
                        value={
                          application.dispute.details === 'No dispute'
                            ? ''
                            : application.dispute.details
                        }
                        onChange={(e) =>
                          handleNestedChange(e, 'dispute', 'details')
                        }
                        readOnly={!editMode.dispute_details}
                        style={{ minHeight: '150px' }}
                      />
                      <button
                        type='button'
                        className='btn btn-dark'
                        onClick={() => {
                          if (editMode.dispute_details) submitChangesHandler();
                          toggleEditMode('dispute_details');
                        }}
                        disabled={
                          application.approved || application.is_rejected
                        }
                      >
                        {editMode.dispute_details ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

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
          addItem={addItem}
          application={application}
          handleListChange={handleListChange}
          editMode={editMode}
          submitChangesHandler={submitChangesHandler}
          toggleEditMode={toggleEditMode}
          removeItem={removeItem}
          triggerChandleChange={triggerHandleChange}
          setTriggerChandleChange={setTriggerChandleChange}
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
