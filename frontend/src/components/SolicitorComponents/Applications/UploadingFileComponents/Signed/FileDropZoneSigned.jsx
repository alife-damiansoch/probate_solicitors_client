import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { API_URL } from '../../../../../baseUrls';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../../../../GenericFunctions/AxiosGenericFunctions';
import { TbClick } from 'react-icons/tb';
import SignatureCanvas from 'react-signature-canvas';
import { motion } from 'framer-motion';

import {
  getDeviceInfo,
  getPublicIp,
} from '../../../../GenericFunctions/HelperGenericFunctions';

const FileDropZoneSigned = ({ applicationId, selectedDocumentType }) => {
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [fileRejections, setFileRejections] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [solicitorFullName, setSolicitorFullName] = useState(''); // Store solicitor's full name
  const [signatureProvided, setSignatureProvided] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const signaturePadRef = useRef(null); // Reference for signature canvas
  const navigate = useNavigate();

  // Define the confirmation message based on document type
  useEffect(() => {
    if (
      selectedDocumentType &&
      selectedDocumentType === 'Solicitor undertaking'
    ) {
      setConfirmationMessage(
        'I confirm that I am the solicitor currently assigned to this application. '
      );
    } else if (
      selectedDocumentType &&
      selectedDocumentType === 'Advancement agreement'
    ) {
      setConfirmationMessage(
        'By signing this agreement, you are confirming that you have read the Pre-contract Information, Adequate Explanation, Privacy Notice, and Terms & Conditions, and had the opportunity to ask for further information.'
      );
    } else {
      setConfirmationMessage('This message has to be changed');
    }
  }, [selectedDocumentType]);

  const validExtensions = useMemo(() => ['.pdf'], []);

  const uploadFilesHandler = async () => {
    setIsLoading(true);
    setUploadStatus('Uploading...');

    // Get the public IP of the client
    const publicIp = await getPublicIp();
    const deviceInfo = getDeviceInfo();

    console.log(deviceInfo);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      // console.log(file);
      formData.append('document', file, file.name);

      formData.append(
        'is_undertaking',
        selectedDocumentType === 'Solicitor undertaking'
      );
      formData.append(
        'is_loan_agreement',
        selectedDocumentType === 'Advancement agreement'
      );

      // Check if the signature pad has been signed
      if (signaturePadRef.current) {
        const canvas = signaturePadRef.current.getCanvas();
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;

        // Create a new canvas context and set a white background
        const context = newCanvas.getContext('2d');
        context.fillStyle = 'white'; // Set white background
        context.fillRect(0, 0, newCanvas.width, newCanvas.height);

        // Draw the existing signature on top of the white background
        context.drawImage(canvas, 0, 0);

        // Convert the new canvas with white background to a base64 string
        const signatureBase64 = newCanvas.toDataURL('image/png');
        console.log(signatureBase64);
        formData.append('signature_image', signatureBase64); // Add signature image to form data
      } else {
        setUploadStatus('Please provide a signature.');
        setIsLoading(false);
        return;
      }

      formData.append('confirmation', checkboxChecked ? 'true' : 'false'); // Add confirmation status
      formData.append('solicitor_full_name', solicitorFullName); // Include solicitor's full name
      formData.append('confirmation_message', confirmationMessage); // Include confirmation message text
      formData.append('device_info', JSON.stringify(deviceInfo));

      // Include the public IP in the form data
      if (publicIp) {
        formData.append('ip_address', publicIp); // Add the public IP if it's available
      }

      console.log(formData);

      try {
        const response = await uploadFile(
          `${API_URL}/api/signed_documents/upload/${applicationId}/`,
          formData
        );

        if (response.status === 201) {
          setIsLoading(false);
          navigate(`/applications/${applicationId}`);
        } else {
          setIsLoading(false);
          setIsError(`Error uploading document: ${file.name}`, response.data);
        }
      } catch (error) {
        console.error(`Error uploading document: ${file.name}`, error);
        setIsError(`Error uploading document: ${file.name}`, error);
        setIsLoading(false);
      }
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      let newAcceptedFiles = [];
      let newFileRejections = [...fileRejections];

      // Handle the case where multiple files are added
      if (acceptedFiles.length > 0) {
        // Keep only the last accepted file
        const lastAcceptedFile = acceptedFiles[acceptedFiles.length - 1];

        // Move any previously accepted file to rejections
        if (acceptedFiles.length > 1) {
          acceptedFiles.slice(0, -1).forEach((file) => {
            newFileRejections.push({
              file,
              errors: [
                {
                  code: 'file-replaced',
                  message: 'This file was replaced by a newer one.',
                },
              ],
            });
          });
        }

        // Check if the last file is of a valid type before accepting
        const fileExtension = lastAcceptedFile.name
          .slice(lastAcceptedFile.name.lastIndexOf('.'))
          .toLowerCase();
        if (validExtensions.includes(fileExtension)) {
          newAcceptedFiles = [lastAcceptedFile]; // Accept only the last file
        } else {
          // Add the last file to rejections if it has an invalid type
          newFileRejections.push({
            file: lastAcceptedFile,
            errors: [
              { code: 'file-invalid-type', message: 'File type not accepted.' },
            ],
          });
        }
      }

      // If there's an existing accepted file, move it to the rejection list as well
      if (
        acceptedFiles.length === 1 &&
        acceptedFiles[0] !== acceptedFiles[acceptedFiles.length - 1]
      ) {
        newFileRejections.push({
          file: acceptedFiles[0],
          errors: [
            {
              code: 'file-replaced',
              message: 'This file was replaced by a newer one.',
            },
          ],
        });
      }

      // Update the states
      setAcceptedFiles(newAcceptedFiles); // Only accept the last valid file
      setFileRejections(newFileRejections); // Move previous files to rejections
    },
    [fileRejections, validExtensions, setAcceptedFiles, setFileRejections]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true, // Allow multiple files to be added, but only accept the last one
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
  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setSignatureProvided(false);
    }
  };

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
          <h5 className='card-title'>
            Upload <span className='text-info'>{selectedDocumentType}</span>{' '}
            document
          </h5>
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
                  <p>
                    Drag & drop a{' '}
                    <span className=' text-info'>{selectedDocumentType}</span>{' '}
                    (PDF) document here, or click to select a file.
                  </p>
                  <em>(Only one PDF file is accepted)</em>
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

            {/* Signature Pad */}
            <div className='signature-container my-5 text-center row'>
              <h5>
                Draw{' '}
                <span className=' text-info'>
                  {selectedDocumentType === 'Solicitor undertaking'
                    ? 'Assigned Solicitor'
                    : selectedDocumentType === 'Advancement agreement'
                    ? 'Agreement applicant'
                    : ''}{' '}
                </span>
                Signature
              </h5>
              <div
                className='mx-auto'
                style={{
                  border: '2px solid #007bff',
                  borderRadius: '5px',
                  width: '500px',
                  height: '150px',
                  marginBottom: '10px',
                  backgroundColor: 'white',
                }}
              >
                <SignatureCanvas
                  ref={signaturePadRef} // Reference the signature canvas
                  penColor='blue'
                  canvasProps={{
                    width: 500,
                    height: 150,
                    className: 'sigCanvas',
                  }}
                  onEnd={() => {
                    setSignatureProvided(true);
                  }}
                />
              </div>
              {/* Clear Signature Button */}
              <div>
                <button
                  onClick={clearSignature}
                  className='btn btn-sm btn-outline-dark mt-2'
                >
                  Clear Signature
                </button>
              </div>
            </div>

            {/* Input for Solicitor Full Name */}
            <div className='form-group mb-4'>
              <label htmlFor='solicitorFullName' className='font-weight-bold'>
                <span className=' text-info'>
                  {selectedDocumentType === 'Solicitor undertaking'
                    ? 'Assigned Solicitor'
                    : selectedDocumentType === 'Advancement agreement'
                    ? 'Agreement Applicant'
                    : ''}{' '}
                </span>
                Full Name
              </label>
              <input
                type='text'
                className='form-control'
                id='solicitorFullName'
                value={solicitorFullName}
                onChange={(e) => setSolicitorFullName(e.target.value)}
                placeholder={`Type ${
                  selectedDocumentType === 'Solicitor undertaking'
                    ? 'Assigned Solicitor'
                    : selectedDocumentType === 'Advancement agreement'
                    ? 'Agreement Applicant'
                    : ''
                } Full Name`}
                required
              />
            </div>

            {/* Checkbox for Confirmation */}
            <div className='form-check rounded bg-light row'>
              <div className=' col-md-6 p-3 mx-auto'>
                <input
                  className='form-check-input '
                  type='checkbox'
                  id='solicitorConfirmationCheckbox'
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                  style={{
                    transform: 'scale(1.3)',
                    backgroundColor: 'deepskyblue',
                  }} // Bigger checkbox size
                />

                <p className=' text-info font-weight-bold ps-2'>
                  {confirmationMessage}
                </p>
              </div>
            </div>
            <p className=' text-center text-muted'>
              <small>
                If the solicitor details require updating, please review and
                amend them on the Application Details page as needed.
              </small>
            </p>

            <div className='row'>
              <button
                onClick={uploadFilesHandler}
                className='btn btn-danger ms-auto shadow'
                disabled={
                  acceptedFiles.length < 1 ||
                  !checkboxChecked ||
                  !solicitorFullName ||
                  !signatureProvided
                }
              >
                {isLoading ? (
                  <div className='spinner-border text-warning' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                ) : (
                  'Sign and Upload Document'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDropZoneSigned;
