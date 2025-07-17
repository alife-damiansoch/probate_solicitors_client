import { useState } from 'react';
import ListFiles from './ListFiles';

const FileManager = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div
      className='container-fluid my-5 px-0'
      style={{ maxWidth: 980, paddingTop: 120 }}
    >
      <div
        className='modern-main-card border-0 position-relative overflow-hidden mx-auto'
        style={{
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.10), rgba(248,250,252,0.07)),
            radial-gradient(circle at 30% 10%, rgba(255,255,255,0.7), transparent 55%),
            radial-gradient(circle at 70% 90%, rgba(102,126,234,0.12), transparent 60%)
          `,
          border: '1px solid rgba(255,255,255,0.28)',
          borderRadius: 24,
          boxShadow: `
            0 20px 40px rgba(0,0,0,0.09),
            0 8px 16px rgba(0,0,0,0.07),
            inset 0 1px 0 rgba(255,255,255,0.38)
          `,
          backdropFilter: 'blur(18px)',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          transform: 'translateZ(0)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.012)';
          e.currentTarget.style.boxShadow = `
            0 32px 64px rgba(0,0,0,0.15),
            0 16px 32px rgba(0,0,0,0.09),
            inset 0 1px 0 rgba(255,255,255,0.6)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = `
            0 20px 40px rgba(0,0,0,0.09),
            0 8px 16px rgba(0,0,0,0.07),
            inset 0 1px 0 rgba(255,255,255,0.38)
          `;
        }}
      >
        {/* Animated Glassy Background */}
        <div
          className='position-absolute w-100 h-100'
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(102,126,234,0.10) 0%, transparent 60%),
              radial-gradient(circle at 80% 85%, rgba(118,75,162,0.09) 0%, transparent 55%)
            `,
            opacity: 0.33,
            animation: 'float 7s ease-in-out infinite',
            zIndex: 0,
          }}
        />

        {/* Header */}
        <div
          className='px-4 py-4 d-flex align-items-center gap-3 position-relative border-bottom'
          style={{
            background: `
              linear-gradient(135deg, #667eea, #764ba2),
              linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))
            `,
            color: '#fff',
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            border: '1px solid rgba(255,255,255,0.09)',
            borderBottom: '1px solid rgba(255,255,255,0.13)',
            zIndex: 1,
          }}
        >
          {/* Icon with Micro-animation */}
          <div
            className='d-flex align-items-center justify-content-center rounded-circle position-relative'
            style={{
              width: 56,
              height: 56,
              background: 'rgba(255,255,255,0.17)',
              border: '2px solid rgba(255,255,255,0.22)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.07) rotate(3deg)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.23)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.17)';
            }}
          >
            <i className='fas fa-folder-open' style={{ fontSize: 23 }} />
            <div
              className='position-absolute rounded-circle'
              style={{
                top: -10,
                left: -10,
                right: -10,
                bottom: -10,
                background: 'rgba(255,255,255,0.13)',
                filter: 'blur(8px)',
                zIndex: -1,
              }}
            />
          </div>
          <div className='flex-grow-1'>
            <h5
              className='fw-bold mb-1 text-white'
              style={{ fontSize: '1.35rem', letterSpacing: '-0.01em' }}
            >
              Documents Library
            </h5>
            <div
              className='px-3 py-1 rounded-pill fw-semibold text-white'
              style={{
                background: 'rgba(255,255,255,0.11)',
                fontSize: '0.9rem',
                border: '1px solid rgba(255,255,255,0.19)',
                display: 'inline-block',
                backdropFilter: 'blur(10px)',
                letterSpacing: '0.01em',
              }}
            >
              Download and view all the standard documents available to you.
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className='p-4 p-md-5' style={{ zIndex: 2 }}>
          <ListFiles refresh={refresh} setRefresh={setRefresh} />
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg);}
        }
      `}</style>
    </div>
  );
};

export default FileManager;
