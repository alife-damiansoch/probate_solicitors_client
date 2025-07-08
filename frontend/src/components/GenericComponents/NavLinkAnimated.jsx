// Updated NavLinkAnimated.js - Mobile Responsive
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavLinkAnimated.css'; // Import external CSS

const NavLinkAnimated = ({ to, label, isActive, closeNavbar }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (!isActive(to)) {
      event.preventDefault();
      closeNavbar();
      navigate(to);
    }
  };

  const isActiveLink = isActive(to);

  return (
    <Link
      className={`modern-nav-link ${isActiveLink ? 'active disabled' : ''}`}
      to={to}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isActiveLink
          ? 'linear-gradient(145deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 50%, rgba(29, 78, 216, 0.95) 100%)'
          : undefined,
        color: isActiveLink ? '#ffffff' : undefined,
        borderColor: isActiveLink ? 'rgba(59, 130, 246, 0.4)' : undefined,
        boxShadow: isActiveLink
          ? '0 4px 15px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2)'
          : undefined,
      }}
    >
      <motion.span
        initial={{
          color: isActiveLink ? '#ffffff' : '#1f2937',
        }}
        animate={
          hovered && !isActiveLink
            ? { color: '#059669' }
            : { color: isActiveLink ? '#ffffff' : '#1f2937' }
        }
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {label}
      </motion.span>

      <motion.div
        className='modern-underline'
        style={{
          height: '3px',
          margin: '4px auto 0',
          borderRadius: '2px',
          background: isActiveLink
            ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8))'
            : 'linear-gradient(90deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 1), rgba(29, 78, 216, 0.8))',
          boxShadow: isActiveLink
            ? '0 0 8px rgba(255, 255, 255, 0.6)'
            : '0 0 8px rgba(59, 130, 246, 0.6)',
        }}
        initial={{ width: isActiveLink ? '100%' : '0%' }}
        animate={hovered || isActiveLink ? { width: '100%' } : { width: '0%' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
    </Link>
  );
};

export default NavLinkAnimated;
