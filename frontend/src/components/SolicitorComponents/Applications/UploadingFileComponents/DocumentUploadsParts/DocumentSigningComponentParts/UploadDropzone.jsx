// UploadDropzone.jsx - File upload dropzone component
import { motion } from 'framer-motion';
import { TbClick } from 'react-icons/tb';

const UploadDropzone = ({
  getRootProps,
  getInputProps,
  documentType,
  acceptedFiles,
  fileRejections,
}) => {
  const getDocumentTypeLabel = () => {
    if (documentType?.is_undertaking) return 'Solicitor Undertaking';
    if (documentType?.is_loan_agreement) return 'Advancement Agreement';
    return 'Document';
  };

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li
      key={`${file.name}-${file.lastModified || 'existing'}`}
      className='list-group-item d-flex justify-content-between align-items-center'
    >
      <div>
        <strong>{file.name}</strong>
        <small className='text-muted d-block'>
          {file.size
            ? `${Math.round(file.size / 1024)} KB`
            : 'Existing document'}
        </small>
      </div>
      <span className='badge bg-success rounded-pill'>Ready</span>
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li
      key={`${file.name}-${file.lastModified}`}
      className='list-group-item list-group-item-danger'
    >
      <strong>{file.name}</strong> - {Math.round(file.size / 1024)} KB
      <ul className='mb-0 mt-1'>
        {errors.map((e) => (
          <li key={e.code} className='text-danger small'>
            {e.message}
          </li>
        ))}
      </ul>
    </li>
  ));

  return (
    <div className='card-body'>
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '0',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        className='shadow-lg'
      >
        {/* Header */}
        <div
          className='card-header'
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px 16px 0 0',
            padding: '0.75rem 1rem',
          }}
        >
          <h5 className='card-title mb-0'>
            Upload{' '}
            <span className='text-warning'>{getDocumentTypeLabel()}</span>{' '}
            Document
          </h5>
        </div>

        <div className='p-2'>
          <div className='card-body p-0'>
            {/* Dropzone */}
            <div
              {...getRootProps({ className: 'dropzone' })}
              style={{
                border: '2px dashed #667eea',
                padding: '20px',
                textAlign: 'center',
                borderRadius: '12px',
                background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
                marginBottom: '15px',
              }}
            >
              <input {...getInputProps()} />
              <div className='row mx-1'>
                <div className='col-10'>
                  <p className='mb-1'>
                    Drag & drop a{' '}
                    <span className='text-primary fw-bold'>
                      {getDocumentTypeLabel()}
                    </span>{' '}
                    (PDF) document here, or click to select a file.
                  </p>
                  <em className='text-muted' style={{ fontSize: '0.8rem' }}>
                    (Only one PDF file is accepted)
                  </em>
                </div>
                <div className='col-2'>
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 0.9, 1] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: 'loop',
                      repeatDelay: 0.5,
                    }}
                  >
                    <TbClick size={30} className='text-primary' />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* File Lists */}
            <div className='mb-2'>
              <h6
                className='fw-bold text-dark mb-2'
                style={{ fontSize: '0.9rem' }}
              >
                Documents to Sign
              </h6>
              {acceptedFiles.length > 0 ? (
                <ul className='list-group list-group-flush'>
                  {acceptedFileItems}
                </ul>
              ) : (
                <div
                  className='alert alert-warning border-0 py-2'
                  style={{ borderRadius: '12px' }}
                >
                  <small>No document loaded yet.</small>
                </div>
              )}

              {fileRejectionItems.length > 0 && (
                <>
                  <h6
                    className='fw-bold text-danger mt-2 mb-1'
                    style={{ fontSize: '0.8rem' }}
                  >
                    Rejected Files
                  </h6>
                  <ul className='list-group list-group-flush'>
                    {fileRejectionItems}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDropzone;
