import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const NavLinkAnimated = ({ to, label, isActive, closeNavbar }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate(); // Ensures navigation happens without a full page reload

  const handleClick = (event) => {
    if (!isActive(to)) {
      event.preventDefault(); // Prevents full page reload
      closeNavbar(); // Close navbar if needed
      navigate(to); // Navigate programmatically without refresh
    }
  };

  return (
    <Link
      className={`btn ${
        isActive(to) ? 'btn bg-white text-info' : 'btn bg-white text-black'
      } ${isActive(to) ? 'disabled' : ''} border-0 btn-full-width`}
      to={to}
      onClick={handleClick} // Prevents refresh
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}
        initial={{ color: 'black' }}
        animate={hovered ? { color: 'darkblue' } : { color: 'black' }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.3 }}
      >
        {label}
      </motion.span>
      <motion.div
        className='bg-info align-middle'
        style={{ height: '3px', width: '0%', margin: '0 auto' }}
        initial={{ width: 0 }}
        animate={hovered ? { width: '100%' } : { width: '0%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </Link>
  );
};

export default NavLinkAnimated;
