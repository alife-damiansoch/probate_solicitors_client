// DocumentReadingProgress.jsx - Progress tracker component
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCircle, FaEye, FaFileAlt } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';

const DocumentReadingProgress = ({
  documents,
  readDocuments,
  onDocumentClick,
  currentDocument,
  allDocumentsRead,
  onProceedToSigning,
}) => {
  const getDocumentIcon = (doc) => {
    if (doc.is_terms_of_business)
      return (
        <HiOutlineDocumentText
          style={{ color: 'var(--primary-blue)' }}
          size={20}
        />
      );
    if (doc.is_secci)
      return (
        <FaFileAlt style={{ color: 'var(--warning-primary)' }} size={20} />
      );
    return <FaFileAlt style={{ color: 'var(--text-secondary)' }} size={20} />;
  };

  const getDocumentTypeName = (doc) => {
    if (doc.is_terms_of_business) return 'Terms of Business';
    if (doc.is_secci) return 'SECCI Document';
    return 'Document';
  };

  const getDocumentDescription = (doc) => {
    if (doc.is_terms_of_business)
      return 'Legal terms and conditions governing our professional relationship';
    if (doc.is_secci) return 'Standard European Consumer Credit Information';
    return 'Important document requiring your review';
  };

  return (
    <div className='card-body'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='card shadow-lg border-0'
        style={{
          borderRadius: '16px',
          background: 'var(--gradient-surface)',
          border: '1px solid var(--border-primary)',
        }}
      >
        {/* Header */}
        <div
          className='card-header border-0 text-center py-4'
          style={{
            background:
              'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)',
            borderRadius: '16px 16px 0 0',
            border: '1px solid var(--border-muted)',
          }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className='d-inline-flex align-items-center justify-content-center mb-3'
            style={{
              width: '60px',
              height: '60px',
              background: 'var(--primary-20)',
              borderRadius: '16px',
            }}
          >
            <FaEye style={{ color: '#ffffff' }} size={24} />
          </motion.div>
          <h5 style={{ color: '#ffffff' }} className='mb-2 fw-bold'>
            Pre-Agreement Documentation
          </h5>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }} className='mb-0'>
            Before proceeding with your loan agreement, please carefully review
            all required documents. These contain important information about
            terms, conditions, and your rights as a borrower.
          </p>
        </div>

        <div className='card-body p-4'>
          {/* Document List */}
          <div className='mb-4'>
            {documents.map((doc, index) => {
              const isRead = readDocuments.some(
                (readDoc) => readDoc.id === doc.id
              );
              const isCurrent = currentDocument?.id === doc.id;

              const getCardStyles = () => {
                if (isCurrent) {
                  return {
                    borderColor: 'var(--primary-blue)',
                    backgroundColor: 'var(--primary-10)',
                    boxShadow: '0 8px 25px var(--primary-30)',
                  };
                }
                if (isRead) {
                  return {
                    borderColor: 'var(--success-primary)',
                    backgroundColor: 'var(--success-20)',
                    boxShadow: '0 4px 15px var(--success-30)',
                  };
                }
                return {
                  borderColor: 'var(--border-muted)',
                  backgroundColor: 'var(--surface-secondary)',
                  boxShadow: '0 2px 10px var(--primary-10)',
                };
              };

              const getBadgeColor = () => {
                if (isRead) return 'var(--success-primary)';
                if (isCurrent) return 'var(--primary-blue)';
                return 'var(--text-muted)';
              };

              const getIconBackground = () => {
                if (isRead) return 'var(--success-primary)';
                if (isCurrent) return 'var(--primary-blue)';
                return 'var(--text-muted)';
              };

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className='card mb-3 border-2 position-relative'
                  style={{
                    ...getCardStyles(),
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                  }}
                  onClick={() => onDocumentClick(doc)}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className='card-body p-3'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex align-items-center'>
                        <div
                          className='me-3 p-2 rounded'
                          style={{
                            borderRadius: '8px',
                            backgroundColor: getIconBackground(),
                            color: '#ffffff',
                          }}
                        >
                          {getDocumentIcon(doc)}
                        </div>
                        <div className='flex-grow-1'>
                          <div className='d-flex align-items-center mb-1'>
                            <h6
                              className='mb-0 fw-bold me-2'
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {getDocumentTypeName(doc)}
                            </h6>
                            <span
                              className='badge text-xs'
                              style={{
                                backgroundColor: doc.is_terms_of_business
                                  ? 'var(--primary-blue)'
                                  : 'var(--warning-primary)',
                                color: '#ffffff',
                              }}
                            >
                              {doc.is_terms_of_business ? 'T&C' : 'SECCI'}
                            </span>
                          </div>
                          <p
                            className='mb-1 small'
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {getDocumentDescription(doc)}
                          </p>
                          <small style={{ color: 'var(--text-muted)' }}>
                            {doc.original_name}
                          </small>
                        </div>
                      </div>

                      <div className='text-center'>
                        {isRead ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className='mb-1'
                            style={{ color: 'var(--success-primary)' }}
                          >
                            <FaCheckCircle size={24} />
                          </motion.div>
                        ) : (
                          <FaCircle
                            className='mb-1'
                            style={{ color: getBadgeColor() }}
                            size={24}
                          />
                        )}
                        <div>
                          <span
                            className='badge'
                            style={{
                              fontSize: '10px',
                              backgroundColor: getBadgeColor(),
                              color: '#ffffff',
                            }}
                          >
                            {isRead
                              ? 'Completed'
                              : isCurrent
                              ? 'In Progress'
                              : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress Overview */}
          <div
            className='card border-0 mb-4'
            style={{
              backgroundColor: 'var(--surface-secondary)',
              borderRadius: '12px',
              border: '1px solid var(--border-muted)',
            }}
          >
            <div className='card-body p-4'>
              <div className='d-flex align-items-center justify-content-between mb-3'>
                <div>
                  <h6
                    className='mb-1 fw-bold'
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Reading Progress
                  </h6>
                  <small style={{ color: 'var(--text-muted)' }}>
                    {readDocuments.length} of {documents.length} documents
                    reviewed
                  </small>
                </div>
                <div className='text-end'>
                  <div
                    className='h4 mb-0 fw-bold'
                    style={{ color: 'var(--primary-blue)' }}
                  >
                    {Math.round(
                      (readDocuments.length / documents.length) * 100
                    )}
                    %
                  </div>
                  <small style={{ color: 'var(--text-muted)' }}>Complete</small>
                </div>
              </div>

              {/* Progress Dots */}
              <div className='d-flex justify-content-center mb-3'>
                {documents.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: index < readDocuments.length ? 1.2 : 1 }}
                    className='rounded-circle me-2'
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor:
                        index < readDocuments.length
                          ? 'var(--success-primary)'
                          : 'var(--border-muted)',
                      boxShadow:
                        index < readDocuments.length
                          ? '0 2px 8px var(--success-40)'
                          : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div
                className='progress'
                style={{
                  height: '8px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--border-muted)',
                }}
              >
                <motion.div
                  className='progress-bar'
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (readDocuments.length / documents.length) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    borderRadius: '8px',
                    backgroundColor: 'var(--success-primary)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          {allDocumentsRead && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center'
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onProceedToSigning}
                className='btn btn-lg fw-bold px-4 py-3'
                style={{
                  background:
                    'linear-gradient(135deg, var(--warning-primary) 0%, var(--warning-dark) 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px var(--warning-30)',
                }}
              >
                <FaCheckCircle className='me-2' size={18} />
                Proceed to Agreement Signing
              </motion.button>
              <p style={{ color: 'var(--text-muted)' }} className='mt-3 small'>
                All required documents have been reviewed. You may now proceed
                with signing the loan agreement.
              </p>
            </motion.div>
          )}

          {!allDocumentsRead && (
            <div className='text-center'>
              <div className='d-inline-flex align-items-center'>
                <span
                  className='badge me-2'
                  style={{
                    backgroundColor: 'var(--warning-primary)',
                    color: 'var(--text-primary)',
                  }}
                >
                  ●
                </span>
                <small style={{ color: 'var(--text-muted)' }}>
                  Please review all documents to proceed with signing
                </small>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentReadingProgress;
