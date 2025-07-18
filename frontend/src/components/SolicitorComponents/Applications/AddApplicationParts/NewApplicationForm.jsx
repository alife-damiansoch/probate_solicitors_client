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
          var(--gradient-main-bg),
          radial-gradient(circle at 20% 30%, var(--primary-10) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, var(--primary-20) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, var(--success-20) 0%, transparent 70%)
        `,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Background Pattern */}
      <div
        className='position-absolute w-100 h-100'
        style={{
          background: `
            radial-gradient(circle at 30% 30%, var(--primary-10) 0%, transparent 60%),
            radial-gradient(circle at 70% 70%, var(--primary-blue-light) 0%, transparent 60%)
          `,
          zIndex: -1,
        }}
      />

      <div>
        <div
          className='modern-main-card mt-0 mt-lg-5 mb-2 mb-lg-5 position-relative overflow-hidden'
          style={{
            background: `
              var(--gradient-surface),
              radial-gradient(circle at 30% 10%, var(--primary-20), transparent 50%),
              radial-gradient(circle at 70% 90%, var(--primary-blue-light), transparent 50%)
            `,
            border: '1px solid var(--border-primary)',
            borderRadius: '24px',
            boxShadow: `
              0 20px 40px rgba(0,0,0,0.4),
              0 8px 16px rgba(0,0,0,0.3),
              inset 0 1px 0 var(--white-10),
              0 0 60px var(--primary-10)
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
                'linear-gradient(90deg, transparent, var(--primary-blue-light), var(--primary-blue-dark), transparent)',
              animation: 'progressShimmer 3s infinite',
              borderRadius: '24px 24px 0 0',
            }}
          />

          {/* Enhanced Header */}
          <div
            className='d-flex flex-column flex-sm-row align-items-center text-center text-sm-start position-relative p-3 p-md-4 gap-3'
            style={{
              background: `
                linear-gradient(145deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%),
                linear-gradient(145deg, var(--white-10) 0%, transparent 50%)
              `,
              color: 'var(--text-primary)',
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-primary)',
              borderBottom: '1px solid var(--border-secondary)',
              boxShadow:
                '0 4px 20px var(--primary-20), inset 0 1px 0 var(--white-20)',
            }}
          >
            {/* 3D Icon with Enhanced Animation */}
            <div
              className='d-flex align-items-center justify-content-center rounded-circle position-relative flex-shrink-0'
              style={{
                width: '56px',
                height: '56px',
                background:
                  'linear-gradient(145deg, var(--white-20), var(--white-10))',
                border: '2px solid var(--white-20)',
                backdropFilter: 'blur(15px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow:
                  '0 8px 25px var(--primary-20), inset 0 2px 4px var(--white-10)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  'scale(1.1) translateY(-2px) rotate(5deg)';
                e.currentTarget.style.background =
                  'linear-gradient(145deg, var(--white-25), var(--white-15))';
                e.currentTarget.style.boxShadow =
                  '0 12px 35px var(--primary-30), inset 0 2px 4px var(--white-20)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  'scale(1) translateY(0) rotate(0deg)';
                e.currentTarget.style.background =
                  'linear-gradient(145deg, var(--white-20), var(--white-10))';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px var(--primary-20), inset 0 2px 4px var(--white-10)';
              }}
            >
              <FaPlus
                size={window.innerWidth < 768 ? 18 : 22}
                style={{
                  filter: 'drop-shadow(0 2px 4px var(--bg-quaternary))',
                }}
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
                    'radial-gradient(circle, var(--primary-blue-light) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                  zIndex: -1,
                  animation: 'iconGlow 3s ease-in-out infinite',
                }}
              />
            </div>

            <div className='flex-grow-1'>
              <h1
                className='fw-bold mb-0'
                style={{
                  fontSize: 'clamp(1.2rem, 4vw, 1.75rem)',
                  letterSpacing: '-0.02em',
                  textShadow:
                    '0 2px 8px var(--bg-quaternary), 0 0 20px var(--white-10)',
                  background:
                    'linear-gradient(145deg, var(--text-primary), var(--text-secondary), var(--text-tertiary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 4px var(--bg-quaternary))',
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
                        'linear-gradient(145deg, var(--primary-10), var(--primary-blue-light)10)',
                      borderRadius: '20px',
                      border: '1px solid var(--border-primary)',
                      backdropFilter: 'blur(20px)',
                      boxShadow:
                        '0 8px 25px var(--bg-quaternary), inset 0 1px 0 var(--white-10)',
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
                            ? 'linear-gradient(145deg, var(--border-muted), var(--border-subtle))'
                            : applicantValidation.hasErrors
                            ? 'linear-gradient(145deg, var(--error-primary) 0%, var(--error-dark) 100%)'
                            : applicantValidation.missingFields
                            ? 'linear-gradient(145deg, var(--warning-primary) 0%, var(--warning-dark) 100%)'
                            : 'linear-gradient(145deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)',
                        color: 'var(--text-primary)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow:
                          loading || !applicantValidation.isValid
                            ? '0 4px 15px var(--bg-quaternary)'
                            : applicantValidation.hasErrors
                            ? '0 6px 20px var(--error-40), 0 0 30px var(--error-20)'
                            : applicantValidation.missingFields
                            ? '0 6px 20px var(--warning-40), 0 0 30px var(--warning-20)'
                            : '0 6px 20px var(--primary-40), 0 0 30px var(--primary-20)',
                        gap: '12px',
                        textShadow: '0 2px 4px var(--bg-quaternary)',
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
                              ? '0 12px 35px var(--error-30), 0 0 40px var(--error-10)'
                              : applicantValidation.missingFields
                              ? '0 12px 35px var(--warning-30), 0 0 40px var(--warning-10)'
                              : '0 12px 35px var(--primary-30), 0 0 40px var(--primary-10)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading && applicantValidation.isValid) {
                          e.currentTarget.style.transform =
                            'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow =
                            applicantValidation.hasErrors
                              ? '0 6px 20px var(--error-40), 0 0 30px var(--error-20)'
                              : applicantValidation.missingFields
                              ? '0 6px 20px var(--warning-40), 0 0 30px var(--warning-20)'
                              : '0 6px 20px var(--primary-40), 0 0 30px var(--primary-20)';
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
                              'linear-gradient(90deg, transparent, var(--white-10), transparent)',
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
                            ? 'linear-gradient(145deg, var(--error-20), var(--error-30))'
                            : 'linear-gradient(145deg, var(--primary-20), var(--primary-30))',
                          color: isError
                            ? 'var(--error-light)'
                            : 'var(--primary-blue-light)',
                          borderRadius: '16px',
                          border: isError
                            ? '1px solid var(--error-30)'
                            : '1px solid var(--primary-30)',
                          backdropFilter: 'blur(20px)',
                          fontWeight: '600',
                          boxShadow: isError
                            ? '0 8px 25px var(--error-20), inset 0 1px 0 var(--white-10)'
                            : '0 8px 25px var(--primary-20), inset 0 1px 0 var(--white-10)',
                          textShadow: '0 2px 4px var(--bg-quaternary)',
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
                              ? 'linear-gradient(145deg, var(--error-primary), var(--error-dark))'
                              : 'linear-gradient(145deg, var(--primary-blue), var(--primary-blue-dark))',
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isError
                              ? '0 6px 20px var(--error-30), inset 0 2px 4px var(--white-10)'
                              : '0 6px 20px var(--primary-20), inset 0 2px 4px var(--white-10)',
                            border: '2px solid var(--white-10)',
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
            inset 0 1px 0 var(--white-20),
            0 0 80px var(--primary-20);
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
          0%, 100% { opacity: 0.6; transform: scale(1);}
          50% { opacity: 1; transform: scale(1.1);}
        }
        @media (max-width: 768px) {
          .modern-main-card { border-radius: 16px !important; }
          .modern-main-card:hover { transform: translateY(-3px) scale(1.005);}
        }
        @media (min-width: 992px) {
          .modern-main-card { border-radius: 28px !important; }
        }
      `}</style>
    </div>
  );
}
