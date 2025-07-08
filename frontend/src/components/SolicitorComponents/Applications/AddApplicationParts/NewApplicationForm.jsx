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
      className='min-vh-100 position-relative'
      style={{
        background: `
          #1F2049,
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15), transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.12), transparent 50%)
        `,
        backdropFilter: 'blur(20px)',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      {/* Animated Background Pattern */}
      <div
        className='position-absolute w-100 h-100'
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 70% 70%, rgba(99, 102, 241, 0.06) 0%, transparent 60%)
          `,
          animation: 'float 8s ease-in-out infinite',
          zIndex: -1,
        }}
      />

      <div className='container'>
        <div
          className='modern-main-card mt-5 position-relative overflow-hidden'
          style={{
            background: `
              linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(248, 250, 252, 0.1)),
              radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.2), transparent 50%),
              radial-gradient(circle at 70% 90%, rgba(59, 130, 246, 0.12), transparent 50%)
            `,
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '24px',
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.3),
              0 8px 16px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.25)
            `,
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateZ(0)',
            marginBottom: '200px',
          }}
        >
          {/* Animated Background Pattern */}
          <div
            className='position-absolute w-100 h-100'
            style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%)
              `,
              opacity: 0.6,
              animation: 'float 6s ease-in-out infinite',
            }}
          />

          {/* Enhanced Header */}
          <div
            className='px-4 py-4 d-flex align-items-center gap-3 position-relative'
            style={{
              background: `
                linear-gradient(135deg, #22c55e, #16a34a),
                linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))
              `,
              color: '#ffffff',
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Icon with Micro-animation */}
            <div
              className='d-flex align-items-center justify-content-center rounded-circle position-relative'
              style={{
                width: '56px',
                height: '56px',
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
              <FaPlus size={20} />

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

            <div className='flex-grow-1 text-center'>
              <h1
                className='fw-bold mb-0 text-white'
                style={{
                  fontSize: '2rem',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                Create New Application
              </h1>
            </div>
          </div>

          {/* Enhanced Body */}
          <div className='p-4 position-relative'>
            <form onSubmit={submitHandler}>
              <ApplicationPart formData={formData} setFormData={setFormData} />
              <ApplicantsPart
                applicants={formData.applicants}
                setFormData={setFormData}
                idNumberArray={idNumberArray}
                onValidationChange={setApplicantValidation}
              />

              {/* Enhanced Submit Section */}
              <div className='row mt-4'>
                <div className='col-12'>
                  <div
                    className='p-4'
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <button
                      type='submit'
                      className='btn btn-info my-2 w-100 d-flex align-items-center justify-content-center gap-2 fw-medium'
                      disabled={loading || !applicantValidation.isValid}
                      style={{
                        opacity:
                          loading || !applicantValidation.isValid ? 0.6 : 1,
                        cursor:
                          loading || !applicantValidation.isValid
                            ? 'not-allowed'
                            : 'pointer',
                        padding: '12px 24px',
                        fontSize: '1.1rem',
                        borderRadius: '12px',
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
                          <FaExclamationTriangle size={16} />
                          Fix Validation Errors
                        </>
                      ) : applicantValidation.missingFields ? (
                        <>
                          <FaInfoCircle size={16} />
                          Complete Required Fields
                        </>
                      ) : (
                        <>
                          <FaPlusCircle size={16} />
                          Create Application
                        </>
                      )}
                    </button>

                    {/* Enhanced Message Display */}
                    {message && (
                      <div
                        className={`alert text-center mt-3 border-0 position-relative`}
                        style={{
                          background: isError
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
                            : 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))',
                          color: isError ? '#dc2626' : '#16a34a',
                          borderRadius: '12px',
                          border: isError
                            ? '1px solid rgba(239, 68, 68, 0.3)'
                            : '1px solid rgba(34, 197, 94, 0.3)',
                          backdropFilter: 'blur(10px)',
                          fontWeight: '500',
                          padding: '1rem',
                          boxShadow: isError
                            ? '0 4px 12px rgba(239, 68, 68, 0.2)'
                            : '0 4px 12px rgba(34, 197, 94, 0.2)',
                        }}
                        role='alert'
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isError
                              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                              : 'linear-gradient(135deg, #22c55e, #16a34a)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 0.5rem',
                            boxShadow: isError
                              ? '0 4px 8px rgba(239, 68, 68, 0.4)'
                              : '0 4px 8px rgba(34, 197, 94, 0.4)',
                          }}
                        >
                          {isError ? (
                            <FaExclamationTriangle size={12} />
                          ) : (
                            <FaPlusCircle size={12} />
                          )}
                        </div>
                        {renderErrors(message)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* CSS Animations */}
          <style>{`
            @keyframes float {
              0%,
              100% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(-8px) rotate(1deg);
              }
            }

            .modern-main-card {
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .modern-main-card:hover {
              transform: translateY(-4px) scale(1.01);
              box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4),
                0 16px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
