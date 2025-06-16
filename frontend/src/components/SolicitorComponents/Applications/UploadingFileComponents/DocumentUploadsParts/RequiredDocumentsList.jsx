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
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              border: '1px solid #bbf7d0',
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
              backgroundColor: '#fef3c7',
              color: '#d97706',
              border: '1px solid #fed7aa',
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
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca',
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
      <FaUser className='text-primary' size={12} />
    ) : (
      <FaUserTie className='text-secondary' size={12} />
    );
  };

  const getCardBorderColor = (requirement) => {
    const status = getRequirementStatus(requirement);
    switch (status) {
      case 'completed':
        return 'linear-gradient(90deg, #10b981, #059669)';
      case 'pending_signature':
        return 'linear-gradient(90deg, #f59e0b, #d97706)';
      default:
        return 'linear-gradient(90deg, #ef4444, #dc2626)';
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
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: '20px',
          border: '1px solid #bae6fd',
        }}
      >
        <div
          className='rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3'
          style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
            color: '#0891b2',
            border: '3px solid #bae6fd',
          }}
        >
          <FaFileAlt size={32} />
        </div>
        <h4 className='fw-bold mb-2' style={{ color: '#0891b2' }}>
          No Document Requirements Set
        </h4>
        <p className='mb-0 text-muted'>
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
                  background:
                    'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid #e2e8f0',
                  transition:
                    'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  overflow: 'hidden',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 25px 50px -12px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.transform =
                    'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.background =
                    'linear-gradient(145deg, #ffffff 0%, #ffffff 100%)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background =
                    'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)';
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
                            ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                            : status === 'pending_signature'
                            ? 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)'
                            : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                        color:
                          status === 'completed'
                            ? '#16a34a'
                            : status === 'pending_signature'
                            ? '#d97706'
                            : '#dc2626',
                        border: `2px solid ${
                          status === 'completed'
                            ? '#bbf7d0'
                            : status === 'pending_signature'
                            ? '#fed7aa'
                            : '#fecaca'
                        }`,
                      }}
                    >
                      <FaFileAlt size={18} />
                    </div>
                    <div className='flex-grow-1'>
                      <div className='d-flex align-items-center mb-1'>
                        <h6
                          className='mb-0 fw-bold text-dark me-2'
                          style={{ fontSize: '0.95rem' }}
                        >
                          {documentType.name}
                        </h6>
                        <span
                          className='badge'
                          style={{
                            backgroundColor: '#f1f5f9',
                            color: '#64748b',
                            fontSize: '0.65rem',
                            fontWeight: '500',
                          }}
                        >
                          Required
                        </span>
                      </div>
                      <p
                        className='mb-0 text-muted'
                        style={{
                          fontSize: '0.8rem',
                          lineHeight: '1.3',
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
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <div
                            className='fw-bold text-dark'
                            style={{ fontSize: '0.8rem' }}
                          >
                            Status
                          </div>
                          <div
                            className='text-muted'
                            style={{ fontSize: '0.7rem' }}
                          >
                            {requirement.is_uploaded ? 'Uploaded' : 'Missing'}
                          </div>
                        </div>
                      </div>
                      <div className='col-4'>
                        <div
                          className='p-2 rounded-3'
                          style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <div
                            className='fw-bold text-dark'
                            style={{ fontSize: '0.8rem' }}
                          >
                            Priority
                          </div>
                          <div
                            className='text-muted'
                            style={{ fontSize: '0.7rem' }}
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
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <div
                            className='fw-bold text-dark'
                            style={{ fontSize: '0.8rem' }}
                          >
                            Added
                          </div>
                          <div
                            className='text-muted'
                            style={{ fontSize: '0.7rem' }}
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
                            ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                            : 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                        border: `1px solid ${
                          status === 'completed' ? '#bbf7d0' : '#fed7aa'
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
                                    ? '#16a34a'
                                    : '#d97706',
                                fontSize: '0.8rem',
                              }}
                            >
                              {documentType.who_needs_to_sign === 'applicant'
                                ? 'Applicant'
                                : 'Solicitor'}{' '}
                              Signature Required
                            </div>
                            <div
                              className='text-muted'
                              style={{ fontSize: '0.7rem' }}
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
                            style={{ color: '#d97706' }}
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
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #bae6fd',
                      }}
                    >
                      <div className='d-flex align-items-center'>
                        <FaCheckCircle
                          className='text-success me-2'
                          size={16}
                        />
                        <div>
                          <div
                            className='fw-bold text-dark'
                            style={{ fontSize: '0.8rem' }}
                          >
                            Uploaded:{' '}
                            {requirement.uploaded_document.original_name}
                          </div>
                          <div
                            className='text-muted'
                            style={{ fontSize: '0.7rem' }}
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
                            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                            'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background =
                            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
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
                          backgroundColor: '#dcfce7',
                          border: '1px solid #bbf7d0',
                          color: '#16a34a',
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
