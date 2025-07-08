// Modified RequiredDetailsPart.js - Stage-Connected Component Display
import { useEffect, useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { patchData } from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors, {
  formatMoney,
} from '../../GenericFunctions/HelperGenericFunctions';

import ApplicantsPart from './ApplicantsPart';
import EstatesPart from './EstatesPart';
import SolicitorPart from './SolicitorPart';

import Cookies from 'js-cookie';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import AdvancementInfo from '../Applications/AdvancementInfo.jsx';
import DocumentsUpload from '../Applications/UploadingFileComponents/DocumentsUpload.jsx';

const RequiredDetailsPart = ({
  application,
  setApplication,
  id,
  refresh,
  setRefresh,
  highlitedSectionId,
  isApplicationLocked,
  advancement, // Add advancement prop
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [triggerHandleChange, setTriggerChandleChange] = useState(false);
  const [originalApplication, setOriginalApplication] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeSection, setActiveSection] = useState('basic_details');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currency_sign = Cookies.get('currency_sign');

  // Handle section changes with smooth transitions
  useEffect(() => {
    if (highlitedSectionId && highlitedSectionId !== activeSection) {
      setIsTransitioning(true);

      setTimeout(() => {
        setActiveSection(highlitedSectionId);
        setIsTransitioning(false);
      }, 150);
    }
  }, [highlitedSectionId, activeSection]);

  // Initialize the original application state when the component mounts
  useEffect(() => {
    if (application) {
      setOriginalApplication(JSON.parse(JSON.stringify(application))); // Deep copy of the application state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (application && !application.applicants) {
      setApplication({
        ...application,
        applicants: [],
      });
    }
  }, [application]);

  // Get stage info for styling
  const getStageTitleAndIcon = (stageId) => {
    const stageMap = {
      advancement_details: {
        title: 'Advancement Details',
        icon: 'fas fa-money-bill-wave',
        color: '#059669',
      },
      basic_details: {
        title: 'Application Information',
        icon: 'fas fa-info-circle',
        color: '#3b82f6',
      },
      applicant_registration: {
        title: 'Applicant Registration',
        icon: 'fas fa-user-plus',
        color: '#8b5cf6',
      },
      legal_representation: {
        title: 'Legal Representation',
        icon: 'fas fa-balance-scale',
        color: '#10b981',
      },
      estate_assessment: {
        title: 'Estate Assessment',
        icon: 'fas fa-home',
        color: '#f59e0b',
      },
      information_verification: {
        title: 'Information Verification',
        icon: 'fas fa-shield-check',
        color: '#ef4444',
      },
      documentation_requirements: {
        title: 'Documentation & Requirements',
        icon: 'fas fa-file-upload',
        color: '#6366f1',
      },
    };
    return stageMap[stageId] || stageMap['basic_details'];
  };

  const currentStage = getStageTitleAndIcon(activeSection);

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
        ({
          id,
          title,
          first_name,
          last_name,
          pps_number,
          address_line_1,
          address_line_2,
          city,
          county,
          postal_code,
          country,
          date_of_birth,
          email,
          phone_number,
        }) => ({
          id,
          title,
          first_name,
          last_name,
          pps_number,
          address_line_1,
          address_line_2,
          city,
          county,
          postal_code,
          country,
          date_of_birth,
          email,
          phone_number,
        })
      ),
      was_will_prepared_by_solicitor,
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
    if (listName === 'applicants') {
      setApplication({
        ...application,
        [listName]: [newItem],
      });
    } else {
      setApplication({
        ...application,
        [listName]: [...(application[listName] || []), newItem],
      });
    }
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
      [field]: !editMode[field],
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

      const filteredApplication = getFilteredApplicationData(application);
      if (filteredApplication.dispute.details.trim() === '') {
        filteredApplication.dispute.details = 'No dispute';
      }

      try {
        setIsUpdating(true);
        const endpoint = `/api/applications/solicitor_applications/${id}/`;
        const response = await patchData(endpoint, filteredApplication);
        if (response.status !== 200) {
          setIsError(true);
          setErrorMessage(response.data);
        } else {
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setRefresh(!refresh);
      }
    }
  };

  useEffect(() => {
    submitChangesHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerHandleChange]);

  // Information Verification Component
  const InformationVerificationComponent = () => {
    const isVerified =
      application.processing_status?.application_details_completed_confirmed;
    const hasSolicitor = application.solicitor;
    const solicitorName = application.solicitor?.name || 'Legal Representative';

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
            padding: '2rem',
            background: isVerified
              ? 'linear-gradient(135deg, #10b98115, #059669108)'
              : 'linear-gradient(135deg, #f59e0b15, #d9770608)',
            borderRadius: '20px',
            border: isVerified ? '2px solid #10b98130' : '2px solid #f59e0b30',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              background: isVerified
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isVerified
                ? '0 10px 40px rgba(16, 185, 129, 0.4)'
                : '0 10px 40px rgba(245, 158, 11, 0.4)',
              animation: 'statusPulse 3s ease-in-out infinite',
            }}
          >
            {isVerified ? (
              <i
                className='fas fa-shield-check'
                style={{ color: 'white', fontSize: '2rem' }}
              ></i>
            ) : (
              <i
                className='fas fa-clock'
                style={{ color: 'white', fontSize: '2rem' }}
              ></i>
            )}
          </div>

          <h2
            style={{
              margin: '0 0 1rem 0',
              fontSize: '2rem',
              fontWeight: '800',
              color: isVerified ? '#059669' : '#d97706',
            }}
          >
            {isVerified ? 'Information Verified' : 'Awaiting Verification'}
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: '1.1rem',
              color: '#64748b',
              fontWeight: '500',
              lineHeight: '1.6',
            }}
          >
            {isVerified
              ? `All application details have been thoroughly reviewed and verified by ${solicitorName}.`
              : `Your application details are pending verification by your assigned legal representative.`}
          </p>
        </div>

        {!isVerified && (
          <div
            style={{
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid #f59e0b40',
              marginBottom: '2rem',
            }}
          >
            <h3
              style={{
                color: '#92400e',
                marginBottom: '1rem',
                fontSize: '1.3rem',
                fontWeight: '700',
              }}
            >
              <i className='fas fa-info-circle me-2'></i>
              Next Steps
            </h3>
            <p
              style={{
                color: '#78350f',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1rem',
              }}
            >
              Your assigned legal representative will contact you to confirm all
              information provided. To expedite this process, please ensure all
              required details have been completed accurately.
            </p>
            <p
              style={{
                color: '#78350f',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              Once verification is complete, you will be able to proceed to the
              documentation stage of your application.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Basic Details Section Component
  const BasicDetailsSection = () => (
    <div>
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
                    : ` ${formatMoney(application.amount, currency_sign)}`
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
                disabled={
                  application.approved ||
                  application.is_rejected ||
                  isApplicationLocked
                }
              >
                {editMode.amount ? <FaSave size={16} /> : <FaEdit size={16} />}
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
                disabled={
                  application.approved ||
                  application.is_rejected ||
                  isApplicationLocked
                }
              >
                {editMode.deceased_first_name ? (
                  <FaSave size={16} />
                ) : (
                  <FaEdit size={16} />
                )}
              </button>
            </div>
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
                onChange={(e) => handleNestedChange(e, 'deceased', 'last_name')}
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
                disabled={
                  application.approved ||
                  application.is_rejected ||
                  isApplicationLocked
                }
              >
                {editMode.deceased_last_name ? (
                  <FaSave size={16} />
                ) : (
                  <FaEdit size={16} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Will Preparation and Dispute sections... */}
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
                disabled={
                  application.approved ||
                  application.is_rejected ||
                  isApplicationLocked
                }
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
                disabled={
                  application.approved ||
                  application.is_rejected ||
                  isApplicationLocked
                }
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
              disabled={
                application.approved ||
                application.is_rejected ||
                isApplicationLocked
              }
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
  );

  // Render the appropriate component based on active section
  const renderActiveComponent = () => {
    if (isTransitioning) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            color: currentStage.color,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: `3px solid ${currentStage.color}30`,
                borderTop: `3px solid ${currentStage.color}`,
                animation: 'spin 1s linear infinite',
              }}
            />
            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
              Loading {currentStage.title}...
            </span>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'advancement_details':
        return <AdvancementInfo advancement={advancement} />;

      case 'basic_details':
        return <BasicDetailsSection />;

      case 'applicant_registration':
        return (
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
            isApplicationLocked={isApplicationLocked}
          />
        );

      case 'legal_representation':
        return (
          <SolicitorPart
            application_id={application.id}
            solicitor_id={application.solicitor}
            refresh={refresh}
            setRefresh={setRefresh}
            highlitedSectionId={highlitedSectionId}
          />
        );

      case 'estate_assessment':
        return (
          <EstatesPart
            application={application}
            refresh={refresh}
            setRefresh={setRefresh}
            isApplicationLocked={isApplicationLocked}
          />
        );

      case 'information_verification':
        return <InformationVerificationComponent />;

      case 'documentation_requirements':
        return (
          <DocumentsUpload
            application={application}
            highlitedSectionId={highlitedSectionId}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        );

      default:
        return <BasicDetailsSection />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
      }}
    >
      <style>
        {`
          @keyframes backgroundShift {
            0%, 100% { 
              transform: translateX(0) translateY(0) scale(1);
              opacity: 0.7;
            }
            33% { 
              transform: translateX(-20px) translateY(10px) scale(1.02);
              opacity: 0.5;
            }
            66% { 
              transform: translateX(20px) translateY(-10px) scale(0.98);
              opacity: 0.8;
            }
          }

          @keyframes statusPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes contentSlideIn {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes iconFloat {
            0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(-8px) rotate(5deg) scale(1.02); }
          }

          @keyframes progressSlide {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(250%); }
            100% { transform: translateX(-100%); }
          }

          @keyframes progressShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          .scroll-container::-webkit-scrollbar {
            width: 8px;
          }
          
          .scroll-container::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
border-radius: 4px;
}
.scroll-container::-webkit-scrollbar-thumb {
        background: ${currentStage.color};
        border-radius: 4px;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
      }
    `}
      </style>

      {/* Animated Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
        radial-gradient(circle at 20% 80%, ${currentStage.color}15 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, ${currentStage.color}10 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, ${currentStage.color}08 0%, transparent 50%)
      `,
          animation: 'backgroundShift 20s ease-in-out infinite',
        }}
      />

      {/* Content Container */}
      <div
        className='scroll-container'
        style={{
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* CUTTING-EDGE GLASSMORPHIC HEADER */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.25) 0%, 
            rgba(255, 255, 255, 0.15) 50%, 
            rgba(255, 255, 255, 0.05) 100%
          ),
          linear-gradient(135deg, 
            ${currentStage.color}20 0%, 
            ${currentStage.color}10 50%, 
            ${currentStage.color}05 100%
          )
        `,
            backdropFilter: 'blur(40px) saturate(180%)',
            borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
            zIndex: 1000,
            boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.12),
          0 4px 16px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.3)
        `,
            borderRadius: '0 0 24px 24px',
            margin: '0 1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              padding: '2.5rem 3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              position: 'relative',
            }}
          >
            {/* Floating Icon with Glassmorphic Effect */}
            <div
              style={{
                width: '80px',
                height: '80px',
                background: `
              linear-gradient(135deg, 
                ${currentStage.color}90 0%, 
                ${currentStage.color}70 50%, 
                ${currentStage.color}90 100%
              )
            `,
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                boxShadow: `
              0 20px 40px ${currentStage.color}30,
              0 8px 16px ${currentStage.color}20,
              0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
                animation: 'iconFloat 4s ease-in-out infinite',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Inner glow effect */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                radial-gradient(circle at 30% 30%, 
                  rgba(255, 255, 255, 0.3) 0%, 
                  transparent 60%
                )
              `,
                  borderRadius: '24px',
                }}
              />
              <i
                className={currentStage.icon}
                style={{ position: 'relative', zIndex: 1 }}
              ></i>
            </div>

            {/* Title Section with High Contrast */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                <div
                  style={{
                    padding: '0.4rem 1rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: '20px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  Application #{application.id}
                </div>
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.6)',
                  }}
                />
                <div
                  style={{
                    padding: '0.4rem 1rem',
                    background: `linear-gradient(135deg, ${currentStage.color}, ${currentStage.color}cc)`,
                    borderRadius: '20px',
                    color: 'white',
                    fontWeight: '700',
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 4px 12px ${currentStage.color}40`,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {currentStage.title}
                </div>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  color: '#0f172a',
                  letterSpacing: '-0.03em',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  lineHeight: '1.1',
                }}
              >
                {currentStage.title}
              </h1>

              {/* Subtle subtitle */}
              <p
                style={{
                  margin: '0.5rem 0 0 0',
                  fontSize: '1rem',
                  color: 'rgba(15, 23, 42, 0.7)',
                  fontWeight: '500',
                }}
              >
                Manage and review your application details
              </p>
            </div>

            {/* Modern Status Indicator */}
            <div
              style={{
                padding: '1rem 1.5rem',
                background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.9) 0%, 
                rgba(255, 255, 255, 0.7) 100%
              )
            `,
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#0f172a',
                fontWeight: '700',
                fontSize: '0.9rem',
                boxShadow: `
              0 8px 24px rgba(0, 0, 0, 0.1),
              0 4px 8px rgba(0, 0, 0, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.5)
            `,
                backdropFilter: 'blur(20px)',
                textAlign: 'center',
                minWidth: '140px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.3rem',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${currentStage.color}, ${currentStage.color}cc)`,
                    boxShadow: `0 0 12px ${currentStage.color}80`,
                    animation: 'statusPulse 2s ease-in-out infinite',
                  }}
                />
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  VIEWING
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: currentStage.color,
                  fontWeight: '800',
                }}
              >
                Active Section
              </div>
            </div>
          </div>

          {/* Animated Progress Indicator */}
          <div
            style={{
              position: 'relative',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '40%',
                background: `linear-gradient(90deg, 
              transparent, 
              ${currentStage.color}80, 
              ${currentStage.color}, 
              ${currentStage.color}80, 
              transparent
            )`,
                animation: 'progressSlide 3s ease-in-out infinite',
              }}
            />
          </div>

          {/* Bottom highlight line */}
          <div
            style={{
              height: '1px',
              background: `linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.4), 
            transparent
          )`,
            }}
          />
        </div>

        {/* Content Area */}
        <div
          style={{
            padding: '2rem 0',
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          <div
            style={{
              width: '100%',

              padding: '0 1rem',
            }}
          >
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

            {/* Content Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.25),
              0 0 0 1px ${currentStage.color}15,
              inset 0 1px 0 rgba(255, 255, 255, 0.9)
            `,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${currentStage.color}20`,
                overflow: 'hidden',
                position: 'relative',
                animation: 'contentSlideIn 0.3s ease-out',
              }}
            >
              {/* Subtle header accent */}
              <div
                style={{
                  height: '4px',
                  background: `linear-gradient(90deg, ${currentStage.color}, ${currentStage.color}80, ${currentStage.color})`,
                  animation: 'progressShimmer 3s infinite',
                }}
              />

              {/* Component Content */}
              <div
                style={{
                  padding: '1rem',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {renderActiveComponent()}
              </div>

              {/* Background decoration */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: `radial-gradient(circle, ${currentStage.color}08 0%, transparent 70%)`,
                  transform: 'translate(50%, -50%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RequiredDetailsPart;
