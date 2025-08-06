import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
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

  console.log('REQUIREMENT UPLOAD MODAL RENDERED', requirement);

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
        const extension = file.name.slice(file.name.lastIndexOf('.'));
        let originalName;

        if (
          requirement.template_filename &&
          requirement.template_filename.trim()
        ) {
          originalName = requirement.template_filename;
        } else {
          originalName = `${requirement.document_type.name}${extension}`;
        }

        formData.append('original_name', originalName);

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

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUploading) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '20px',
          border: '1px solid var(--border-primary)',
          background: 'var(--surface-primary)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'var(--gradient-header)',
            color: 'var(--text-primary)',
            borderBottom: '1px solid var(--border-primary)',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUpload
              size={24}
              style={{ color: 'var(--warning-primary)', marginRight: '12px' }}
            />
            <div>
              <h4
                style={{
                  margin: '0 0 4px 0',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                }}
              >
                Upload Document
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  opacity: 0.9,
                }}
              >
                {requirement.document_type.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '24px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: 0.9,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', background: 'var(--surface-primary)' }}>
          {/* Requirement Info */}
          <div
            style={{
              marginBottom: '24px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <FaFileAlt
                size={20}
                style={{
                  color: 'var(--primary-blue)',
                  marginRight: '12px',
                  marginTop: '4px',
                }}
              />
              <div>
                <h6
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {requirement.document_type.name}
                </h6>
                {requirement.document_type.description && (
                  <p
                    style={{
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {requirement.document_type.description}
                  </p>
                )}
                {requirement.document_type.signature_required && (
                  <div>
                    <span
                      style={{
                        backgroundColor: 'var(--warning-20)',
                        color: 'var(--warning-primary)',
                        fontSize: '0.75rem',
                        border: '1px solid var(--warning-30)',
                        borderRadius: '12px',
                        padding: '4px 8px',
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
            style={{
              border: isDragActive
                ? '2px dashed var(--primary-blue)'
                : '2px dashed var(--border-muted)',
              backgroundColor: isDragActive
                ? 'var(--primary-20)'
                : 'var(--surface-secondary)',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
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
                style={{
                  color: 'var(--primary-blue)',
                  marginBottom: '12px',
                }}
              />
            </motion.div>

            <p
              style={{
                marginBottom: '8px',
                fontWeight: '500',
                color: 'var(--text-primary)',
              }}
            >
              {isDragActive
                ? 'Drop the file here'
                : 'Drag & drop a file here, or click to select'}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              Accepted: PDF, DOC, DOCX, XLS, XLSX, Images
            </p>
          </div>

          {/* Accepted Files */}
          {acceptedFiles.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h6
                style={{
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                Selected File:
              </h6>
              {acceptedFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-20)',
                    border: '1px solid var(--primary-30)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaFileAlt
                      style={{
                        color: 'var(--primary-blue)',
                        marginRight: '8px',
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: '500',
                          fontSize: '0.9rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {file.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  {!isUploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file);
                      }}
                      style={{
                        color: 'var(--error-primary)',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        padding: '4px',
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
            <div style={{ marginTop: '16px' }}>
              <h6
                style={{
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: 'var(--error-primary)',
                }}
              >
                Rejected Files:
              </h6>
              {fileRejections.map(({ file, errors }, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--error-20)',
                    border: '1px solid var(--error-30)',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      color: 'var(--error-primary)',
                    }}
                  >
                    {file.name}
                  </div>
                  {errors.map((error, errorIndex) => (
                    <div
                      key={errorIndex}
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--error-primary)',
                      }}
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
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  borderRadius: '12px',
                  backgroundColor: isError
                    ? 'var(--error-20)'
                    : 'var(--success-20)',
                  border: `1px solid ${
                    isError ? 'var(--error-30)' : 'var(--success-30)'
                  }`,
                  color: isError
                    ? 'var(--error-primary)'
                    : 'var(--success-primary)',
                  padding: '12px',
                  margin: 0,
                }}
              >
                {uploadStatus}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid var(--border-muted)',
            padding: '20px 24px',
            background: 'var(--surface-primary)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            onClick={onClose}
            disabled={isUploading}
            style={{
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: '600',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-secondary)',
              cursor: isUploading ? 'not-allowed' : 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={uploadFilesHandler}
            disabled={acceptedFiles.length === 0 || isUploading}
            style={{
              background:
                acceptedFiles.length > 0 && !isUploading
                  ? 'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))'
                  : 'var(--surface-tertiary)',
              color:
                acceptedFiles.length > 0 && !isUploading
                  ? 'white'
                  : 'var(--text-disabled)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: '600',
              minWidth: '120px',
              cursor:
                acceptedFiles.length === 0 || isUploading
                  ? 'not-allowed'
                  : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isUploading ? (
              <LoadingComponent message='' />
            ) : (
              <>
                <FaUpload style={{ marginRight: '8px' }} size={14} />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render the modal at the document body level
  return createPortal(modalContent, document.body);
};

export default RequirementUploadModal;
