
import { useDropzone } from 'react-dropzone';
import { API_URL } from '../../../../baseUrls';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../../../GenericFunctions/AxiosGenericFunctions';
import { TbClick } from 'react-icons/tb';

import { motion } from 'framer-motion';
import {useCallback, useMemo, useState} from "react";

const FilesDropZone = ({ applicationId }) => {
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [fileRejections, setFileRejections] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className='card-body'>
      <div
        style={{
          border: '1px solid white',
          borderRadius: '5px',
          padding: '5px',
        }}
        className='shadow-lg'
      >
        <div className='card-header'>
          <h5 className='card-title'>Upload Supporting Documents</h5>
        </div>

        <div className='my-4 bg-light p-2 rounded-2'>
          <div className='card-body'>
            <div
              {...getRootProps({ className: 'dropzone' })}
              style={{
                border: '2px dashed #007bff',
                padding: '30px',
                textAlign: 'center',
              }}
            >
              <input {...getInputProps()} />
              <div className='row mx-1'>
                <div className='col-10'>
                  <p>Drag & drop some files here, or click to select files</p>
                  <em>
                    (Accepted file types: jpeg, jpg, png, gif, bmp, webp, pdf,
                    doc, docx, xls, xlsx, ppt, pptx, txt, rtf, odt, ods, odp)
                  </em>
                </div>
                <div className='col-2'>
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 0.9, 1] }}
                    transition={{
                      duration: 0.5, // Duration of the click animation
                      repeat: Infinity,
                      repeatType: 'loop',
                      repeatDelay: 0.5, // Time between each click animation
                    }}
                  >
                    <TbClick size={40} className=' icon-shadow' />
                  </motion.div>
                </div>
              </div>
            </div>
            <aside className='mt-3'>
              <h4>Accepted files</h4>
              <ul>{acceptedFileItems}</ul>
              <h4>Rejected files</h4>
              <ul>{fileRejectionItems}</ul>
            </aside>
            <div className='row'>
              <button
                onClick={uploadFilesHandler}
                className='btn btn-info ms-auto shadow'
                disabled={acceptedFiles.length < 1}
              >
                {isLoading ? (
                  <div className='spinner-border text-warning' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                  </div>
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
                >
                  {uploadStatus}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesDropZone;
