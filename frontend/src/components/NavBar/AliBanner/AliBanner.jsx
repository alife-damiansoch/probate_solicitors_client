import { motion } from 'framer-motion';

const bannerStyle = {
  backgroundColor: 'white', // Example background color
  padding: '2rem',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
};

const textContainerStyle = {
  display: 'inline-block',
  whiteSpace: 'nowrap',
};

const textVariants = {
  animate: {
    x: ['100%', '-100%'], // Start from right outside the container to left outside
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 20, // Adjust this value to control the speed
        ease: 'linear',
      },
    },
  },
};

const AliBanner = () => {
  return (
    <div className='container-fluid py-lg-3' style={bannerStyle}>
      <motion.div
        style={textContainerStyle}
        variants={textVariants}
        animate='animate'
      >
        <span
          className='roboto-bold-italic'
          style={{
            fontSize: '2rem', // Adjust the size as needed
            color: '#8B0000', // Dark red color
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Adding text shadow
          }}
        >
          PFI is an expert in expediting capital release from an estate prior to
          probate being granted. {'   '}We are the only company in the market
          providing this service.
        </span>
      </motion.div>
    </div>
  );
};

export default AliBanner;
