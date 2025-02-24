import { useNavigate } from 'react-router-dom';
import { MdAddChart } from 'react-icons/md';
import { FaFileSignature } from 'react-icons/fa6';
import {
  downloadFileAxios,
  fetchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const DocumentsUpload = ({ application, highlitedSectionId }) => {
  const [documents, setDocuments] = useState([]);

  let tokenObj = Cookies.get('auth_token');
  let token = null;
  if (tokenObj) {
    tokenObj = JSON.parse(tokenObj);
    // console.log(tokenObj);
    token = tokenObj.access;
  }

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      // console.log(token);
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
      link.setAttribute('download', fileName); // Use the filename you want to give the downloaded file
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };
  // console.log(documents);
  return (
    <div
      className={`card rounded my-3   shadow ${
        highlitedSectionId === 'Uploaded Documents' && 'highlited_section'
      }`}
      id='Uploaded Documents'
    >
      <div className=' card-header  rounded-top row mx-0'>
        <div className='col-12 col-md-9 card-subtitle text-info-emphasis'>
          <h4>Uploaded documents</h4>
        </div>
        {!application.approved && !application.is_rejected && (
          <div className='col-12 col-md-3 my-auto '>
            <button
              className='btn btn-sm w-100  btn-primary  shadow  mx-auto'
              onClick={() => {
                navigate(`/createApplicationPdfsForSign/${application.id}`);
              }}
              disabled={application.approved || application.is_rejected}
            >
              Generate required documents
            </button>
          </div>
        )}
      </div>

      {documents.length > 0 ? (
        <div className='card-body '>
          <ul
            className='d-flex flex-wrap  align-items-center justify-content-start'
            style={{ padding: '0', margin: '0' }}
          >
            {documents.map((doc) => (
              <li
                key={doc.document}
                style={{
                  position: 'relative',
                  padding: '0.5rem', // Reduced padding
                  marginBottom: '0.5rem', // Reduced margin between items
                  listStyle: 'none', // Remove default list styling
                }}
                className=' mx-5'
              >
                {doc.is_signed && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '5px', // Adjusted value to fit better
                      left: '50%',
                      transform: 'translateX(-50%) rotate(-20deg)',
                      zIndex: 0,
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none',
                      opacity: '0.5',
                    }}
                  >
                    <FaFileSignature size={30} color='red' />{' '}
                    {/* Reduced icon size */}
                    <span
                      style={{
                        color: 'red',
                        marginLeft: '5px', // Reduced spacing
                        fontSize: '12px', // Reduced font size
                        fontWeight: 'bold',
                      }}
                    >
                      Signed
                    </span>
                  </div>
                )}
                <p
                  style={{
                    cursor: 'pointer',
                    color: 'blue',
                    textDecoration: 'underline',
                    position: 'relative',
                    zIndex: 1,
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)', // Adjusted text shadow
                    margin: '0', // Remove margin
                    fontSize: '14px', // Reduced font size
                  }}
                  onClick={() => downloadFile(doc.document)}
                >
                  {doc.original_name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className='row mt-3 mx-1'>
          <div className=' alert alert-danger col-12 col-md-6 mx-auto text-center'>
            <p>Documents pending. </p>
            <p>Please upload them at your earliest convenience.</p>
          </div>
        </div>
      )}
      <div className=' row  my-3 ms-auto mx-0'>
        <div className='  ms-auto me-2'>
          <button
            className=' btn btn-sm btn-info shadow col-12 col-md-auto'
            onClick={() => {
              navigate(`/upload_new_document/${application.id}`);
            }}
          >
            <MdAddChart size={20} className=' me-2' />
            Add document
          </button>
          <button
            className=' btn btn-sm btn-info shadow col-12 col-md-auto mt-2 mt-md-0 ms-md-2'
            onClick={() => {
              navigate(`/upload_new_document_signed/${application.id}`);
            }}
          >
            <MdAddChart size={20} className=' me-2' />
            Add and sign document
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsUpload;
