// components/ThemeSwitcher/ThemeSwitcher.jsx

import { motion } from 'framer-motion';
import { useTheme } from '../../../useTheme';

const ThemeSwitcher = ({ showLabel = true, size = 'normal' }) => {
  const { theme, toggleTheme, setSystemTheme } = useTheme();

  // Size variants
  const sizeConfig = {
    small: {
      width: '44px',
      height: '24px',
      radius: '12px',
      sliderSize: '20px',
      iconSize: '10px',
      fontSize: '0.7rem',
    },
    normal: {
      width: '50px',
      height: '26px',
      radius: '13px',
      sliderSize: '22px',
      iconSize: '12px',
      fontSize: '0.75rem',
    },
    large: {
      width: '60px',
      height: '32px',
      radius: '16px',
      sliderSize: '28px',
      iconSize: '14px',
      fontSize: '0.85rem',
    },
  };

  const config = sizeConfig[size] || sizeConfig.normal;

  return (
    <div className='d-flex align-items-center gap-2'>
      {/* Main Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className='border-0 p-0'
        style={{
          position: 'relative',
          width: config.width,
          height: config.height,
          background: 'var(--step-default-bg)',
          borderRadius: config.radius,
          border: '2px solid var(--border-primary)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 6px var(--primary-20)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {/* Sliding Toggle */}
        <motion.div
          style={{
            position: 'absolute',
            top: '1px',
            width: config.sliderSize,
            height: config.sliderSize,
            background:
              theme === 'dark'
                ? 'linear-gradient(145deg, var(--primary-blue), var(--primary-blue-dark))'
                : 'linear-gradient(145deg, var(--warning-primary), var(--warning-dark))',
            borderRadius: '50%',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow:
              theme === 'dark'
                ? '0 2px 6px var(--primary-40)'
                : '0 2px 6px var(--warning-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          animate={{
            left:
              theme === 'dark'
                ? '1px'
                : `${
                    parseInt(config.width) - parseInt(config.sliderSize) - 1
                  }px`,
          }}
        >
          {/* Theme Icon */}
          {theme === 'dark' ? (
            <svg
              width={config.iconSize}
              height={config.iconSize}
              viewBox='0 0 24 24'
              fill='none'
              stroke='white'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
            </svg>
          ) : (
            <svg
              width={config.iconSize}
              height={config.iconSize}
              viewBox='0 0 24 24'
              fill='none'
              stroke='white'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='5' />
              <line x1='12' y1='1' x2='12' y2='3' />
              <line x1='12' y1='21' x2='12' y2='23' />
              <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
              <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
              <line x1='1' y1='12' x2='3' y2='12' />
              <line x1='21' y1='12' x2='23' y2='12' />
            </svg>
          )}
        </motion.div>

        {/* Background Icons (optional subtle indicators) */}
        <div
          style={{
            position: 'absolute',
            left: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: theme === 'dark' ? 0.3 : 0.6,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          <svg
            width={config.iconSize}
            height={config.iconSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='var(--text-muted)'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            right: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: theme === 'light' ? 0.3 : 0.6,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          <svg
            width={config.iconSize}
            height={config.iconSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='var(--text-muted)'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='12' cy='12' r='3' />
            <line x1='12' y1='1' x2='12' y2='3' />
            <line x1='12' y1='21' x2='12' y2='23' />
            <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
            <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
            <line x1='1' y1='12' x2='3' y2='12' />
            <line x1='21' y1='12' x2='23' y2='12' />
          </svg>
        </div>
      </motion.button>

      {/* Optional Theme Label */}
      {showLabel && (
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: config.fontSize,
            fontWeight: '600',
            textTransform: 'capitalize',
            letterSpacing: '0.3px',
            userSelect: 'none',
            transition: 'color 0.3s ease',
          }}
        >
          {theme}
        </span>
      )}
    </div>
  );
};

export default ThemeSwitcher;
