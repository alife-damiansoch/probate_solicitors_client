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
      return <HiOutlineDocumentText className='text-primary' size={20} />;
    if (doc.is_secci) return <FaFileAlt className='text-warning' size={20} />;
    return <FaFileAlt className='text-secondary' size={20} />;
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
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        {/* Header */}
        <div
          className='card-header border-0 text-center py-4'
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px 16px 0 0',
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
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
            }}
          >
            <FaEye className='text-white' size={24} />
          </motion.div>
          <h5 className='text-white mb-2 fw-bold'>
            Pre-Agreement Documentation
          </h5>
          <p className='text-white-50 mb-0'>
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

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className={`card mb-3 border-2 position-relative ${
                    isCurrent
                      ? 'border-primary bg-primary-subtle'
                      : isRead
                      ? 'border-success bg-success-subtle'
                      : 'border-light bg-light'
                  }`}
                  style={{
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isCurrent
                      ? '0 8px 25px rgba(102, 126, 234, 0.2)'
                      : isRead
                      ? '0 4px 15px rgba(40, 167, 69, 0.2)'
                      : '0 2px 10px rgba(0, 0, 0, 0.1)',
                  }}
                  onClick={() => onDocumentClick(doc)}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className='card-body p-3'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex align-items-center'>
                        <div
                          className={`me-3 p-2 rounded ${
                            isRead
                              ? 'bg-success text-white'
                              : isCurrent
                              ? 'bg-primary text-white'
                              : 'bg-secondary text-white'
                          }`}
                          style={{ borderRadius: '8px' }}
                        >
                          {getDocumentIcon(doc)}
                        </div>
                        <div className='flex-grow-1'>
                          <div className='d-flex align-items-center mb-1'>
                            <h6 className='mb-0 fw-bold text-dark me-2'>
                              {getDocumentTypeName(doc)}
                            </h6>
                            <span
                              className={`badge ${
                                doc.is_terms_of_business
                                  ? 'bg-primary'
                                  : 'bg-warning'
                              } text-xs`}
                            >
                              {doc.is_terms_of_business ? 'T&C' : 'SECCI'}
                            </span>
                          </div>
                          <p className='text-muted mb-1 small'>
                            {getDocumentDescription(doc)}
                          </p>
                          <small className='text-muted'>
                            {doc.original_name}
                          </small>
                        </div>
                      </div>

                      <div className='text-center'>
                        {isRead ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className='text-success mb-1'
                          >
                            <FaCheckCircle size={24} />
                          </motion.div>
                        ) : (
                          <FaCircle
                            className={`${
                              isCurrent ? 'text-primary' : 'text-muted'
                            } mb-1`}
                            size={24}
                          />
                        )}
                        <div>
                          <span
                            className={`badge ${
                              isRead
                                ? 'bg-success'
                                : isCurrent
                                ? 'bg-primary'
                                : 'bg-secondary'
                            }`}
                            style={{ fontSize: '10px' }}
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
            style={{ backgroundColor: '#f8fafc', borderRadius: '12px' }}
          >
            <div className='card-body p-4'>
              <div className='d-flex align-items-center justify-content-between mb-3'>
                <div>
                  <h6 className='mb-1 fw-bold text-dark'>Reading Progress</h6>
                  <small className='text-muted'>
                    {readDocuments.length} of {documents.length} documents
                    reviewed
                  </small>
                </div>
                <div className='text-end'>
                  <div className='h4 mb-0 fw-bold text-primary'>
                    {Math.round(
                      (readDocuments.length / documents.length) * 100
                    )}
                    %
                  </div>
                  <small className='text-muted'>Complete</small>
                </div>
              </div>

              {/* Progress Dots */}
              <div className='d-flex justify-content-center mb-3'>
                {documents.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: index < readDocuments.length ? 1.2 : 1 }}
                    className={`rounded-circle me-2 ${
                      index < readDocuments.length ? 'bg-success' : 'bg-light'
                    }`}
                    style={{
                      width: '12px',
                      height: '12px',
                      boxShadow:
                        index < readDocuments.length
                          ? '0 2px 8px rgba(40, 167, 69, 0.4)'
                          : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div
                className='progress'
                style={{ height: '8px', borderRadius: '8px' }}
              >
                <motion.div
                  className='progress-bar bg-success'
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (readDocuments.length / documents.length) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ borderRadius: '8px' }}
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
                    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                }}
              >
                <FaCheckCircle className='me-2' size={18} />
                Proceed to Agreement Signing
              </motion.button>
              <p className='text-muted mt-3 small'>
                All required documents have been reviewed. You may now proceed
                with signing the loan agreement.
              </p>
            </motion.div>
          )}

          {!allDocumentsRead && (
            <div className='text-center'>
              <div className='d-inline-flex align-items-center text-warning'>
                <span className='badge bg-warning text-dark me-2'>●</span>
                <small className='text-muted'>
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
