import Cookies from 'js-cookie';
import { useState } from 'react';
import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaPlus,
  FaPlusCircle,
} from 'react-icons/fa';
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
  const [applicantValidation, setApplicantValidation] = useState({
    isValid: false,
    hasErrors: false,
    missingFields: true,
  });

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
    <div
      className='min-vh-100 position-relative pt-2 pt-md-4 pb-2 pb-md-4 px-2 px-md-0'
      style={{
        background: `
          #1F2049,
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15), transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.12), transparent 50%)
        `,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Background Pattern */}
      <div
        className='position-absolute w-100 h-100'
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 70% 70%, rgba(99, 102, 241, 0.06) 0%, transparent 60%)
          `,
          zIndex: -1,
        }}
      />

      <div>
        <div
          className='modern-main-card mt-0 mt-lg-5 mb-2 mb-lg-5  position-relative overflow-hidden'
          style={{
            background: `
              linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(248, 250, 252, 0.1)),
              radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.2), transparent 50%),
              radial-gradient(circle at 70% 90%, rgba(59, 130, 246, 0.12), transparent 50%)
            `,
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '12px',
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.3),
              0 8px 16px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.25)
            `,
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateZ(0)',
          }}
        >
          {/* Background Pattern */}
          <div
            className='position-absolute w-100 h-100'
            style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%)
              `,
              opacity: 0.6,
            }}
          />

          {/* Enhanced Header */}
          <div
            className='d-flex flex-column flex-sm-row align-items-center text-center text-sm-start position-relative p-3 p-md-4 gap-3'
            style={{
              background: `
                linear-gradient(135deg, #22c55e, #16a34a),
                linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))
              `,
              color: '#ffffff',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Icon with Micro-animation */}
            <div
              className='d-flex align-items-center justify-content-center rounded-circle position-relative flex-shrink-0'
              style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <FaPlus size={16} className='d-block d-md-none' />
              <FaPlus size={20} className='d-none d-md-block' />

              {/* Subtle glow effect */}
              <div
                className='position-absolute rounded-circle'
                style={{
                  top: '-10px',
                  left: '-10px',
                  right: '-10px',
                  bottom: '-10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  filter: 'blur(8px)',
                  zIndex: -1,
                }}
              />
            </div>

            <div className='flex-grow-1'>
              <h1
                className='fw-bold mb-0 text-white fs-4 fs-md-2'
                style={{
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                Create New Application
              </h1>
            </div>
          </div>

          {/* Enhanced Body */}
          <div className='p-3 p-md-4 position-relative'>
            <form onSubmit={submitHandler}>
              <ApplicationPart formData={formData} setFormData={setFormData} />
              <ApplicantsPart
                applicants={formData.applicants}
                setFormData={setFormData}
                idNumberArray={idNumberArray}
                onValidationChange={setApplicantValidation}
              />

              {/* Enhanced Submit Section */}
              <div className='row mt-3 mt-md-4 g-0'>
                <div className='col-12'>
                  <div
                    className='p-3 p-md-4'
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <button
                      type='submit'
                      className='btn btn-info w-100 d-flex align-items-center justify-content-center fw-medium py-3 py-md-2 fs-6 fs-md-5'
                      disabled={loading || !applicantValidation.isValid}
                      style={{
                        opacity:
                          loading || !applicantValidation.isValid ? 0.6 : 1,
                        cursor:
                          loading || !applicantValidation.isValid
                            ? 'not-allowed'
                            : 'pointer',
                        borderRadius: '10px',
                        border: 'none',
                        background:
                          loading || !applicantValidation.isValid
                            ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                            : applicantValidation.hasErrors
                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                            : applicantValidation.missingFields
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                            : 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: '#ffffff',
                        transition: 'all 0.3s ease',
                        boxShadow:
                          loading || !applicantValidation.isValid
                            ? 'none'
                            : applicantValidation.hasErrors
                            ? '0 4px 15px rgba(239, 68, 68, 0.4)'
                            : applicantValidation.missingFields
                            ? '0 4px 15px rgba(245, 158, 11, 0.4)'
                            : '0 4px 15px rgba(34, 197, 94, 0.4)',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading && applicantValidation.isValid) {
                          e.currentTarget.style.transform =
                            'translateY(-2px) scale(1.02)';
                          e.currentTarget.style.boxShadow =
                            applicantValidation.hasErrors
                              ? '0 8px 25px rgba(239, 68, 68, 0.6)'
                              : applicantValidation.missingFields
                              ? '0 8px 25px rgba(245, 158, 11, 0.6)'
                              : '0 8px 25px rgba(34, 197, 94, 0.6)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading && applicantValidation.isValid) {
                          e.currentTarget.style.transform =
                            'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow =
                            applicantValidation.hasErrors
                              ? '0 4px 15px rgba(239, 68, 68, 0.4)'
                              : applicantValidation.missingFields
                              ? '0 4px 15px rgba(245, 158, 11, 0.4)'
                              : '0 4px 15px rgba(34, 197, 94, 0.4)';
                        }
                      }}
                    >
                      {loading ? (
                        <LoadingComponent message='Adding application...' />
                      ) : applicantValidation.hasErrors ? (
                        <>
                          <FaExclamationTriangle
                            size={14}
                            className='d-block d-md-none'
                          />
                          <FaExclamationTriangle
                            size={16}
                            className='d-none d-md-block'
                          />
                          <span className='d-none d-sm-inline'>
                            Fix Validation Errors
                          </span>
                          <span className='d-inline d-sm-none'>Fix Errors</span>
                        </>
                      ) : applicantValidation.missingFields ? (
                        <>
                          <FaInfoCircle
                            size={14}
                            className='d-block d-md-none'
                          />
                          <FaInfoCircle
                            size={16}
                            className='d-none d-md-block'
                          />
                          <span className='d-none d-sm-inline'>
                            Complete Required Fields
                          </span>
                          <span className='d-inline d-sm-none'>
                            Complete Fields
                          </span>
                        </>
                      ) : (
                        <>
                          <FaPlusCircle
                            size={14}
                            className='d-block d-md-none'
                          />
                          <FaPlusCircle
                            size={16}
                            className='d-none d-md-block'
                          />
                          Create Application
                        </>
                      )}
                    </button>

                    {/* Enhanced Message Display */}
                    {message && (
                      <div
                        className={`alert text-center border-0 position-relative mt-3 mb-0 p-3 p-md-4`}
                        style={{
                          background: isError
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
                            : 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))',
                          color: isError ? '#dc2626' : '#16a34a',
                          borderRadius: '10px',
                          border: isError
                            ? '1px solid rgba(239, 68, 68, 0.3)'
                            : '1px solid rgba(34, 197, 94, 0.3)',
                          backdropFilter: 'blur(10px)',
                          fontWeight: '500',
                          boxShadow: isError
                            ? '0 4px 12px rgba(239, 68, 68, 0.2)'
                            : '0 4px 12px rgba(34, 197, 94, 0.2)',
                        }}
                        role='alert'
                      >
                        <div
                          className='mx-auto mb-2'
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isError
                              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                              : 'linear-gradient(135deg, #22c55e, #16a34a)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isError
                              ? '0 4px 8px rgba(239, 68, 68, 0.4)'
                              : '0 4px 8px rgba(34, 197, 94, 0.4)',
                          }}
                        >
                          {isError ? (
                            <>
                              <FaExclamationTriangle
                                size={10}
                                className='d-block d-md-none'
                              />
                              <FaExclamationTriangle
                                size={12}
                                className='d-none d-md-block'
                              />
                            </>
                          ) : (
                            <>
                              <FaPlusCircle
                                size={10}
                                className='d-block d-md-none'
                              />
                              <FaPlusCircle
                                size={12}
                                className='d-none d-md-block'
                              />
                            </>
                          )}
                        </div>
                        <div className='fs-6 fs-md-5'>
                          {renderErrors(message)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* CSS Styles */}
          <style>{`
            .modern-main-card {
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              border-radius: 12px !important;
            }

            .modern-main-card:hover {
              transform: translateY(-4px) scale(1.01);
              box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4),
                0 16px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }

            @media (max-width: 768px) {
              .modern-main-card {
                border-radius: 12px !important;
              }
              
              .modern-main-card:hover {
                transform: translateY(-2px) scale(1.005);
              }
            }

            @media (min-width: 992px) {
              .modern-main-card {
                border-radius: 24px !important;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
