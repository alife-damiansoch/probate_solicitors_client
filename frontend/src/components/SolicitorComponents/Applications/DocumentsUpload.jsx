import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import {
  FaCog,
  FaDownload,
  FaFileAlt,
  FaFileSignature,
  FaPlus,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  downloadFileAxios,
  fetchData,
} from '../../GenericFunctions/AxiosGenericFunctions';

const DocumentsUpload = ({ application, highlitedSectionId }) => {
  const [documents, setDocuments] = useState([]);

  let tokenObj = Cookies.get('auth_token');
  let token = null;
  if (tokenObj) {
    tokenObj = JSON.parse(tokenObj);
    token = tokenObj.access;
  }

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (token && application.id) {
        try {
          const endpoint = `/api/applications/solicitor_applications/document_file/${application.id}/`;
          const response = await fetchData(token, endpoint);
          setDocuments(response.data);
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      }
    };

    fetchDocuments();
  }, [application.id, token]);

  const downloadFile = async (fileUrl) => {
    const fileName = fileUrl.split('/').pop();
    try {
      const endpoint = `/api/applications/solicitor_applications/document_file/download/${fileName}/`;
      const response = await downloadFileAxios(token, endpoint);

      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <div
      className={`border-0 my-4 ${
        highlitedSectionId === 'Uploaded Documents' && 'highlited_section'
      }`}
      id='Uploaded Documents'
      style={{
        borderRadius: '16px',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className='d-flex align-items-center justify-content-between border-0 p-4'
        style={{
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          color: 'white',
        }}
      >
        <div className='d-flex align-items-center'>
          <div
            className='rounded-circle d-flex align-items-center justify-content-center me-3'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <FaFileAlt size={18} />
          </div>
          <h4 className='mb-0 fw-semibold'>Uploaded Documents</h4>
        </div>

        {!application.approved && !application.is_rejected && (
          <button
            className='btn px-4 py-2 fw-medium'
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
            }}
            onClick={() => {
              navigate(`/createApplicationPdfsForSign/${application.id}`);
            }}
            disabled={application.approved || application.is_rejected}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <FaCog className='me-2' size={14} />
            Generate Required Documents
          </button>
        )}
      </div>

      {/* Content */}
      <div className='p-4' style={{ backgroundColor: '#ffffff' }}>
        {documents.length > 0 ? (
          <div className='row g-3'>
            {documents.map((doc) => (
              <div key={doc.document} className='col-md-6 col-lg-4'>
                <div
                  className='card border-0 h-100 position-relative'
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => downloadFile(doc.document)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow =
                      '0 4px 8px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                >
                  {/* Signed Badge */}
                  {doc.is_signed && (
                    <div
                      className='position-absolute'
                      style={{
                        top: '10px',
                        right: '10px',
                        zIndex: 2,
                      }}
                    >
                      <span
                        className='badge rounded-pill px-3 py-2 d-flex align-items-center'
                        style={{
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        <FaFileSignature className='me-1' size={12} />
                        Signed
                      </span>
                    </div>
                  )}

                  <div className='card-body p-3 d-flex flex-column'>
                    {/* Document Icon */}
                    <div className='text-center mb-3'>
                      <div
                        className='rounded-circle d-flex align-items-center justify-content-center mx-auto'
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: doc.is_signed
                            ? '#fef2f2'
                            : '#e0f2fe',
                          color: doc.is_signed ? '#dc2626' : '#0891b2',
                        }}
                      >
                        <FaFileAlt size={20} />
                      </div>
                    </div>

                    {/* Document Name */}
                    <div className='flex-grow-1'>
                      <h6
                        className='card-title text-center mb-2 fw-semibold'
                        style={{
                          color: '#1f2937',
                          fontSize: '0.9rem',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {doc.original_name}
                      </h6>
                    </div>

                    {/* Download Indicator */}
                    <div className='text-center mt-2'>
                      <div
                        className='d-inline-flex align-items-center px-3 py-1 rounded-pill'
                        style={{
                          backgroundColor: '#e0f2fe',
                          color: '#0891b2',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                        }}
                      >
                        <FaDownload className='me-1' size={10} />
                        Click to Download
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className='alert border-0 text-center'
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)',
              padding: '2rem',
            }}
          >
            <div
              className='rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3'
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
              }}
            >
              <FaFileAlt size={24} />
            </div>
            <h5 className='fw-semibold mb-2'>No Documents Found</h5>
            <p className='mb-0'>
              Documents are pending. Please upload them at your earliest
              convenience.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className='mt-4 pt-3'
          style={{
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div className='d-flex flex-wrap gap-3 justify-content-end'>
            <button
              className='btn px-4 py-2 fw-medium'
              style={{
                backgroundColor: '#0891b2',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
              }}
              onClick={() => {
                navigate(`/upload_new_document/${application.id}`);
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#0e7490';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#0891b2';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaPlus className='me-2' size={14} />
              Add Document
            </button>

            <button
              className='btn px-4 py-2 fw-medium'
              style={{
                backgroundColor: 'transparent',
                color: '#0891b2',
                border: '2px solid #0891b2',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
              }}
              onClick={() => {
                navigate(`/upload_new_document_signed/${application.id}`);
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#0891b2';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#0891b2';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaFileSignature className='me-2' size={14} />
              Add & Sign Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsUpload;
