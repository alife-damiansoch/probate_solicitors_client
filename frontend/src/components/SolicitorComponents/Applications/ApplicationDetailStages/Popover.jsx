
import { motion, AnimatePresence } from 'framer-motion';
import {useState} from "react";

const Popover = ({ children, content, header = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animation variants for Framer Motion
  const popoverVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <div
      className='popover-wrapper'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className='popover-content shadow'
            initial='hidden'
            animate='visible'
            exit='exit'
            variants={popoverVariants}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            transformTemplate={({ scale }) =>
              `translate(-125%, -50%) scale(${scale})`
            }
          >
            {header && (
              <div className='popover-header'>
                <strong>{header}</strong>
                <hr />
              </div>
            )}
            <div className='popover-body'>
              <small dangerouslySetInnerHTML={{ __html: content }}></small>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Popover;
