// Updated NavBar.js - Mobile-First Responsive with Bootstrap
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { LuUserRoundCog } from 'react-icons/lu';
import { RiLoginCircleLine, RiLogoutCircleRLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { clearUser } from '../../store/userSlice';
import NavLinkAnimated from '../GenericComponents/NavLinkAnimated';
import AnimatedSection from '../GenericFunctions/AnimatedSection';
import { postData } from '../GenericFunctions/AxiosGenericFunctions';
import AliBanner from './AliBanner/AliBanner';

const NavBar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();

  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);
  const navbarRef = useRef(null);

  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        !isNavbarCollapsed
      ) {
        setIsNavbarCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavbarCollapsed]);

  const handleLogout = async () => {
    try {
      await postData(
        'token',
        '/api/user/logout/',
        {},
        { withCredentials: true }
      );
      dispatch(logout());
      dispatch(clearUser());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleNavbar = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  const closeNavbar = () => {
    setIsNavbarCollapsed(true);
  };

  const user = useSelector((state) => state.user.user);
  const viewUserProfileHandler = () => {
    navigate('/user_profile');
  };

  const isActive = (path) => location.pathname === path;

  // Inline styles for glassmorphism effects
  const glassmorphismNavbar = {
    background:
      'linear-gradient(135deg, rgba(10, 15, 28, 0.98) 0%, rgba(17, 24, 39, 0.98) 30%, rgba(31, 41, 59, 0.98) 70%, rgba(10, 15, 28, 0.98) 100%)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
    boxShadow:
      '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)',
  };

  const glassmorphismLogo = {
    background:
      'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 30%, rgba(241, 245, 249, 0.95) 70%, rgba(255, 255, 255, 0.95) 100%)',
    border: '2px solid rgba(59, 130, 246, 0.2)',
    boxShadow:
      '0 4px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const glassmorphismBtn = {
    background:
      'linear-gradient(145deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(29, 78, 216, 0.9) 100%)',
    border: '2px solid rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(15px)',
    boxShadow:
      '0 2px 10px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const glassmorphismBtnDanger = {
    background:
      'linear-gradient(145deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 50%, rgba(185, 28, 28, 0.9) 100%)',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    backdropFilter: 'blur(15px)',
    boxShadow:
      '0 2px 10px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const glassmorphismBtnSuccess = {
    background:
      'linear-gradient(145deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 50%, rgba(4, 120, 87, 0.9) 100%)',
    border: '2px solid rgba(16, 185, 129, 0.3)',
    backdropFilter: 'blur(15px)',
    boxShadow:
      '0 2px 10px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const glassmorphismCollapse = {
    background:
      'linear-gradient(135deg, rgba(10, 15, 28, 0.98) 0%, rgba(17, 24, 39, 0.98) 50%, rgba(10, 15, 28, 0.98) 100%)',
    backdropFilter: 'blur(25px)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  };

  const heroOverlay = {
    background:
      'linear-gradient(135deg, rgba(10, 15, 28, 0.6) 0%, transparent 50%, rgba(59, 130, 246, 0.3) 100%)',
  };

  const heroText = {
    background: 'linear-gradient(135deg, #ffffff, #e2e8f0, #cbd5e1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
    transition: 'all 0.6s ease',
  };

  return (
    <>
      {/* Navbar */}
      <nav
        ref={navbarRef}
        className='navbar navbar-expand-lg border-0 mb-2 position-fixed top-0'
        style={{
          ...glassmorphismNavbar,
          zIndex: 1050,
          minHeight: '80px',
          width: '100%',
        }}
      >
        <div className='container-fluid px-0 px-md-3'>
          <div className='row w-100 align-items-center mx-0'>
            {/* Logo Section */}
            <div className='col-6 col-md-2 px-2'>
              <Link
                className='navbar-brand d-flex justify-content-start'
                to='/'
              >
                <AnimatedSection
                  as='div'
                  className='d-flex align-items-center justify-content-start'
                >
                  <motion.div
                    className='rounded-3 p-1 p-md-2'
                    style={glassmorphismLogo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.img
                      id='logo'
                      src='/img/ALI logo.png'
                      alt='ALI logo'
                      className='img-fluid'
                      style={{
                        cursor: 'pointer',
                        maxWidth: 'clamp(35px, 8vw, 50px)',
                        height: 'auto',
                        filter: 'contrast(1.1) brightness(1.05)',
                      }}
                      onClick={() => navigate('')}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.div>
                </AnimatedSection>
              </Link>
            </div>

            {/* Mobile Toggle Button */}
            <div className='col-6 col-md-10 d-flex justify-content-end d-lg-none px-2'>
              <button
                className='navbar-toggler border-0 p-2 rounded-3'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target='#navbarNav'
                aria-controls='navbarNav'
                aria-expanded={!isNavbarCollapsed ? 'true' : 'false'}
                aria-label='Toggle navigation'
                onClick={toggleNavbar}
                style={{
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15))',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span
                  className='navbar-toggler-icon'
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2859, 130, 246, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='m4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")",
                  }}
                ></span>
              </button>
            </div>

            {/* Collapsed Navigation */}
            <div
              className={`collapse navbar-collapse col-12 col-lg-10 ${
                !isNavbarCollapsed ? 'show' : ''
              }`}
              id='navbarNav'
              style={
                !isNavbarCollapsed
                  ? {
                      ...glassmorphismCollapse,
                      marginTop: '12px',
                      borderRadius: '16px',
                      padding: '16px',
                      marginLeft: '0',
                      marginRight: '0',
                    }
                  : {}
              }
            >
              <div className='row w-100 mx-auto mx-md-0'>
                {/* Navigation Links */}
                <div className='col-12 col-lg-8'>
                  <ul className='navbar-nav d-flex flex-column flex-lg-row justify-content-center align-items-center w-100 mb-0'>
                    {isLoggedIn && (
                      <li className='nav-item mx-0 mx-lg-2 mb-2 mb-lg-0 w-100 w-lg-auto'>
                        <NavLinkAnimated
                          to='/applications'
                          label='Applications'
                          isActive={isActive}
                          closeNavbar={closeNavbar}
                        />
                      </li>
                    )}
                    {isLoggedIn && (
                      <li className='nav-item mx-0 mx-lg-2 mb-2 mb-lg-0 w-100 w-lg-auto'>
                        <NavLinkAnimated
                          to='/documentsForDownload'
                          label='Documents for download'
                          isActive={isActive}
                          closeNavbar={closeNavbar}
                        />
                      </li>
                    )}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className='col-12 col-lg-4'>
                  <div className='d-flex flex-column flex-lg-row align-items-center justify-content-lg-end gap-2'>
                    {/* User Profile Button */}
                    {user && (
                      <AnimatedSection as='div' className='w-100 w-lg-auto'>
                        <div
                          className='btn text-white fw-bold text-uppercase rounded-3 d-flex align-items-center justify-content-center w-100 w-lg-auto'
                          style={{
                            ...glassmorphismBtnSuccess,
                            minWidth: '120px',
                            padding: '10px 16px',
                            fontSize: '0.8rem',
                            letterSpacing: '0.6px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                          }}
                          data-bs-toggle='tooltip'
                          data-bs-placement='bottom'
                          title={user.email}
                          onClick={viewUserProfileHandler}
                        >
                          <LuUserRoundCog size={20} className='me-2' />
                          <span className='text-truncate'></span>Profile
                        </div>
                      </AnimatedSection>
                    )}
                    {/* Login/Logout Button */}
                    {isLoggedIn ? (
                      <Link
                        className='btn text-white fw-bold text-uppercase rounded-3 d-flex align-items-center justify-content-center w-100 w-lg-auto'
                        style={{
                          ...glassmorphismBtnDanger,
                          minWidth: '120px',
                          padding: '10px 16px',
                          fontSize: '0.8rem',
                          letterSpacing: '0.6px',
                          textDecoration: 'none',
                        }}
                        onClick={() => {
                          handleLogout();
                          closeNavbar();
                        }}
                      >
                        <RiLogoutCircleRLine size={20} className='me-2' />
                        Logout
                      </Link>
                    ) : (
                      <Link
                        className='btn text-white fw-bold text-uppercase rounded-3 d-flex align-items-center justify-content-center w-100 w-lg-auto'
                        style={{
                          ...glassmorphismBtn,
                          minWidth: '120px',
                          padding: '10px 16px',
                          fontSize: '0.8rem',
                          letterSpacing: '0.6px',
                          textDecoration: 'none',
                        }}
                        to='/login'
                        onClick={closeNavbar}
                      >
                        <RiLoginCircleLine size={20} className='me-2' />
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {!location.pathname.includes('/applications') &&
        !location.pathname.includes('/addApplication') &&
        !location.pathname.includes('/login') &&
        !location.pathname.includes('/solicitors') &&
        !location.pathname.includes('/user_profile') &&
        !location.pathname.includes('/documentsForDownload') &&
        !location.pathname.includes('/createApplicationPdfsForSign') &&
        !location.pathname.includes('/upload_new_document_signed') &&
        !location.pathname.includes('/upload_new_document') &&
        !location.pathname.includes('/activate') &&
        !location.pathname.includes('/forgotPassword') &&
        !location.pathname.includes('/reset-password') &&
        !location.pathname.includes('/update_password') &&
        !location.pathname.includes('/verify-otp') &&
        !location.pathname.includes('/register') && (
          <AnimatedSection>
            <div className='container-fluid px-2 px-md-3'>
              <motion.div
                id='hero-section'
                className='position-relative overflow-hidden rounded-4 shadow-lg'
                style={{
                  height: '200px',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
                onClick={() => navigate('')}
              >
                {/* Hero Overlay */}
                <div
                  className='position-absolute top-0 start-0 w-100 h-100'
                  style={{ ...heroOverlay, zIndex: 1 }}
                ></div>

                {/* Hero Image */}
                <motion.img
                  id='hero-image'
                  src='/img/handshake.jpg'
                  alt='handshake'
                  className='w-100 h-100 object-fit-cover'
                  style={{
                    filter: isImageHovered
                      ? 'grayscale(100%) brightness(0.7)'
                      : 'brightness(0.8)',
                    transition: 'filter 0.6s ease',
                  }}
                  initial='hidden'
                  animate='visible'
                />

                {/* Hero Text */}
                <motion.div
                  id='hero-text-container'
                  className='position-absolute top-50 start-50 translate-middle text-center'
                  style={{ zIndex: 2 }}
                  initial='hidden'
                  animate='visible'
                >
                  <motion.p
                    id='hero-text'
                    className='display-6 fw-bold mb-0 px-3'
                    style={{
                      ...heroText,
                      letterSpacing: '1px',
                      lineHeight: '1.2',
                      fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                    }}
                  >
                    Probate Advancements
                  </motion.p>
                </motion.div>
              </motion.div>
            </div>

            <AnimatedSection>
              <AliBanner />
            </AnimatedSection>
          </AnimatedSection>
        )}
    </>
  );
};

export default NavBar;
