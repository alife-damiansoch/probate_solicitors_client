import { useEffect, useState } from 'react';
import { LiaFileDownloadSolid } from 'react-icons/lia';
import {
  downloadFileAxios,
  fetchData,
} from '../../../GenericFunctions/AxiosGenericFunctions';

const ListFiles = ({ refresh }) => {
  const [files, setFiles] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // Success or danger

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, [refresh]);

  const fetchFiles = async () => {
    try {
      const response = await fetchData(null, '/api/downloadableFiles/list/');
      if (response && response.status === 200) {
        setFiles(response.data);
        setStatusType('success');
      } else {
        setStatusMessage('Failed to load files.');
        setStatusType('danger');
      }
    } catch (error) {
      setStatusMessage('Error fetching files.');
      setStatusType('danger');
    }
  };

  // Handle file download
  const downloadFile = async (filename) => {
    try {
      const response = await downloadFileAxios(
        null,
        `/api/downloadableFiles/download/${filename}`
      );
      if (response && response.status === 200) {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        setStatusMessage(`File "${filename}" downloaded successfully.`);
        setStatusType('success');
      } else {
        setStatusMessage('Failed to download file.');
        setStatusType('danger');
      }
    } catch (error) {
      setStatusMessage('Error downloading file.');
      setStatusType('danger');
    }
  };

  return (
    <div className='w-100'>
      {/* Status Message */}
      {statusMessage && (
        <div
          className={`alert border-0 d-flex align-items-center gap-3 ${
            statusType === 'success'
              ? 'alert-success'
              : statusType === 'danger'
              ? 'alert-danger'
              : ''
          }`}
          style={{
            borderRadius: 18,
            boxShadow: '0 2px 12px rgba(0,0,0,0.09)',
            fontWeight: 500,
          }}
          role='alert'
        >
          <i
            className={`fas ${
              statusType === 'success'
                ? 'fa-check-circle'
                : 'fa-exclamation-triangle'
            }`}
            style={{
              color: statusType === 'success' ? '#22c55e' : '#ef4444',
              fontSize: 20,
            }}
          />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Files Table or Card List */}
      {files.length > 0 ? (
        <div className='row g-4'>
          {files.map((file, idx) => (
            <div
              className='col-12 col-sm-6 col-lg-4'
              key={idx}
              style={{ minWidth: 240 }}
            >
              <div
                className='p-4 d-flex flex-column align-items-center justify-content-between h-100'
                style={{
                  background: 'rgba(255,255,255,0.81)',
                  borderRadius: 18,
                  border: '1px solid rgba(102,126,234,0.09)',
                  boxShadow:
                    '0 4px 16px rgba(102,126,234,0.09), 0 1px 6px rgba(0,0,0,0.06)',
                  transition: 'all 0.24s cubic-bezier(0.4,0,0.2,1)',
                  backdropFilter: 'blur(8px)',
                  minHeight: 150,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glassy File Icon */}
                <div
                  className='d-flex align-items-center justify-content-center mb-3'
                  style={{
                    width: 46,
                    height: 46,
                    background: 'linear-gradient(135deg,#667eea,#764ba2)',
                    borderRadius: '50%',
                    boxShadow: '0 4px 16px rgba(102,126,234,0.18)',
                  }}
                >
                  <LiaFileDownloadSolid size={28} color='#fff' />
                </div>
                <div
                  className='w-100 text-center mb-2'
                  style={{
                    wordBreak: 'break-all',
                    fontWeight: 600,
                    fontSize: '1.06rem',
                    color: '#1e293b',
                  }}
                  title={file}
                >
                  {file}
                </div>
                <button
                  className='btn btn-sm rounded-pill fw-bold px-4 mt-2 d-flex align-items-center justify-content-center gap-2'
                  style={{
                    background: 'linear-gradient(135deg,#667eea,#764ba2)',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 18px rgba(102,126,234,0.13)',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => downloadFile(file)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      'translateY(-1px) scale(1.05)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(102,126,234,0.16)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 18px rgba(102,126,234,0.13)';
                  }}
                >
                  <LiaFileDownloadSolid size={22} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='py-5 text-center'>
          <div
            className='mx-auto d-flex align-items-center justify-content-center mb-3'
            style={{
              width: 70,
              height: 70,
              background: 'linear-gradient(135deg, #e0e7ef, #e0e7ff)',
              color: '#667eea',
              borderRadius: '50%',
              boxShadow: '0 8px 18px rgba(102,126,234,0.08)',
            }}
          >
            <LiaFileDownloadSolid size={34} />
          </div>
          <h5 className='fw-bold mb-2' style={{ color: '#1e293b' }}>
            No documents available
          </h5>
          <p className='text-muted'>
            There are currently no standard files available for download.
          </p>
        </div>
      )}
    </div>
  );
};

export default ListFiles;
