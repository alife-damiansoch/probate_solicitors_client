import { motion } from 'framer-motion';

const FooterComponent = () => {
  // Enhanced theme-aware styles
  const footerStyle = {
    background: 'var(--gradient-surface)',
    boxShadow: `
      0 -8px 32px rgba(0, 0, 0, 0.1),
      0 -4px 16px var(--primary-10),
      0 -2px 8px rgba(0, 0, 0, 0.05),
      inset 0 1px 0 var(--white-10)
    `,
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--border-primary)',
    letterSpacing: '0.02em',
    height: '80px', // Fixed height
    minHeight: '80px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  const textStyle = {
    color: 'var(--text-secondary)',
    fontWeight: '500',
    fontSize: '0.9rem',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  };

  const brandStyle = {
    fontWeight: '700',
    color: 'var(--primary-blue)',
    textShadow: `0 0 10px var(--primary-30), 0 1px 2px rgba(0, 0, 0, 0.2)`,
    letterSpacing: '0.5px',
  };

  return (
    <motion.footer
      className='w-100 border-0 d-flex align-items-center'
      style={footerStyle}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Animated background pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, var(--primary-10), transparent 50%),
            radial-gradient(circle at 80% 50%, var(--primary-10), transparent 50%)
          `,
          animation: 'footerFloat 8s ease-in-out infinite',
          opacity: 0.6,
        }}
      />

      {/* Subtle top border glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `
            linear-gradient(90deg, 
              transparent, 
              var(--primary-blue), 
              var(--primary-blue-light),
              var(--primary-blue), 
              transparent
            )
          `,
          animation: 'borderGlow 4s ease-in-out infinite',
        }}
      />

      <div className='container position-relative'>
        <div className='row align-items-center justify-content-center h-100'>
          <div className='col-12 text-center'>
            <motion.p
              className='mb-0'
              style={textStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              &copy; {new Date().getFullYear()}{' '}
              <motion.span
                style={brandStyle}
                whileHover={{
                  scale: 1.05,
                  textShadow: `0 0 15px var(--primary-40), 0 2px 4px rgba(0, 0, 0, 0.3)`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                ALI
              </motion.span>
              . All rights reserved.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>{`
        @keyframes footerFloat {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-5px) scale(1.02);
            opacity: 0.8;
          }
        }
        
        @keyframes borderGlow {
          0%, 100% { 
            opacity: 0.3;
            transform: scaleX(0.8);
          }
          50% { 
            opacity: 1;
            transform: scaleX(1);
          }
        }
      `}</style>
    </motion.footer>
  );
};

export default FooterComponent;
