import { useState } from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFileAlt,
  FaFileSignature,
  FaUpload,
  FaUser,
  FaUserTie,
} from 'react-icons/fa';
import RequirementUploadModal from './RequirementUploadModal';

const RequiredDocumentsList = ({
  requirements,
  application,
  token,
  onDocumentUploaded,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

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
    // Refresh the documents list
    onDocumentUploaded();
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

                {/* Status Badge */}
                <div
                  className='position-absolute'
                  style={{
                    top: '16px',
                    right: '16px',
                    zIndex: 2,
                  }}
                >
                  {getStatusBadge(requirement)}
                </div>

                <div className='card-body p-4'>
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
                            Added
                          </div>
                          <div
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {new Date(
                              requirement.created_at
                            ).toLocaleDateString()}
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
                            }}
                          >
                            Uploaded:{' '}
                            {requirement.uploaded_document.original_name}
                          </div>
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

                  {/* Action Button */}
                  <div className='d-flex gap-2'>
                    {!requirement.is_uploaded ? (
                      <button
                        className='btn flex-fill'
                        onClick={() => handleUploadClick(requirement)}
                        style={{
                          background:
                            'linear-gradient(135deg, var(--warning-primary), var(--warning-dark))',
                          border: 'none',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          padding: '0.8rem',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background =
                            'linear-gradient(135deg, var(--warning-dark), var(--warning-primary))';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background =
                            'linear-gradient(135deg, var(--warning-primary), var(--warning-dark))';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <FaUpload className='me-2' size={12} />
                        Upload Document
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
