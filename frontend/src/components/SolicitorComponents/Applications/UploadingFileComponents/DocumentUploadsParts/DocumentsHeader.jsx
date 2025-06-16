import {
  FaExclamationTriangle,
  FaFileAlt,
  FaFileSignature,
} from 'react-icons/fa';

const DocumentsHeader = ({ application, stats, requirementStatus }) => {
  // Debug: Check what stats actually is
  console.log('Stats received:', stats);

  // Handle both old array format and new object format
  let requirementStats = [];
  let signatureStats = [];

  if (Array.isArray(stats)) {
    // Old format - convert to new format
    requirementStats = stats.filter(
      (s) =>
        s.label === 'Total Uploaded' ||
        s.label === 'Required' ||
        s.label === 'Missing'
    );
    signatureStats = stats.filter(
      (s) =>
        s.label === 'Pending Signatures' ||
        s.label === 'Signed' ||
        s.label === 'Complete'
    );
  } else if (stats && typeof stats === 'object') {
    // New format
    requirementStats = stats.requirements || [];
    signatureStats = stats.signatures || [];
  }

  return (
    <div
      className='p-4'
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className='position-absolute'
        style={{
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      ></div>
      <div className='position-relative'>
        <div className='d-flex align-items-center mb-4'>
          <div
            className='rounded-circle d-flex align-items-center justify-content-center me-3'
            style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <FaFileAlt size={20} />
          </div>
          <div>
            <h3 className='mb-1 fw-bold'>Documents Overview</h3>
            <p className='mb-0 opacity-90' style={{ fontSize: '0.95rem' }}>
              Application #{application.id} • Document Management
            </p>
          </div>
        </div>

        {/* Stats Sections */}
        <div className='row g-4'>
          {/* Document Requirements Section */}
          <div className='col-md-6'>
            <div
              className='p-4 rounded-4'
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <div className='d-flex align-items-center mb-3'>
                <FaExclamationTriangle size={18} className='me-2' />
                <h5 className='mb-0 fw-bold'>Document Requirements</h5>
              </div>
              <div className='row g-3'>
                {requirementStats.map((stat, index) => (
                  <div key={index} className='col-4'>
                    <div className='text-center'>
                      <div
                        className='rounded-3 d-flex align-items-center justify-content-center mx-auto mb-2'
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <stat.icon size={16} color='white' />
                      </div>
                      <div
                        className='fw-bold text-white'
                        style={{ fontSize: '1.5rem' }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className='text-white opacity-90 fw-medium'
                        style={{ fontSize: '0.8rem', lineHeight: '1.2' }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Signature Status Section */}
          <div className='col-md-6'>
            <div
              className='p-4 rounded-4'
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <div className='d-flex align-items-center mb-3'>
                <FaFileSignature size={18} className='me-2' />
                <h5 className='mb-0 fw-bold'>Signature Status</h5>
              </div>
              <div className='row g-3 justify-content-center'>
                {signatureStats.map((stat, index) => (
                  <div key={index} className='col-4'>
                    <div className='text-center'>
                      <div
                        className='rounded-3 d-flex align-items-center justify-content-center mx-auto mb-2'
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <stat.icon size={16} color='white' />
                      </div>
                      <div
                        className='fw-bold text-white'
                        style={{ fontSize: '1.5rem' }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className='text-white opacity-90 fw-medium'
                        style={{ fontSize: '0.8rem', lineHeight: '1.2' }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsHeader;
