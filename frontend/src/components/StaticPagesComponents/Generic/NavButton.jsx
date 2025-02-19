import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NavButton = ({
  children,
  isMobile,
  toggleNavbar,
  navUrl,
  underlineColor = '#4D0304',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  return (
    <Button
      className={`btn-sm mt-1 menu_buttons  ${
        isMobile ? ' ' : 'no-background border-0'
      }`}
      style={{
        width: `${isMobile ? '100%' : 'auto'}`,
        height: '100%',
        background: 'none',
        border: 'none',
      }}
      onClick={() => {
        navigate(navUrl);
        toggleNavbar();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.h5
        className=' text-dark'
        whileHover={{
          color: '#B2FCFB',
        }}
      >
        {children}
      </motion.h5>
      <motion.div
        initial={{
          scaleX: 0,
        }}
        animate={{
          scaleX: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          width: '100%',
          height: '2px',
          backgroundColor: underlineColor,
        }}
        className=' mx-auto'
      ></motion.div>
    </Button>
  );
};

export default NavButton;
