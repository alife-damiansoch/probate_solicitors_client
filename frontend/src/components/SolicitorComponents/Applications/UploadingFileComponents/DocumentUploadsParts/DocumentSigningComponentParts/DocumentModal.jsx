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
      return <HiOutlineDocumentText className='text-primary' size={24} />;
    if (document?.is_secci)
      return <FaFileAlt className='text-warning' size={24} />;
    return <FaFileAlt className='text-secondary' size={24} />;
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
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              border: 'none',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className='card-header border-0 p-3'
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '0',
                minHeight: '80px',
              }}
            >
              <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center'>
                  <div className='me-3'>{getDocumentTypeIcon()}</div>
                  <div>
                    <h5 className='text-white mb-1 fw-bold'>
                      {getDocumentTypeName()}
                    </h5>
                    <small className='text-white-50'>
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
                      className='btn btn-outline-light btn-sm me-2'
                      title='Download Document'
                    >
                      <FaDownload size={16} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className='btn btn-outline-light btn-sm'
                    style={{ fontSize: '16px', padding: '8px 12px' }}
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
                background: '#f8f9fa',
              }}
            >
              {isLoading ? (
                <div className='d-flex align-items-center justify-content-center h-100'>
                  <div className='text-center p-5'>
                    <div
                      className='spinner-border text-primary mb-3'
                      role='status'
                    >
                      <span className='visually-hidden'>Loading...</span>
                    </div>
                    <p className='text-muted'>Loading document...</p>
                  </div>
                </div>
              ) : error ? (
                <div className='d-flex align-items-center justify-content-center h-100'>
                  <div className='text-center text-danger p-5'>
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
                    background: 'white',
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
                    <FaFileAlt size={48} className='mb-3 text-muted' />
                    <p className='text-muted'>No document content available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className='card-footer border-0 p-3'
              style={{
                background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '0',
                minHeight: '80px',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10000,
              }}
            >
              <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center'>
                  <FaEye
                    className={
                      hasStartedReading
                        ? 'text-success me-2'
                        : 'text-muted me-2'
                    }
                    size={16}
                  />
                  <small
                    className={
                      hasStartedReading ? 'text-success' : 'text-muted'
                    }
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
                  className={`btn btn-lg fw-bold px-4 py-2 ${
                    isScrolledToBottom ? 'btn-success' : 'btn-secondary'
                  }`}
                  style={{
                    borderRadius: '12px',
                    boxShadow: isScrolledToBottom
                      ? '0 4px 15px rgba(40, 167, 69, 0.3)'
                      : 'none',
                    fontSize: '18px',
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
                  <small className='text-warning fw-bold'>
                    <span className='badge bg-warning text-dark me-2 animate-pulse'>
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
