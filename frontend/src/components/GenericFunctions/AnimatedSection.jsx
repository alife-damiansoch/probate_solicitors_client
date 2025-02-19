// components/AnimatedSection.js

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

// Reusable AnimatedSection component
const AnimatedSection = ({
  children,
  as = 'div',
  className,
  style,
  initial = { opacity: 0, y: 50 },
  animateIn = { opacity: 1, y: 0 },
  animateOut = { opacity: 0, y: 50 },
  transition = { duration: 0.6 },
}) => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Animation will trigger every time the section is in view
    threshold: 0.2, // Trigger when 20% of the component is in view
  });

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      ref={ref}
      initial={initial} // Start hidden and slightly translated down
      animate={inView ? animateIn : animateOut} // Animate to visible when in view, hidden when out of view
      transition={transition} // Animation duration
      className={className} // Preserve original classes
      style={style} // Preserve original styles
    >
      {children}
    </MotionComponent>
  );
};

export default AnimatedSection;
