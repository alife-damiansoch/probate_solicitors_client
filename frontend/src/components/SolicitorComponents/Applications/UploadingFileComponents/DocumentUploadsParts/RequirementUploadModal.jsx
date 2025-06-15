import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileAlt, FaTimes, FaUpload } from 'react-icons/fa';
import { TbClick } from 'react-icons/tb';
import { API_URL } from '../../../../../baseUrls';
import LoadingComponent from '../../../../GenericComponents/LoadingComponent';
import { uploadFile } from '../../../../GenericFunctions/AxiosGenericFunctions';

const RequirementUploadModal = ({
  requirement,
  applicationId,
  onClose,
  onUploadComplete,
}) => {
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [fileRejections, setFileRejections] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validExtensions = useMemo(
    () => [
      '.jpeg',
      '.jpg',
      '.png',
      '.gif',
      '.bmp',
      '.webp',
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.txt',
      '.rtf',
      '.odt',
      '.ods',
      '.odp',
    ],
    []
  );

  const uploadFilesHandler = async () => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    setUploadStatus('Uploading...');
    setIsError(false);

    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('document', file, file.name);
        formData.append('document_type_requirement', requirement.id);
        formData.append('original_name', file.name); // Set original name

        const response = await uploadFile(
          `${API_URL}/api/applications/solicitor_applications/document_file/${applicationId}/`,
          formData
        );

        if (response.status === 201) {
          setUploadStatus(`Successfully uploaded: ${file.name}`);
        } else {
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      // Call success callback after a short delay to show success message
      setTimeout(() => {
        onUploadComplete();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error uploading files:', error);
      setIsError(true);
      setUploadStatus('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(
    (droppedFiles) => {
      const newAcceptedFiles = [];
      const newFileRejections = [];

      droppedFiles.forEach((file) => {
        const fileExtension = file.name
          .slice(file.name.lastIndexOf('.'))
          .toLowerCase();

        if (validExtensions.includes(fileExtension)) {
          newAcceptedFiles.push(file);
        } else {
          newFileRejections.push({
            file,
            errors: [
              { code: 'file-invalid-type', message: 'File type not accepted' },
            ],
          });
        }
      });

      setAcceptedFiles((prev) => [...prev, ...newAcceptedFiles]);
      setFileRejections((prev) => [...prev, ...newFileRejections]);
    },
    [validExtensions]
  );

  const removeFile = (fileToRemove) => {
    setAcceptedFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // Only one file per requirement
    disabled: isUploading,
  });

  return (
    <div
      className='modal show d-block'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUploading) {
          onClose();
        }
      }}
    >
      <div className='modal-dialog modal-lg modal-dialog-centered'>
        <div
          className='modal-content'
          style={{ borderRadius: '20px', border: 'none', overflow: 'hidden' }}
        >
          {/* Header */}
          <div
            className='modal-header'
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderBottom: 'none',
              padding: '24px',
            }}
          >
            <div className='d-flex align-items-center'>
              <FaUpload className='me-3' size={24} />
              <div>
                <h4 className='modal-title mb-1 fw-bold'>Upload Document</h4>
                <p className='mb-0 opacity-90' style={{ fontSize: '0.9rem' }}>
                  {requirement.document_type.name}
                </p>
              </div>
            </div>
            <button
              type='button'
              className='btn-close btn-close-white'
              onClick={onClose}
              disabled={isUploading}
              style={{ fontSize: '1.2rem' }}
            ></button>
          </div>

          {/* Body */}
          <div className='modal-body p-4'>
            {/* Requirement Info */}
            <div
              className='mb-4 p-3 rounded-3'
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <div className='d-flex align-items-start'>
                <FaFileAlt
                  className='me-3 mt-1'
                  size={20}
                  style={{ color: '#667eea' }}
                />
                <div>
                  <h6 className='fw-bold text-dark mb-1'>
                    {requirement.document_type.name}
                  </h6>
                  {requirement.document_type.description && (
                    <p
                      className='mb-2 text-muted'
                      style={{ fontSize: '0.9rem' }}
                    >
                      {requirement.document_type.description}
                    </p>
                  )}
                  {requirement.document_type.signature_required && (
                    <div className='d-flex align-items-center'>
                      <span
                        className='badge rounded-pill px-2 py-1'
                        style={{
                          backgroundColor: '#fef3c7',
                          color: '#d97706',
                          fontSize: '0.75rem',
                        }}
                      >
                        Signature Required (
                        {requirement.document_type.who_needs_to_sign})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              {...getRootProps()}
              className={`dropzone rounded-3 p-4 text-center position-relative ${
                isDragActive ? 'border-primary bg-light' : ''
              }`}
              style={{
                border: isDragActive
                  ? '2px dashed #667eea'
                  : '2px dashed #cbd5e1',
                backgroundColor: isDragActive ? '#f8fafc' : '#ffffff',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <input {...getInputProps()} disabled={isUploading} />

              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isDragActive ? 1.1 : [1, 0.95, 1] }}
                transition={{
                  duration: 0.5,
                  repeat: isDragActive ? 0 : Infinity,
                  repeatType: 'loop',
                  repeatDelay: 1,
                }}
              >
                <TbClick
                  size={40}
                  style={{ color: '#667eea', marginBottom: '12px' }}
                />
              </motion.div>

              <p className='mb-2 fw-medium' style={{ color: '#374151' }}>
                {isDragActive
                  ? 'Drop the file here'
                  : 'Drag & drop a file here, or click to select'}
              </p>
              <p className='mb-0 text-muted' style={{ fontSize: '0.8rem' }}>
                Accepted: PDF, DOC, DOCX, XLS, XLSX, Images
              </p>
            </div>

            {/* Accepted Files */}
            {acceptedFiles.length > 0 && (
              <div className='mt-3'>
                <h6 className='fw-bold mb-2'>Selected File:</h6>
                {acceptedFiles.map((file, index) => (
                  <div
                    key={index}
                    className='d-flex align-items-center justify-content-between p-3 rounded-3'
                    style={{
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bae6fd',
                    }}
                  >
                    <div className='d-flex align-items-center'>
                      <FaFileAlt
                        className='me-2'
                        style={{ color: '#0891b2' }}
                      />
                      <div>
                        <div
                          className='fw-medium'
                          style={{ fontSize: '0.9rem' }}
                        >
                          {file.name}
                        </div>
                        <div
                          className='text-muted'
                          style={{ fontSize: '0.8rem' }}
                        >
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    {!isUploading && (
                      <button
                        className='btn btn-sm'
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file);
                        }}
                        style={{
                          color: '#dc2626',
                          border: 'none',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <FaTimes size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Rejected Files */}
            {fileRejections.length > 0 && (
              <div className='mt-3'>
                <h6 className='fw-bold mb-2 text-danger'>Rejected Files:</h6>
                {fileRejections.map(({ file, errors }, index) => (
                  <div
                    key={index}
                    className='p-3 rounded-3'
                    style={{
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                    }}
                  >
                    <div
                      className='fw-medium text-danger'
                      style={{ fontSize: '0.9rem' }}
                    >
                      {file.name}
                    </div>
                    {errors.map((error, errorIndex) => (
                      <div
                        key={errorIndex}
                        className='text-danger'
                        style={{ fontSize: '0.8rem' }}
                      >
                        {error.message}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Status */}
            {uploadStatus && (
              <div className='mt-3'>
                <div
                  className={`alert ${
                    isError ? 'alert-danger' : 'alert-success'
                  } mb-0`}
                  style={{ borderRadius: '12px' }}
                >
                  {uploadStatus}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className='modal-footer'
            style={{ borderTop: '1px solid #e2e8f0', padding: '20px 24px' }}
          >
            <button
              type='button'
              className='btn btn-secondary'
              onClick={onClose}
              disabled={isUploading}
              style={{
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '600',
              }}
            >
              Cancel
            </button>
            <button
              type='button'
              className='btn'
              onClick={uploadFilesHandler}
              disabled={acceptedFiles.length === 0 || isUploading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '600',
                minWidth: '120px',
              }}
            >
              {isUploading ? (
                <LoadingComponent message='' />
              ) : (
                <>
                  <FaUpload className='me-2' size={14} />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementUploadModal;
