import React from 'react';
import { motion } from 'framer-motion';

import { scaleHoverAnimation } from '../Functions/animationFunctions';

const CustomAlert = ({ backgroundColor, children }) => {
  const animationSettings = scaleHoverAnimation();
  return (
    <motion.div
      {...animationSettings}
      className={`alert bg-${backgroundColor} text-black shadow rounded my-3`}
    >
      {children}
    </motion.div>
  );
};
export default CustomAlert;
