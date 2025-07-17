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
          linear-gradient(135deg, #1F2049 0%, #2a2d6b 25%, #1F2049 50%, #1a1d42 75%, #1F2049 100%),
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 70%)
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
          className='modern-main-card mt-0 mt-lg-5 mb-2 mb-lg-5 position-relative overflow-hidden'
          style={{
            background: `
              linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 25%, rgba(30, 41, 59, 0.95) 50%, rgba(51, 65, 85, 0.95) 75%, rgba(30, 41, 59, 0.95) 100%),
              radial-gradient(circle at 30% 10%, rgba(59, 130, 246, 0.15), transparent 50%),
              radial-gradient(circle at 70% 90%, rgba(139, 92, 246, 0.12), transparent 50%)
            `,
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '24px',
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.4),
              0 8px 16px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 0 60px rgba(59, 130, 246, 0.1)
            `,
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateZ(0)',
          }}
        >
          {/* Enhanced Shimmer Effect */}
          <div
            className='position-absolute'
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background:
                'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), rgba(139, 92, 246, 0.6), transparent)',
              animation: 'progressShimmer 3s infinite',
              borderRadius: '24px 24px 0 0',
            }}
          />

          {/* Enhanced Header */}
          <div
            className='d-flex flex-column flex-sm-row align-items-center text-center text-sm-start position-relative p-3 p-md-4 gap-3'
            style={{
              background: `
                linear-gradient(145deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(29, 78, 216, 0.9) 100%),
                linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
              `,
              color: '#ffffff',
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
              boxShadow:
                '0 4px 20px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* 3D Icon with Enhanced Animation */}
            <div
              className='d-flex align-items-center justify-content-center rounded-circle position-relative flex-shrink-0'
              style={{
                width: '56px',
                height: '56px',
                background:
                  'linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(15px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow:
                  '0 8px 25px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  'scale(1.1) translateY(-2px) rotate(5deg)';
                e.currentTarget.style.background =
                  'linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))';
                e.currentTarget.style.boxShadow =
                  '0 12px 35px rgba(59, 130, 246, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  'scale(1) translateY(0) rotate(0deg)';
                e.currentTarget.style.background =
                  'linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)';
              }}
            >
              <FaPlus
                size={window.innerWidth < 768 ? 18 : 22}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
              />

              {/* Enhanced glow effect */}
              <div
                className='position-absolute rounded-circle'
                style={{
                  top: '-15px',
                  left: '-15px',
                  right: '-15px',
                  bottom: '-15px',
                  background:
                    'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                  zIndex: -1,
                  animation: 'iconGlow 3s ease-in-out infinite',
                }}
              />
            </div>

            <div className='flex-grow-1'>
              <h1
                className='fw-bold mb-0 text-white'
                style={{
                  fontSize: 'clamp(1.2rem, 4vw, 1.75rem)',
                  letterSpacing: '-0.02em',
                  textShadow:
                    '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.2)',
                  background:
                    'linear-gradient(145deg, #ffffff, #e2e8f0, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
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
                      background:
                        'linear-gradient(145deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))',
                      borderRadius: '20px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      backdropFilter: 'blur(20px)',
                      boxShadow:
                        '0 8px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <button
                      type='submit'
                      className='btn w-100 d-flex align-items-center justify-content-center fw-bold py-3 py-md-2'
                      disabled={loading || !applicantValidation.isValid}
                      style={{
                        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                        opacity:
                          loading || !applicantValidation.isValid ? 0.6 : 1,
                        cursor:
                          loading || !applicantValidation.isValid
                            ? 'not-allowed'
                            : 'pointer',
                        borderRadius: '16px',
                        border: 'none',
                        background:
                          loading || !applicantValidation.isValid
                            ? 'linear-gradient(145deg, rgba(107, 114, 128, 0.6), rgba(75, 85, 99, 0.6))'
                            : applicantValidation.hasErrors
                            ? 'linear-gradient(145deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)'
                            : applicantValidation.missingFields
                            ? 'linear-gradient(145deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'
                            : 'linear-gradient(145deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                        color: '#ffffff',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow:
                          loading || !applicantValidation.isValid
                            ? '0 4px 15px rgba(0, 0, 0, 0.2)'
                            : applicantValidation.hasErrors
                            ? '0 6px 20px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.2)'
                            : applicantValidation.missingFields
                            ? '0 6px 20px rgba(245, 158, 11, 0.4), 0 0 30px rgba(245, 158, 11, 0.2)'
                            : '0 6px 20px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2)',
                        gap: '12px',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        letterSpacing: '0.5px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading && applicantValidation.isValid) {
                          e.currentTarget.style.transform =
                            'translateY(-3px) scale(1.02)';
                          e.currentTarget.style.boxShadow =
                            applicantValidation.hasErrors
                              ? '0 12px 35px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3)'
                              : applicantValidation.missingFields
                              ? '0 12px 35px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.3)'
                              : '0 12px 35px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading && applicantValidation.isValid) {
                          e.currentTarget.style.transform =
                            'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow =
                            applicantValidation.hasErrors
                              ? '0 6px 20px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.2)'
                              : applicantValidation.missingFields
                              ? '0 6px 20px rgba(245, 158, 11, 0.4), 0 0 30px rgba(245, 158, 11, 0.2)'
                              : '0 6px 20px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2)';
                        }
                      }}
                    >
                      {/* Button shimmer effect */}
                      {!loading && applicantValidation.isValid && (
                        <div
                          className='position-absolute'
                          style={{
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background:
                              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                            animation: 'buttonShimmer 3s infinite',
                          }}
                        />
                      )}

                      {loading ? (
                        <LoadingComponent message='Adding application...' />
                      ) : applicantValidation.hasErrors ? (
                        <>
                          <FaExclamationTriangle
                            size={window.innerWidth < 768 ? 16 : 18}
                          />
                          <span className='d-none d-sm-inline'>
                            Fix Validation Errors
                          </span>
                          <span className='d-inline d-sm-none'>Fix Errors</span>
                        </>
                      ) : applicantValidation.missingFields ? (
                        <>
                          <FaInfoCircle
                            size={window.innerWidth < 768 ? 16 : 18}
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
                            size={window.innerWidth < 768 ? 16 : 18}
                          />
                          Create Application
                        </>
                      )}
                    </button>

                    {/* Enhanced Message Display */}
                    {message && (
                      <div
                        className={`text-center border-0 position-relative mt-3 mb-0 p-3 p-md-4`}
                        style={{
                          background: isError
                            ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 50%, rgba(185, 28, 28, 0.1) 100%)'
                            : 'linear-gradient(145deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 50%, rgba(29, 78, 216, 0.1) 100%)',
                          color: isError ? '#fca5a5' : '#93c5fd',
                          borderRadius: '16px',
                          border: isError
                            ? '1px solid rgba(239, 68, 68, 0.4)'
                            : '1px solid rgba(59, 130, 246, 0.4)',
                          backdropFilter: 'blur(20px)',
                          fontWeight: '600',
                          boxShadow: isError
                            ? '0 8px 25px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            : '0 8px 25px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        }}
                        role='alert'
                      >
                        <div
                          className='mx-auto mb-3'
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: isError
                              ? 'linear-gradient(145deg, #ef4444, #dc2626, #b91c1c)'
                              : 'linear-gradient(145deg, #3b82f6, #2563eb, #1d4ed8)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isError
                              ? '0 6px 20px rgba(239, 68, 68, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                              : '0 6px 20px rgba(59, 130, 246, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          {isError ? (
                            <FaExclamationTriangle size={16} />
                          ) : (
                            <FaPlusCircle size={16} />
                          )}
                        </div>
                        <div
                          style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}
                        >
                          {renderErrors(message)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        .modern-main-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modern-main-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5),
            0 20px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 0 80px rgba(59, 130, 246, 0.2);
        }

        @keyframes progressShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes buttonShimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes iconGlow {
          0%, 100% { 
            opacity: 0.6;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @media (max-width: 768px) {
          .modern-main-card {
            border-radius: 16px !important;
          }
          
          .modern-main-card:hover {
            transform: translateY(-3px) scale(1.005);
          }
        }

        @media (min-width: 992px) {
          .modern-main-card {
            border-radius: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}
