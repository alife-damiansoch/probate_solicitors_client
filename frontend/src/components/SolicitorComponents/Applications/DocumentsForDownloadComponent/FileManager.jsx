import { motion } from 'framer-motion';
import { useState } from 'react';
import ListFiles from './ListFiles';

const FileManager = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div
      className='container-fluid my-5 px-0'
      style={{
        maxWidth: 980,
        paddingTop: 120,
        minHeight: 'calc(100vh - 180px)',
      }}
    >
      <motion.div
        className='modern-main-card border-0 position-relative overflow-hidden mx-auto'
        style={{
          background: 'var(--gradient-surface)',
          border: '1.5px solid var(--border-primary)',
          borderRadius: 26,
          boxShadow: `
            0 20px 44px var(--primary-10),
            0 8px 22px var(--primary-20),
            inset 0 1px 0 var(--white-10)
          `,
          backdropFilter: 'blur(20px)',
          transition: 'all 0.38s cubic-bezier(0.4,0,0.2,1)',
          transform: 'translateZ(0)',
        }}
        initial={{ scale: 0.98, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{
          scale: 1.012,
          boxShadow: `
            0 32px 64px var(--primary-30),
            0 16px 32px var(--primary-20),
            inset 0 1px 0 var(--white-20)
          `,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Animated Glassy Background */}
        <div
          className='position-absolute w-100 h-100'
          style={{
            background: `
              radial-gradient(circle at 22% 18%, var(--primary-20) 0%, transparent 65%),
              radial-gradient(circle at 75% 80%, var(--primary-30) 0%, transparent 60%),
              radial-gradient(circle at 62% 8%, var(--success-20) 0%, transparent 34%)
            `,
            opacity: 0.28,
            animation: 'float 9s ease-in-out infinite',
            zIndex: 0,
          }}
        />

        {/* Header */}
        <div
          className='px-4 py-4 d-flex align-items-center gap-3 position-relative border-bottom'
          style={{
            background: 'var(--gradient-header), var(--primary-blue-dark)',
            color: 'var(--text-primary)',
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            border: '1px solid var(--border-subtle)',
            borderBottom: '1.5px solid var(--border-primary)',
            zIndex: 1,
          }}
        >
          {/* Icon with micro-animation */}
          <motion.div
            className='d-flex align-items-center justify-content-center rounded-circle position-relative'
            style={{
              width: 56,
              height: 56,
              background: 'var(--primary-10)',
              border: '2px solid var(--primary-30)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            whileHover={{
              scale: 1.08,
              rotate: 3,
              background: 'var(--primary-20)',
            }}
          >
            <i
              className='fas fa-folder-open'
              style={{ fontSize: 23, color: 'var(--primary-blue)' }}
            />
            <div
              className='position-absolute rounded-circle'
              style={{
                top: -10,
                left: -10,
                right: -10,
                bottom: -10,
                background: 'var(--primary-10)',
                filter: 'blur(8px)',
                zIndex: -1,
              }}
            />
          </motion.div>
          <div className='flex-grow-1'>
            <h5
              className='fw-bold mb-1'
              style={{
                fontSize: '1.32rem',
                letterSpacing: '-0.01em',
                color: 'var(--text-primary)',
                textShadow: '0 1px 4px var(--primary-10)',
              }}
            >
              Documents Library
            </h5>
            <div
              className='px-3 py-1 rounded-pill fw-semibold'
              style={{
                background: 'var(--primary-20)',
                fontSize: '0.97rem',
                border: '1px solid var(--primary-30)',
                color: 'var(--text-primary)',
                display: 'inline-block',
                backdropFilter: 'blur(8px)',
                letterSpacing: '0.01em',
                textShadow: '0 1px 2px var(--primary-10)',
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
      </motion.div>
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(0deg);}
          50% { transform: translateY(-14px) rotate(2deg);}
        }
      `}</style>
    </div>
  );
};

export default FileManager;
