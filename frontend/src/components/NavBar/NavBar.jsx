import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { RiLoginCircleLine, RiLogoutCircleRLine } from 'react-icons/ri';
import { clearUser } from '../../store/userSlice';
import { motion } from 'framer-motion';
import AliBanner from './AliBanner/AliBanner';
import AnimatedSection from '../GenericFunctions/AnimatedSection';
import { postData } from '../GenericFunctions/AxiosGenericFunctions';
import NavLinkAnimated from '../GenericComponents/NavLinkAnimated';

const NavBar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();

  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);

  const [hoveredNavLink, setHoveredNavLink] = useState('');

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

  // Determine the active link based on the current pathname
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className='navbar navbar-expand-lg navbar-light bg-light border-0 mb-2 position-relative'>
        <Link className='navbar-brand text-center mx-3' to='/'>
          <AnimatedSection
            as='div'
            className='col text-center text-center mx-auto'
            style={{ width: '80px' }}
          >
            <motion.img
              id='logo'
              src='/img/ALI logo.png'
              alt='ALI logo'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{
                filter: 'invert(50%)',
                cursor: 'pointer',
                opacity: 0.5,
              }}
              transition={{ delay: 1, duration: 1 }}
              onClick={() => {
                navigate('');
              }}
              style={{
                filter: 'invert(100%)',
                width: '100%',
              }}
            />
          </AnimatedSection>
        </Link>
        <button
          className='navbar-toggler ms-auto'
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
            !isNavbarCollapsed ? 'show' : ''
          }`}
          id='navbarNav'
        >
          <ul className='navbar-nav mr-auto text-center d-flex align-items-center justify-content-center flex-wrap col-12 col-md-10'>
            <li className='nav-item mx-auto my-auto mb-2'>
              <NavLinkAnimated
                to='/'
                label='Home'
                isActive={isActive}
                closeNavbar={closeNavbar}
              />
            </li>
            <li className='nav-item mx-auto my-auto mb-2'>
              <NavLinkAnimated
                to='/understanding'
                label='Understanding Probate'
                isActive={isActive}
                closeNavbar={closeNavbar}
              />
            </li>
            <li className='nav-item mx-auto my-auto mb-2'>
              <NavLinkAnimated
                to='/howItWorks'
                label='Advancement Process'
                isActive={isActive}
                closeNavbar={closeNavbar}
              />
            </li>
            <li className='nav-item mx-auto my-auto mb-2'>
              <NavLinkAnimated
                to='/benefits'
                label='Benefits'
                isActive={isActive}
                closeNavbar={closeNavbar}
              />
            </li>
            {/* Line Break */}
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
                className='btn btn-sm btn-outline-danger my-2 my-sm-0 ms-auto shadow mb-2 w-100'
                onClick={() => {
                  handleLogout();
                  closeNavbar();
                }}
              >
                <RiLogoutCircleRLine size={20} className='me-3' />
                Logout
              </Link>
            ) : (
              <Link
                className='btn btn-sm btn-outline-primary my-2 ms-auto shadow mb-2 w-100'
                to='/login'
                onClick={closeNavbar}
              >
                <RiLoginCircleLine size={20} className='me-3' />
                Login
              </Link>
            )}
            {user ? (
              <AnimatedSection as='div' className=''>
                <div className=''>
                  <div
                    className='btn btn-outline-success btn-sm text-center mt-2 shadow w-100'
                    data-bs-toggle='tooltip'
                    data-bs-placement='bottom'
                    title='View User'
                    onClick={viewUserProfileHandler}
                  >
                    <small>{user.email}</small>
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
        !location.pathname.includes('/activate') &&
        !location.pathname.includes('/forgotPassword') &&
        !location.pathname.includes('/reset-password') &&
        !location.pathname.includes('/update_password') &&
        !location.pathname.includes('/verify-otp') &&
        !location.pathname.includes('/register') && (
          <AnimatedSection>
            <motion.div
              id='hero-section'
              style={{
                width: '100%',
                position: 'relative',
                marginBottom: '-5px',
                height: '300px',
              }}
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <motion.img
                id='hero-image'
                src='/img/handshake.jpg'
                alt='handshake'
                style={{
                  width: '100%',
                  objectFit: 'cover',
                  filter: isImageHovered ? 'grayscale(100%)' : 'none',
                  transition: 'filter 0.3s ease',
                  height: '100%',
                }}
                initial='hidden'
                animate='visible'
              />
              <motion.div
                id='hero-text-container'
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  height: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'Great Vibes, cursive',
                  cursor: 'pointer',
                }}
                initial='hidden'
                animate='visible'
                className='row'
                onClick={() => navigate('')}
              >
                <motion.p
                  id='hero-text'
                  style={{
                    whiteSpace: 'nowrap',
                    color: isImageHovered
                      ? 'rgba(77, 3, 4, 1)'
                      : 'rgba(255, 255, 255, 1)',
                    transition: 'color 1s ease',
                  }}
                  className='my-auto mx-auto'
                >
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
