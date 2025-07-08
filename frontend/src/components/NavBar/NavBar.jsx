// Updated NavBar.js - Mobile Responsive
import { motion } from 'framer-motion';
import { useState } from 'react';
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
import './NavBar.css'; // Import external CSS

const NavBar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();

  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);

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

  return (
    <>
      <nav className='navbar navbar-expand-lg modern-navbar border-0 mb-2 position-relative'>
        <Link className='navbar-brand text-center mx-3' to='/'>
          <AnimatedSection
            as='div'
            className='col text-center mx-auto modern-logo-container'
          >
            <motion.img
              id='logo'
              src='/img/ALI logo.png'
              alt='ALI logo'
              className='modern-logo'
              onClick={() => navigate('')}
              style={{ cursor: 'pointer' }}
            />
          </AnimatedSection>
        </Link>

        <button
          className='navbar-toggler modern-toggler ms-auto'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded={!isNavbarCollapsed ? 'true' : 'false'}
          aria-label='Toggle navigation'
          onClick={toggleNavbar}
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div
          className={`collapse navbar-collapse ${
            !isNavbarCollapsed ? 'show modern-collapse' : ''
          }`}
          id='navbarNav'
        >
          <ul className='navbar-nav mr-auto text-center d-flex align-items-center justify-content-center flex-wrap col-12 col-md-10'>
            <div className='w-100 d-none d-lg-block'></div>
            {isLoggedIn ? (
              <li className='nav-item mx-auto my-auto mb-2'>
                <NavLinkAnimated
                  to='/applications'
                  label='Applications'
                  isActive={isActive}
                  closeNavbar={closeNavbar}
                />
              </li>
            ) : null}
            {isLoggedIn ? (
              <li className='nav-item mx-auto my-auto mb-2'>
                <NavLinkAnimated
                  to='/documentsForDownload'
                  label='Documents for download'
                  isActive={isActive}
                  closeNavbar={closeNavbar}
                />
              </li>
            ) : null}
          </ul>

          <div className='col-12 col-md-2'>
            {isLoggedIn ? (
              <Link
                className='btn modern-btn modern-btn-danger my-2 my-sm-0 ms-auto shadow mb-2 d-flex align-items-center justify-content-center'
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
                className='btn modern-btn my-2 ms-auto shadow mb-2 d-flex align-items-center justify-content-center'
                to='/login'
                onClick={closeNavbar}
              >
                <RiLoginCircleLine size={20} className='me-2' />
                Login
              </Link>
            )}

            {user ? (
              <AnimatedSection as='div' className=''>
                <div className=''>
                  <div
                    className='btn modern-btn modern-btn-success text-center mt-2 shadow d-flex align-items-center justify-content-center'
                    data-bs-toggle='tooltip'
                    data-bs-placement='bottom'
                    title={user.email}
                    onClick={viewUserProfileHandler}
                    style={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer',
                    }}
                  >
                    <LuUserRoundCog size={20} />
                    <small className='text-truncate ms-2'>PROFILE</small>
                  </div>
                </div>
              </AnimatedSection>
            ) : null}
          </div>
        </div>
      </nav>

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
            <motion.div
              id='hero-section'
              className='hero-container'
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <div className='hero-overlay'></div>
              <motion.img
                id='hero-image'
                src='/img/handshake.jpg'
                alt='handshake'
                style={{
                  width: '100%',
                  objectFit: 'cover',
                  filter: isImageHovered
                    ? 'grayscale(100%) brightness(0.7)'
                    : 'brightness(0.8)',
                  transition: 'filter 0.6s ease',
                  height: '100%',
                }}
                initial='hidden'
                animate='visible'
              />
              <motion.div
                id='hero-text-container'
                initial='hidden'
                animate='visible'
                className='row'
                onClick={() => navigate('')}
                style={{ cursor: 'pointer' }}
              >
                <motion.p id='hero-text' className='hero-text-modern'>
                  Probate Advancements
                </motion.p>
              </motion.div>
            </motion.div>
            <AnimatedSection>
              <AliBanner />
            </AnimatedSection>
          </AnimatedSection>
        )}
    </>
  );
};

export default NavBar;
