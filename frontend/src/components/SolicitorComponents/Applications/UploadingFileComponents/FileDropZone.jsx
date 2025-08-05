import { useDropzone } from 'react-dropzone';
import { TbClick } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../baseUrls';
import { uploadFile } from '../../../GenericFunctions/AxiosGenericFunctions';

import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';

const FilesDropZone = ({ applicationId }) => {
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [fileRejections, setFileRejections] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const navigate = useNavigate();

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
    setIsLoading(true);
    setIsUploadingFiles(true);
    setUploadStatus('Uploading');
    console.log('Uploading files: ');
    console.log(uploadedFiles);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('document', file, file.name);

      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ', ' + pair[1]);
      // }

      try {
        const response = await uploadFile(
          `${API_URL}/api/applications/solicitor_applications/document_file/${applicationId}/`,
          formData
        );

        if (response.status === 201) {
          setIsLoading(false);
          navigate(`/applications/${applicationId}`);
        } else {
          setIsLoading(false);
          console.log(response.data);
          setIsError(`Error uploading document: ${file.name}`, response.data);
        }
      } catch (error) {
        console.error(`Error uploading document: ${file.name}`, error);
        setIsError(`Error uploading document: ${file.name}`, error);
        setIsLoading(false);
        throw error; // Rethrow error to stop further uploads if needed
      }
    }
    setIsUploadingFiles(false);
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newAcceptedFiles = [];
      const newFileRejections = [];

      acceptedFiles.forEach((file) => {
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

      setUploadedFiles((prevFiles) => [...prevFiles, ...newAcceptedFiles]);
      setAcceptedFiles((prev) => [...prev, ...newAcceptedFiles]);
      setFileRejections((prev) => [...prev, ...newFileRejections]);
    },
    [setUploadedFiles, validExtensions]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={`${file.path}-${file.lastModified}`}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={`${file.path}-${file.lastModified}`}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(2deg); }
            66% { transform: translateY(-5px) rotate(-1deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 15px var(--primary-30); }
            50% { box-shadow: 0 0 30px var(--primary-40), 0 0 40px var(--primary-30); }
          }
        `}
      </style>

      <div
        className='card-body'
        style={{
          background: 'var(--gradient-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          boxShadow: `
            0 10px 25px var(--primary-10), 
            0 0 20px var(--primary-20)
          `,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Glow */}
        <div
          className='position-absolute w-100 h-100'
          style={{
            top: 0,
            left: 0,
            background: `
              radial-gradient(circle at 20% 30%, var(--primary-20) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, var(--success-20) 0%, transparent 50%)
            `,
            animation: 'pulse 4s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            border: '1px solid var(--border-primary)',
            borderRadius: '8px',
            padding: '5px',
            background: 'var(--surface-secondary)',
            position: 'relative',
          }}
          className='shadow-lg'
        >
          <div
            className='card-header'
            style={{
              background: 'var(--surface-primary)',
              border: 'none',
              borderRadius: '6px 6px 0 0',
            }}
          >
            <div
              className='position-absolute w-100'
              style={{
                top: 0,
                left: 0,
                height: '1px',
                background: `linear-gradient(90deg, 
                  transparent, 
                  var(--primary-40), 
                  transparent
                )`,
                animation: 'shimmer 2s infinite',
              }}
            />
            <h5
              className='card-title'
              style={{
                background: `linear-gradient(135deg, 
                  var(--text-primary), 
                  var(--text-secondary), 
                  var(--primary-blue)
                )`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
              }}
            >
              Upload Supporting Documents
            </h5>
          </div>

          <div
            className='my-4 p-2 rounded-2'
            style={{
              background: 'var(--surface-secondary)',
            }}
          >
            <div
              className='card-body'
              style={{
                background: 'transparent',
              }}
            >
              <div
                {...getRootProps({ className: 'dropzone' })}
                style={{
                  border: '2px dashed var(--primary-blue)',
                  padding: '30px',
                  textAlign: 'center',
                  background: 'var(--surface-primary)',
                  borderRadius: '8px',
                }}
              >
                <input {...getInputProps()} />
                <div className='row mx-1'>
                  <div className='col-10'>
                    <p style={{ color: 'var(--text-primary)' }}>
                      Drag & drop some files here, or click to select files
                    </p>
                    <em style={{ color: 'var(--text-muted)' }}>
                      (Accepted file types: jpeg, jpg, png, gif, bmp, webp, pdf,
                      doc, docx, xls, xlsx, ppt, pptx, txt, rtf, odt, ods, odp)
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
                      style={{
                        animation: 'float 3s ease-in-out infinite',
                      }}
                    >
                      <TbClick
                        size={40}
                        className='icon-shadow'
                        style={{
                          color: 'var(--primary-blue)',
                          filter: 'drop-shadow(0 0 10px var(--primary-40))',
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
              <aside className='mt-3'>
                <h4 style={{ color: 'var(--text-primary)' }}>Accepted files</h4>
                <ul style={{ color: 'var(--text-secondary)' }}>
                  {acceptedFileItems}
                </ul>
                <h4 style={{ color: 'var(--text-primary)' }}>Rejected files</h4>
                <ul style={{ color: 'var(--error-primary)' }}>
                  {fileRejectionItems}
                </ul>
              </aside>
              <div className='row'>
                <button
                  onClick={uploadFilesHandler}
                  className='btn ms-auto shadow'
                  disabled={acceptedFiles.length < 1}
                  style={{
                    background:
                      acceptedFiles.length > 0
                        ? 'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))'
                        : 'var(--surface-tertiary)',
                    border: 'none',
                    color:
                      acceptedFiles.length > 0 ? 'white' : 'var(--text-muted)',
                    boxShadow:
                      acceptedFiles.length > 0
                        ? '0 8px 20px var(--primary-30)'
                        : 'none',
                  }}
                >
                  {isUploadingFiles ? (
                    <LoadingComponent message='Uploading file...' />
                  ) : (
                    'Upload files'
                  )}
                </button>
              </div>
              {uploadStatus !== '' && (
                <div className='row'>
                  <p
                    className={`text-center my-1 ${
                      isError ? 'text-danger' : 'text-success'
                    }`}
                    style={{
                      color: isError
                        ? 'var(--error-primary)'
                        : 'var(--success-primary)',
                    }}
                  >
                    {uploadStatus}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilesDropZone;
