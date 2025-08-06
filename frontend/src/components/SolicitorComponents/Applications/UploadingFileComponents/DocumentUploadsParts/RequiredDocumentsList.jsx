import { useState } from 'react';
import {
  FaBolt,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaExclamationTriangle,
  FaFileAlt,
  FaFilePdf,
  FaFileSignature,
  FaMagic,
  FaUpload,
  FaUser,
  FaUserTie,
} from 'react-icons/fa';
import { downloadFileAxios } from '../../../../GenericFunctions/AxiosGenericFunctions';
import RequirementUploadModal from './RequirementUploadModal';

const RequiredDocumentsList = ({
  requirements,
  application,
  token,
  onDocumentUploaded,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState(null);
  const [templateError, setTemplateError] = useState(null);

  const getRequirementStatus = (requirement) => {
    if (requirement.is_uploaded) {
      const doc = requirement.uploaded_document;
      if (
        requirement.document_type.signature_required &&
        doc &&
        !doc.is_signed
      ) {
        return 'pending_signature';
      }
      return 'completed';
    }
    return 'missing';
  };

  const getStatusBadge = (requirement) => {
    const status = getRequirementStatus(requirement);

    switch (status) {
      case 'completed':
        return (
          <span
            className='badge rounded-pill px-3 py-2 d-flex align-items-center'
            style={{
              backgroundColor: 'var(--success-20)',
              color: 'var(--success-primary)',
              border: '1px solid var(--success-30)',
              fontSize: '0.7rem',
              fontWeight: '600',
            }}
          >
            <FaCheckCircle className='me-1' size={10} />
            Complete
          </span>
        );
      case 'pending_signature':
        return (
          <span
            className='badge rounded-pill px-3 py-2 d-flex align-items-center'
            style={{
              backgroundColor: 'var(--warning-20)',
              color: 'var(--warning-primary)',
              border: '1px solid var(--warning-30)',
              fontSize: '0.7rem',
              fontWeight: '600',
            }}
          >
            <FaClock className='me-1' size={10} />
            Needs Signature
          </span>
        );
      default:
        return (
          <span
            className='badge rounded-pill px-3 py-2 d-flex align-items-center'
            style={{
              backgroundColor: 'var(--error-20)',
              color: 'var(--error-primary)',
              border: '1px solid var(--error-30)',
              fontSize: '0.7rem',
              fontWeight: '600',
            }}
          >
            <FaExclamationTriangle className='me-1' size={10} />
            Missing
          </span>
        );
    }
  };

  const getSignerIcon = (signer) => {
    return signer === 'applicant' ? (
      <FaUser style={{ color: 'var(--primary-blue)' }} size={12} />
    ) : (
      <FaUserTie style={{ color: 'var(--text-secondary)' }} size={12} />
    );
  };

  const getCardBorderColor = (requirement) => {
    const status = getRequirementStatus(requirement);
    switch (status) {
      case 'completed':
        return 'linear-gradient(90deg, var(--success-primary), var(--success-dark))';
      case 'pending_signature':
        return 'linear-gradient(90deg, var(--warning-primary), var(--warning-dark))';
      default:
        return 'linear-gradient(90deg, var(--error-primary), var(--error-dark))';
    }
  };

  const handleUploadClick = (requirement) => {
    setSelectedRequirement(requirement);
    setShowUploadModal(true);
  };

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    setSelectedRequirement(null);
    onDocumentUploaded();
  };

  const handleTemplateDownload = async (requirement) => {
    if (!requirement.template_available || !requirement.template_download_url) {
      return;
    }

    setDownloadingTemplate(requirement.id);
    setTemplateError(null);

    try {
      // Use the existing downloadFileAxios function
      const response = await downloadFileAxios(
        token,
        requirement.template_download_url
      );

      // Check if the response was successful
      if (!response || !(response.status >= 200 && response.status < 300)) {
        throw new Error(
          `Failed to download template: ${response?.status || 'Unknown error'}`
        );
      }

      // The response.data contains the blob
      const blob = response.data;

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download =
        requirement.template_filename ||
        `${requirement.document_type.name}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Template download error:', error);
      setTemplateError(requirement.id);
      setTimeout(() => setTemplateError(null), 3000);
    } finally {
      setDownloadingTemplate(null);
    }
  };

  if (requirements.length === 0) {
    return (
      <div
        className='text-center py-5'
        style={{
          background: 'var(--primary-20)',
          borderRadius: '20px',
          border: '1px solid var(--primary-30)',
        }}
      >
        <div
          className='rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3'
          style={{
            width: '80px',
            height: '80px',
            background: 'var(--primary-30)',
            color: 'var(--primary-blue)',
            border: '3px solid var(--primary-40)',
          }}
        >
          <FaFileAlt size={32} />
        </div>
        <h4 className='fw-bold mb-2' style={{ color: 'var(--primary-blue)' }}>
          No Document Requirements Set
        </h4>
        <p className='mb-0' style={{ color: 'var(--text-muted)' }}>
          No specific documents have been marked as required for this
          application yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='row g-3'>
        {requirements.map((requirement) => {
          const status = getRequirementStatus(requirement);
          const documentType = requirement.document_type;
          const hasTemplate = requirement.template_available;
          const isDownloading = downloadingTemplate === requirement.id;
          const hasError = templateError === requirement.id;

          return (
            <div key={requirement.id} className='col-md-6'>
              <div
                className='card border-0 h-100 position-relative'
                style={{
                  borderRadius: '16px',
                  background: 'var(--gradient-surface)',
                  border: '1px solid var(--border-muted)',
                  transition:
                    'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  overflow: 'hidden',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 25px 50px -12px var(--primary-20)';
                  e.currentTarget.style.transform =
                    'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.background = 'var(--surface-primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = 'var(--gradient-surface)';
                }}
              >
                {/* Status Border */}
                <div
                  className='position-absolute'
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: getCardBorderColor(requirement),
                  }}
                ></div>

                <div className='card-body p-4'>
                  {/* Badges Section - Above content */}
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div className='d-flex gap-2'>
                      {/* Template Available Badge */}
                      {hasTemplate && (
                        <span
                          className='badge rounded-pill px-2 py-1 d-flex align-items-center'
                          style={{
                            backgroundColor: 'var(--primary-blue)',
                            color: 'white',
                            fontSize: '0.65rem',
                            fontWeight: '600',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          }}
                        >
                          <FaBolt className='me-1' size={8} />
                          Auto-Generate
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div>{getStatusBadge(requirement)}</div>
                  </div>
                  {/* Document Header */}
                  <div className='d-flex align-items-start mb-3'>
                    <div
                      className='rounded-3 d-flex align-items-center justify-content-center me-3'
                      style={{
                        width: '48px',
                        height: '48px',
                        background:
                          status === 'completed'
                            ? 'var(--success-20)'
                            : status === 'pending_signature'
                            ? 'var(--warning-20)'
                            : 'var(--error-20)',
                        color:
                          status === 'completed'
                            ? 'var(--success-primary)'
                            : status === 'pending_signature'
                            ? 'var(--warning-primary)'
                            : 'var(--error-primary)',
                        border: `2px solid ${
                          status === 'completed'
                            ? 'var(--success-30)'
                            : status === 'pending_signature'
                            ? 'var(--warning-30)'
                            : 'var(--error-30)'
                        }`,
                      }}
                    >
                      <FaFileAlt size={18} />
                    </div>
                    <div className='flex-grow-1'>
                      <div className='d-flex align-items-center mb-1'>
                        <h6
                          className='mb-0 fw-bold me-2'
                          style={{
                            fontSize: '0.95rem',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {documentType.name}
                        </h6>
                        <span
                          className='badge'
                          style={{
                            backgroundColor: 'var(--surface-secondary)',
                            color: 'var(--text-muted)',
                            fontSize: '0.65rem',
                            fontWeight: '500',
                          }}
                        >
                          Required
                        </span>
                      </div>
                      <p
                        className='mb-0'
                        style={{
                          fontSize: '0.8rem',
                          lineHeight: '1.3',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {documentType.description || 'No description provided'}
                      </p>
                    </div>
                  </div>

                  {/* Template Generation Info */}
                  {hasTemplate && (
                    <div
                      className='mb-3 p-3 rounded-3'
                      style={{
                        background:
                          'linear-gradient(135deg, var(--primary-20), var(--primary-10))',
                        border: '1px solid var(--primary-30)',
                      }}
                    >
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='d-flex align-items-center'>
                          <FaMagic
                            className='me-2'
                            size={14}
                            style={{ color: 'var(--primary-blue)' }}
                          />
                          <div>
                            <div
                              className='fw-bold'
                              style={{
                                color: 'var(--primary-blue)',
                                fontSize: '0.8rem',
                              }}
                            >
                              Template Available
                            </div>
                            <div
                              style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                              }}
                            >
                              Auto-generated document ready for download
                            </div>
                          </div>
                        </div>
                        <FaFilePdf
                          size={16}
                          style={{ color: 'var(--error-primary)' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Requirement Details */}
                  <div className='mb-3'>
                    <div className='row g-2 text-center'>
                      <div className='col-4'>
                        <div
                          className='p-2 rounded-3'
                          style={{
                            backgroundColor: 'var(--surface-secondary)',
                            border: '1px solid var(--border-muted)',
                          }}
                        >
                          <div
                            className='fw-bold'
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-primary)',
                            }}
                          >
                            Status
                          </div>
                          <div
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {requirement.is_uploaded ? 'Uploaded' : 'Missing'}
                          </div>
                        </div>
                      </div>
                      <div className='col-4'>
                        <div
                          className='p-2 rounded-3'
                          style={{
                            backgroundColor: 'var(--surface-secondary)',
                            border: '1px solid var(--border-muted)',
                          }}
                        >
                          <div
                            className='fw-bold'
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-primary)',
                            }}
                          >
                            Priority
                          </div>
                          <div
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {documentType.signature_required
                              ? 'High'
                              : 'Normal'}
                          </div>
                        </div>
                      </div>
                      <div className='col-4'>
                        <div
                          className='p-2 rounded-3'
                          style={{
                            backgroundColor: 'var(--surface-secondary)',
                            border: '1px solid var(--border-muted)',
                          }}
                        >
                          <div
                            className='fw-bold'
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-primary)',
                            }}
                          >
                            Type
                          </div>
                          <div
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {hasTemplate ? 'Generated' : 'Upload'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Signature Info */}
                  {documentType.signature_required && (
                    <div
                      className='mb-3 p-3 rounded-3'
                      style={{
                        background:
                          status === 'completed'
                            ? 'var(--success-20)'
                            : 'var(--warning-20)',
                        border: `1px solid ${
                          status === 'completed'
                            ? 'var(--success-30)'
                            : 'var(--warning-30)'
                        }`,
                      }}
                    >
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='d-flex align-items-center'>
                          {getSignerIcon(documentType.who_needs_to_sign)}
                          <div className='ms-2'>
                            <div
                              className='fw-bold'
                              style={{
                                color:
                                  status === 'completed'
                                    ? 'var(--success-primary)'
                                    : 'var(--warning-primary)',
                                fontSize: '0.8rem',
                              }}
                            >
                              {documentType.who_needs_to_sign === 'applicant'
                                ? 'Applicant'
                                : 'Solicitor'}{' '}
                              Signature Required
                            </div>
                            <div
                              style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                              }}
                            >
                              {status === 'completed'
                                ? 'Document signed and complete'
                                : status === 'pending_signature'
                                ? 'Document uploaded, awaiting signature'
                                : 'Document must be uploaded and signed'}
                            </div>
                          </div>
                        </div>
                        {status !== 'completed' && (
                          <FaFileSignature
                            size={16}
                            style={{ color: 'var(--warning-primary)' }}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Uploaded Document Info */}
                  {requirement.is_uploaded && requirement.uploaded_document && (
                    <div
                      className='mb-3 p-3 rounded-3'
                      style={{
                        backgroundColor: 'var(--primary-20)',
                        border: '1px solid var(--primary-30)',
                      }}
                    >
                      <div className='d-flex align-items-center'>
                        <FaCheckCircle
                          className='me-2'
                          size={16}
                          style={{ color: 'var(--success-primary)' }}
                        />
                        <div>
                          <div
                            className='fw-bold'
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-primary)',
                              wordBreak: 'break-word', // Key line
                              whiteSpace: 'normal', // Ensures normal wrapping
                            }}
                          >
                            Uploaded:{' '}
                            {requirement.uploaded_document.original_name}
                          </div>
                          <br />
                          <div
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            Uploaded on:{' '}
                            {new Date(
                              requirement.uploaded_document.created_at
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Template Error */}
                  {hasError && (
                    <div
                      className='mb-3 p-2 rounded-3'
                      style={{
                        backgroundColor: 'var(--error-20)',
                        border: '1px solid var(--error-30)',
                      }}
                    >
                      <div className='d-flex align-items-center'>
                        <FaExclamationTriangle
                          className='me-2'
                          size={12}
                          style={{ color: 'var(--error-primary)' }}
                        />
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--error-primary)',
                          }}
                        >
                          Failed to download template. Please try again.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='d-flex gap-2'>
                    {/* Template Download Button - Enhanced Loading State  */}
                    {hasTemplate && !requirement.is_uploaded && (
                      <button
                        className='btn position-relative overflow-hidden'
                        onClick={() => handleTemplateDownload(requirement)}
                        disabled={isDownloading}
                        style={{
                          background: isDownloading
                            ? 'linear-gradient(135deg, var(--primary-30), var(--primary-40))'
                            : 'linear-gradient(135deg, var(--primary-blue), var(--primary-dark))',
                          border: 'none',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          padding: '0.8rem',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          minWidth: '120px',
                          flex: '1',
                          minHeight: '45px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseOver={(e) => {
                          if (!isDownloading) {
                            e.target.style.background =
                              'linear-gradient(135deg, var(--primary-dark), var(--primary-blue))';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow =
                              '0 8px 25px rgba(0,0,0,0.15)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isDownloading) {
                            e.target.style.background =
                              'linear-gradient(135deg, var(--primary-blue), var(--primary-dark))';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {/* Animated Background for Loading State */}
                        {isDownloading && (
                          <>
                            {/* Shimmer Effect */}
                            <div
                              className='position-absolute top-0 start-0 w-100 h-100'
                              style={{
                                background:
                                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                animation: 'shimmer 2s infinite linear',
                                zIndex: 1,
                              }}
                            />

                            {/* Pulsing Glow */}
                            <div
                              className='position-absolute top-0 start-0 w-100 h-100 rounded'
                              style={{
                                background:
                                  'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                animation: 'pulse 2s infinite ease-in-out',
                                zIndex: 1,
                              }}
                            />

                            {/* Progress Bar at Bottom */}
                            <div
                              className='position-absolute bottom-0 start-0 h-1 rounded-bottom'
                              style={{
                                background:
                                  'linear-gradient(90deg, var(--primary-blue), var(--success-primary), var(--primary-blue))',
                                animation: 'progressSlide 3s infinite linear',
                                zIndex: 2,
                                width: '100%',
                              }}
                            />
                          </>
                        )}

                        {/* Button Content */}
                        <div
                          className='position-relative d-flex align-items-center justify-content-center'
                          style={{ zIndex: 3 }}
                        >
                          {isDownloading ? (
                            <>
                              {/* Custom Spinning Icon */}
                              <div
                                className='me-2 d-flex align-items-center justify-content-center'
                                style={{
                                  width: '16px',
                                  height: '16px',
                                }}
                              >
                                <div
                                  style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    border: '2px solid var(--text-primary)',
                                    borderTop: '2px solid transparent',
                                    animation: 'spin 1s linear infinite',
                                  }}
                                />
                              </div>

                              {/* Animated Text */}
                              <span
                                className='d-inline-block'
                                style={{
                                  animation:
                                    'textPulse 2s infinite ease-in-out',
                                  color: 'var(--text-primary)',
                                  fontWeight: 600,
                                }}
                              >
                                Generating
                              </span>

                              {/* Animated Dots */}
                              <span
                                className='ms-1'
                                style={{ color: 'var(--text-primary)' }}
                              >
                                <span
                                  style={{ animation: 'dot1 1.5s infinite' }}
                                >
                                  .
                                </span>
                                <span
                                  style={{
                                    animation: 'dot2 1.5s infinite 0.2s',
                                  }}
                                >
                                  .
                                </span>
                                <span
                                  style={{
                                    animation: 'dot3 1.5s infinite 0.4s',
                                  }}
                                >
                                  .
                                </span>
                              </span>
                            </>
                          ) : (
                            <>
                              <FaDownload
                                className='me-2'
                                size={12}
                                style={{ color: 'var(--text-primary)' }}
                              />
                              <span
                                style={{
                                  color: 'var(--text-primary)',
                                  fontWeight: 600,
                                }}
                              >
                                Get Template
                              </span>
                            </>
                          )}
                        </div>

                        {/* Add CSS Animations */}
                        <style>{`
                          @keyframes shimmer {
                            0% {
                              transform: translateX(-100%);
                            }
                            100% {
                              transform: translateX(100%);
                            }
                          }

                          @keyframes pulse {
                            0%,
                            100% {
                              opacity: 0.3;
                            }
                            50% {
                              opacity: 0.6;
                            }
                          }

                          @keyframes progressSlide {
                            0% {
                              width: 0%;
                            }
                            50% {
                              width: 70%;
                            }
                            100% {
                              width: 100%;
                            }
                          }

                          @keyframes spin {
                            from {
                              transform: rotate(0deg);
                            }
                            to {
                              transform: rotate(360deg);
                            }
                          }

                          @keyframes textPulse {
                            0%,
                            100% {
                              opacity: 0.8;
                            }
                            50% {
                              opacity: 1;
                            }
                          }

                          @keyframes stepComplete {
                            0% {
                              transform: scale(0);
                              opacity: 0;
                            }
                            50% {
                              transform: scale(1.2);
                            }
                            100% {
                              transform: scale(1);
                              opacity: 1;
                            }
                          }

                          @keyframes stepActive {
                            0%,
                            100% {
                              transform: scale(1);
                              opacity: 0.8;
                            }
                            50% {
                              transform: scale(1.1);
                              opacity: 1;
                            }
                          }

                          @keyframes stepPending {
                            0%,
                            100% {
                              opacity: 0.3;
                            }
                            50% {
                              opacity: 0.6;
                            }
                          }

                          @keyframes pulseStep {
                            0%,
                            100% {
                              transform: scale(1);
                            }
                            50% {
                              transform: scale(1.3);
                            }
                          }
                        `}</style>
                      </button>
                    )}
                    {/* Upload Button */}
                    {!requirement.is_uploaded ? (
                      <button
                        className='btn'
                        onClick={() => handleUploadClick(requirement)}
                        style={{
                          background: hasTemplate
                            ? 'linear-gradient(135deg, var(--surface-secondary), var(--border-muted))'
                            : 'linear-gradient(135deg, var(--warning-primary), var(--warning-dark))',
                          border: hasTemplate
                            ? '1px solid var(--border-muted)'
                            : 'none',
                          color: hasTemplate ? 'var(--text-primary)' : 'white',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          padding: '0.8rem',
                          transition: 'all 0.2s ease',
                          flex: hasTemplate ? '0 0 auto' : '1',
                        }}
                        onMouseOver={(e) => {
                          if (hasTemplate) {
                            e.target.style.background =
                              'var(--surface-primary)';
                          } else {
                            e.target.style.background =
                              'linear-gradient(135deg, var(--warning-dark), var(--warning-primary))';
                          }
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          if (hasTemplate) {
                            e.target.style.background =
                              'linear-gradient(135deg, var(--surface-secondary), var(--border-muted))';
                          } else {
                            e.target.style.background =
                              'linear-gradient(135deg, var(--warning-primary), var(--warning-dark))';
                          }
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <FaUpload className='me-2' size={12} />
                        {hasTemplate ? 'Upload' : 'Upload Document'}
                      </button>
                    ) : (
                      <button
                        className='btn flex-fill'
                        style={{
                          backgroundColor: 'var(--success-20)',
                          border: '1px solid var(--success-30)',
                          color: 'var(--success-primary)',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          padding: '0.8rem',
                          cursor: 'default',
                        }}
                        disabled
                      >
                        <FaCheckCircle className='me-2' size={12} />
                        Requirement Fulfilled
                      </button>
                    )}
                  </div>

                  {/* Cutting-Edge Loading Animation - Under Buttons */}
                  {isDownloading && (
                    <div
                      className='mt-3 position-relative overflow-hidden'
                      style={{
                        height: '60px',
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.08))',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        animation:
                          'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}
                    >
                      {/* Animated Background Orbs */}
                      <div
                        className='position-absolute'
                        style={{
                          top: '-20px',
                          left: '10%',
                          width: '40px',
                          height: '40px',
                          background:
                            'radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent)',
                          borderRadius: '50%',
                          animation: 'float1 4s infinite ease-in-out',
                        }}
                      />
                      <div
                        className='position-absolute'
                        style={{
                          top: '20px',
                          right: '15%',
                          width: '60px',
                          height: '60px',
                          background:
                            'radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent)',
                          borderRadius: '50%',
                          animation: 'float2 5s infinite ease-in-out reverse',
                        }}
                      />
                      <div
                        className='position-absolute'
                        style={{
                          bottom: '-10px',
                          left: '60%',
                          width: '30px',
                          height: '30px',
                          background:
                            'radial-gradient(circle, rgba(245, 101, 101, 0.25), transparent)',
                          borderRadius: '50%',
                          animation: 'float3 3.5s infinite ease-in-out',
                        }}
                      />

                      {/* Main Content Container */}
                      <div
                        className='d-flex align-items-center justify-content-between h-100 px-4 position-relative'
                        style={{ zIndex: 10 }}
                      >
                        {/* Left Side - AI Generation Status */}
                        <div className='d-flex align-items-center'>
                          {/* Holographic AI Icon */}
                          <div
                            className='me-3 position-relative d-flex align-items-center justify-content-center'
                            style={{
                              width: '36px',
                              height: '36px',
                              background:
                                'linear-gradient(135deg, var(--primary-blue), var(--primary-dark))',
                              borderRadius: '12px',
                              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                              animation:
                                'hologramPulse 3s infinite ease-in-out',
                            }}
                          >
                            <FaMagic
                              size={16}
                              color='white'
                              style={{
                                filter:
                                  'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                              }}
                            />

                            {/* Holographic Ring */}
                            <div
                              className='position-absolute'
                              style={{
                                top: '-2px',
                                left: '-2px',
                                right: '-2px',
                                bottom: '-2px',
                                border: '1px solid rgba(59, 130, 246, 0.4)',
                                borderRadius: '14px',
                                animation: 'holoRing 2s infinite linear',
                              }}
                            />
                          </div>

                          {/* Status Text */}
                          <div>
                            <div
                              className='fw-bold d-flex align-items-center'
                              style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-primary)',
                                textShadow: '0 0 10px rgba(255,255,255,0.1)',
                              }}
                            >
                              <span className='me-2'>Generating Document</span>
                              <div className='d-flex' style={{ gap: '2px' }}>
                                <div
                                  className='rounded-circle'
                                  style={{
                                    width: '4px',
                                    height: '4px',
                                    background: 'var(--primary-blue)',
                                    animation: 'wave 1.5s infinite ease-in-out',
                                  }}
                                />
                                <div
                                  className='rounded-circle'
                                  style={{
                                    width: '4px',
                                    height: '4px',
                                    background: 'var(--primary-blue)',
                                    animation:
                                      'wave 1.5s infinite ease-in-out 0.2s',
                                  }}
                                />
                                <div
                                  className='rounded-circle'
                                  style={{
                                    width: '4px',
                                    height: '4px',
                                    background: 'var(--primary-blue)',
                                    animation:
                                      'wave 1.5s infinite ease-in-out 0.4s',
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                opacity: 0.8,
                              }}
                            >
                              This process may take a few moments
                            </div>
                          </div>
                        </div>

                        {/* Right Side - Neural Network Visualization */}
                        <div className='d-flex align-items-center'>
                          {/* Neural Network Nodes */}
                          <div
                            className='d-flex align-items-center me-3'
                            style={{ gap: '8px' }}
                          >
                            {/* Input Layer */}
                            <div
                              className='d-flex flex-column'
                              style={{ gap: '4px' }}
                            >
                              <div
                                className='rounded-circle'
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  background: 'var(--success-primary)',
                                  animation:
                                    'neuralPulse 2s infinite ease-in-out',
                                }}
                              />
                              <div
                                className='rounded-circle'
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  background: 'var(--success-primary)',
                                  animation:
                                    'neuralPulse 2s infinite ease-in-out 0.2s',
                                }}
                              />
                              <div
                                className='rounded-circle'
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  background: 'var(--success-primary)',
                                  animation:
                                    'neuralPulse 2s infinite ease-in-out 0.4s',
                                }}
                              />
                            </div>

                            {/* Connection Lines */}
                            <div className='position-relative'>
                              <div
                                style={{
                                  width: '12px',
                                  height: '1px',
                                  background:
                                    'linear-gradient(90deg, var(--success-primary), var(--primary-blue))',
                                  animation: 'dataFlow 2s infinite linear',
                                  marginBottom: '8px',
                                }}
                              />
                              <div
                                style={{
                                  width: '12px',
                                  height: '1px',
                                  background:
                                    'linear-gradient(90deg, var(--success-primary), var(--primary-blue))',
                                  animation: 'dataFlow 2s infinite linear 0.3s',
                                  marginBottom: '8px',
                                }}
                              />
                              <div
                                style={{
                                  width: '12px',
                                  height: '1px',
                                  background:
                                    'linear-gradient(90deg, var(--success-primary), var(--primary-blue))',
                                  animation: 'dataFlow 2s infinite linear 0.6s',
                                }}
                              />
                            </div>

                            {/* Processing Layer */}
                            <div
                              className='d-flex flex-column'
                              style={{ gap: '4px' }}
                            >
                              <div
                                className='rounded-circle'
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  background: 'var(--primary-blue)',
                                  animation:
                                    'processingPulse 1.5s infinite ease-in-out',
                                }}
                              />
                              <div
                                className='rounded-circle'
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  background: 'var(--primary-blue)',
                                  animation:
                                    'processingPulse 1.5s infinite ease-in-out 0.5s',
                                }}
                              />
                            </div>

                            {/* Output Connection */}
                            <div className='position-relative'>
                              <div
                                style={{
                                  width: '12px',
                                  height: '1px',
                                  background:
                                    'linear-gradient(90deg, var(--primary-blue), var(--warning-primary))',
                                  animation: 'dataFlow 2s infinite linear 1s',
                                  marginTop: '12px',
                                }}
                              />
                            </div>

                            {/* Output Node */}
                            <div
                              className='rounded-circle d-flex align-items-center justify-content-center'
                              style={{
                                width: '16px',
                                height: '16px',
                                background:
                                  'linear-gradient(135deg, var(--warning-primary), var(--error-primary))',
                                animation:
                                  'outputPulse 3s infinite ease-in-out',
                                boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)',
                              }}
                            >
                              <FaFilePdf size={8} color='white' />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Progress Indicator */}
                      <div
                        className='position-absolute bottom-0 start-0 h-1'
                        style={{
                          background:
                            'linear-gradient(90deg, var(--success-primary), var(--primary-blue), var(--warning-primary))',
                          animation: 'progressSweep 4s infinite ease-in-out',
                          borderRadius: '0 0 16px 16px',
                        }}
                      />

                      {/* CSS Animations */}
                      <style>{`
                        @keyframes slideUp {
                          from {
                            opacity: 0;
                            transform: translateY(20px);
                          }
                          to {
                            opacity: 1;
                            transform: translateY(0);
                          }
                        }

                        @keyframes float1 {
                          0%,
                          100% {
                            transform: translateY(0) rotate(0deg);
                          }
                          50% {
                            transform: translateY(-10px) rotate(180deg);
                          }
                        }

                        @keyframes float2 {
                          0%,
                          100% {
                            transform: translateY(0) scale(1);
                          }
                          50% {
                            transform: translateY(8px) scale(1.1);
                          }
                        }

                        @keyframes float3 {
                          0%,
                          100% {
                            transform: translateX(0) rotate(0deg);
                          }
                          50% {
                            transform: translateX(10px) rotate(90deg);
                          }
                        }

                        @keyframes hologramPulse {
                          0%,
                          100% {
                            transform: scale(1);
                            box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
                          }
                          50% {
                            transform: scale(1.05);
                            box-shadow: 0 12px 40px rgba(59, 130, 246, 0.5);
                          }
                        }

                        @keyframes holoRing {
                          0% {
                            transform: rotate(0deg) scale(1);
                            opacity: 0.4;
                          }
                          50% {
                            opacity: 0.8;
                          }
                          100% {
                            transform: rotate(360deg) scale(1.1);
                            opacity: 0.4;
                          }
                        }

                        @keyframes wave {
                          0%,
                          100% {
                            transform: scale(1);
                            opacity: 0.5;
                          }
                          50% {
                            transform: scale(1.5);
                            opacity: 1;
                          }
                        }

                        @keyframes neuralPulse {
                          0%,
                          100% {
                            transform: scale(1);
                            opacity: 0.6;
                          }
                          50% {
                            transform: scale(1.3);
                            opacity: 1;
                          }
                        }

                        @keyframes processingPulse {
                          0%,
                          100% {
                            transform: scale(1);
                            opacity: 0.7;
                          }
                          50% {
                            transform: scale(1.2);
                            opacity: 1;
                            box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
                          }
                        }

                        @keyframes outputPulse {
                          0%,
                          100% {
                            transform: scale(1);
                          }
                          33% {
                            transform: scale(1.1);
                            box-shadow: 0 0 16px rgba(245, 158, 11, 0.8);
                          }
                          66% {
                            transform: scale(1.05);
                          }
                        }

                        @keyframes dataFlow {
                          0% {
                            opacity: 0;
                            transform: scaleX(0);
                          }
                          50% {
                            opacity: 1;
                            transform: scaleX(1);
                          }
                          100% {
                            opacity: 0;
                            transform: scaleX(0);
                          }
                        }

                        @keyframes progressSweep {
                          0% {
                            width: 0%;
                          }
                          25% {
                            width: 30%;
                          }
                          50% {
                            width: 60%;
                          }
                          75% {
                            width: 85%;
                          }
                          100% {
                            width: 100%;
                          }
                        }
                      `}</style>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedRequirement && (
        <RequirementUploadModal
          requirement={selectedRequirement}
          applicationId={application.id}
          onClose={() => {
            setShowUploadModal(false);
            setSelectedRequirement(null);
          }}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </>
  );
};

export default RequiredDocumentsList;
