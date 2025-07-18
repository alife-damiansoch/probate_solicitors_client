// DocumentModal.jsx - Modern modal to display actual documents
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  FaCheckCircle,
  FaDownload,
  FaEye,
  FaFileAlt,
  FaTimes,
} from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { fetchDocumentForSigning } from '../../../../../GenericFunctions/AxiosGenericFunctions';

const DocumentModal = ({ isOpen, onClose, document, onRead, token }) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [hasStartedReading, setHasStartedReading] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen && document) {
      fetchDocumentContent();
      setIsScrolledToBottom(false);
      setHasStartedReading(false);
      setError(null);
    }
  }, [isOpen, document, token]);

  const fetchDocumentContent = async () => {
    if (!document || !token) return;

    setIsLoading(true);
    try {
      const fileName = document.document.split('/').pop();
      const response = await fetchDocumentForSigning(
        token,
        `/api/applications/solicitor_applications/document_file/download/${fileName}/`
      );

      if (response && response.data) {
        // Create blob URL for PDF viewing
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDocumentUrl(url);
      } else {
        setError('Failed to load document content');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      setError('Error loading document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentTypeIcon = () => {
    if (document?.is_terms_of_business)
      return (
        <HiOutlineDocumentText
          style={{ color: 'var(--primary-blue)' }}
          size={24}
        />
      );
    if (document?.is_secci)
      return (
        <FaFileAlt style={{ color: 'var(--warning-primary)' }} size={24} />
      );
    return <FaFileAlt style={{ color: 'var(--text-secondary)' }} size={24} />;
  };

  const getDocumentTypeName = () => {
    if (document?.is_terms_of_business) return 'Terms of Business';
    if (document?.is_secci) return 'SECCI Document';
    return 'Document';
  };

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = document?.original_name || 'document.pdf';
      link.click();
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial='hidden'
          animate='visible'
          exit='hidden'
          className='position-fixed w-100 h-100 d-flex align-items-center justify-content-center'
          style={{
            top: 0,
            left: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='position-relative'
            style={{
              width: '100vw',
              height: '100vh',
              background: 'var(--gradient-surface)',
              boxShadow: '0 25px 50px var(--primary-30)',
              border: '1px solid var(--border-primary)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className='card-header border-0 p-3'
              style={{
                background:
                  'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)',
                borderRadius: '0',
                minHeight: '80px',
                border: '1px solid var(--border-muted)',
              }}
            >
              <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center'>
                  <div className='me-3'>{getDocumentTypeIcon()}</div>
                  <div>
                    <h5 style={{ color: '#ffffff' }} className='mb-1 fw-bold'>
                      {getDocumentTypeName()}
                    </h5>
                    <small style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {document?.original_name}
                    </small>
                  </div>
                </div>
                <div className='d-flex align-items-center'>
                  {documentUrl && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDownload}
                      className='btn btn-sm me-2'
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        color: '#ffffff',
                        borderRadius: '8px',
                      }}
                      title='Download Document'
                    >
                      <FaDownload size={16} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className='btn btn-sm'
                    style={{
                      fontSize: '16px',
                      padding: '8px 12px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      color: '#ffffff',
                      borderRadius: '8px',
                    }}
                  >
                    <FaTimes size={20} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              ref={contentRef}
              style={{
                height: 'calc(100vh - 160px)',
                overflow: 'hidden',
                background: 'var(--surface-secondary)',
              }}
            >
              {isLoading ? (
                <div className='d-flex align-items-center justify-content-center h-100'>
                  <div className='text-center p-5'>
                    <div
                      className='spinner-border mb-3'
                      style={{ color: 'var(--primary-blue)' }}
                      role='status'
                    >
                      <span className='visually-hidden'>Loading...</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>
                      Loading document...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className='d-flex align-items-center justify-content-center h-100'>
                  <div
                    className='text-center p-5'
                    style={{ color: 'var(--error-primary)' }}
                  >
                    <FaTimes size={48} className='mb-3 opacity-50' />
                    <p>{error}</p>
                  </div>
                </div>
              ) : documentUrl ? (
                <iframe
                  src={`${documentUrl}#view=FitH&toolbar=1&navpanes=1&scrollbar=1&page=1&zoom=100`}
                  className='w-100 h-100 border-0'
                  title={document?.original_name}
                  style={{
                    minHeight: 'calc(100vh - 160px)',
                    background: 'var(--surface-primary)',
                  }}
                  onLoad={() => {
                    // For iframe, we'll consider it "scrolled" after a few seconds
                    setTimeout(() => {
                      setHasStartedReading(true);
                      setTimeout(() => {
                        setIsScrolledToBottom(true);
                      }, 5000); // Give user more time to read in full screen
                    }, 2000);
                  }}
                />
              ) : (
                <div className='d-flex align-items-center justify-content-center h-100'>
                  <div className='text-center p-5'>
                    <FaFileAlt
                      size={48}
                      className='mb-3'
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <p style={{ color: 'var(--text-muted)' }}>
                      No document content available
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className='card-footer border-0 p-3'
              style={{
                background: 'var(--gradient-surface)',
                borderRadius: '0',
                minHeight: '80px',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10000,
                border: '1px solid var(--border-muted)',
                borderBottom: 'none',
                borderLeft: 'none',
                borderRight: 'none',
              }}
            >
              <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center'>
                  <FaEye
                    className='me-2'
                    style={{
                      color: hasStartedReading
                        ? 'var(--success-primary)'
                        : 'var(--text-muted)',
                    }}
                    size={16}
                  />
                  <small
                    style={{
                      color: hasStartedReading
                        ? 'var(--success-primary)'
                        : 'var(--text-muted)',
                    }}
                  >
                    {hasStartedReading
                      ? 'Document viewed'
                      : 'Please review the document'}
                  </small>
                </div>

                <motion.button
                  whileHover={{ scale: isScrolledToBottom ? 1.05 : 1 }}
                  whileTap={{ scale: isScrolledToBottom ? 0.95 : 1 }}
                  onClick={() => {
                    if (isScrolledToBottom) {
                      onRead(document);
                      onClose();
                    }
                  }}
                  disabled={!isScrolledToBottom}
                  className='btn btn-lg fw-bold px-4 py-2'
                  style={{
                    borderRadius: '12px',
                    backgroundColor: isScrolledToBottom
                      ? 'var(--success-primary)'
                      : 'var(--text-muted)',
                    color: '#ffffff',
                    border: 'none',
                    boxShadow: isScrolledToBottom
                      ? '0 4px 15px var(--success-40)'
                      : 'none',
                    fontSize: '18px',
                    opacity: isScrolledToBottom ? 1 : 0.6,
                    cursor: isScrolledToBottom ? 'pointer' : 'not-allowed',
                  }}
                >
                  <FaCheckCircle className='me-2' size={18} />
                  Confirm Read & Continue
                </motion.button>
              </div>

              {!isScrolledToBottom && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-center mt-2'
                >
                  <small
                    className='fw-bold'
                    style={{ color: 'var(--warning-dark)' }}
                  >
                    <span
                      className='badge me-2 animate-pulse'
                      style={{
                        backgroundColor: 'var(--warning-primary)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      ●
                    </span>
                    Please review the entire document to continue (wait 5
                    seconds after viewing)
                  </small>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DocumentModal;
