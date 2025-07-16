import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import './App.css';
import { COUNTRY } from './baseUrls';
import './bootstrap.min.css';
import FooterComponent from './components/GenericComponents/FooterComponent';
import renderErrors from './components/GenericFunctions/HelperGenericFunctions';
import ActivationPage from './components/Login/ActivationPage';
import AutoLogoutComponent from './components/Login/AutoLogoutComponent';
import ForgotPassword from './components/Login/ForgotPassword';
import LoginComponent from './components/Login/LoginComponent';
import OtpVerification from './components/Login/OtpVerification';
import RegisterComponent from './components/Login/RegisterComponent';
import ResetPassword from './components/Login/ResetPassword';
import NavBar from './components/NavBar/NavBar';
import AddApplication from './components/SolicitorComponents/Applications/AddApplication';
import ApplicationDetails from './components/SolicitorComponents/Applications/ApplicationDetails';
import AdvancementDetailsConfirm from './components/SolicitorComponents/Applications/ApplicationDocumentsComponents/Advancement/AdvancementDetailsConfirm';
import Applications from './components/SolicitorComponents/Applications/Applications';
import FileManager from './components/SolicitorComponents/Applications/DocumentsForDownloadComponent/FileManager';
import UploadNewDocumentSigned from './components/SolicitorComponents/Applications/UploadingFileComponents/Signed/UploadNewDocumentSigned';
import UploadNewDocument from './components/SolicitorComponents/Applications/UploadingFileComponents/UploadNewDocument';
import CookieConsent from './components/SolicitorComponents/CookieConsent/CookieConsent';
import Solicitors from './components/SolicitorComponents/SolicitorsComponent.jsx/Solicitors';
import UpdatePasswordComponent from './components/SolicitorComponents/UpdatePasswordComponent';
import UserProfile from './components/SolicitorComponents/UserProfileComponent';
import Benefits from './components/StaticPagesComponents/Benefits/Benefits';
import Home from './components/StaticPagesComponents/Home/Home';
import HowItWorks from './components/StaticPagesComponents/HowItWorks/HowItWorks';
import UnderstandingProbate from './components/StaticPagesComponents/UnderstandingProbate/UnderstandingProbate';
import { loginSuccess, logout } from './store/authSlice';
import { clearUser, fetchUser } from './store/userSlice';
import apiEventEmitter from './utils/eventEmitter';
// app
function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [autoLoggedOutMessage, setAutoLoggedOutMessage] = useState(null);

  useEffect(() => {
    // Listen for logoutRequired event
    const handleLogout = () => {
      console.log('🚨 Auto logging out user due to API key issue');
      dispatch(logout());
      dispatch(clearUser());
      setAutoLoggedOutMessage([
        '🚨 Session Expired',
        `Your session has expired or is no longer valid.`,
        ` For security reasons, you have been automatically logged out.`,
        ` Please log in again to continue.`,
      ]);
    };

    apiEventEmitter.on('logoutRequired', handleLogout);

    return () => {
      // Cleanup event listener
      apiEventEmitter.off('logoutRequired', handleLogout);
    };
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      setAutoLoggedOutMessage(null);
    }
  }, [isLoggedIn]);

  // Get the country from the .env file

  // Handle missing or undefined country
  if (!COUNTRY) {
    console.error(
      'Error: REACT_APP_COUNTRY is not defined in the environment variables.'
    );
    alert(
      'Application cannot run: Country is not defined. Please set the REACT_APP_COUNTRY environment variable.'
    );
  } else {
    const defaultTitle = 'Probate Solicitors';
    document.title = `${defaultTitle} (${COUNTRY})`;

    // Configure cookies based on the country
    if (COUNTRY === 'UK') {
      Cookies.set('country_solicitors', 'UK');
      Cookies.set('currency_sign', '£');
      Cookies.set('id_number', JSON.stringify(['NI', 'XX123456Y']));
      Cookies.set('phone_nr_placeholder', '+447911123456');
      Cookies.set(
        'postcode_placeholders',
        JSON.stringify(['Postcode', 'XX9 9YY', 'SW1A 1AA'])
      );
    } else if (COUNTRY === 'IE') {
      Cookies.set('country_solicitors', 'IE');
      Cookies.set('currency_sign', '€');
      Cookies.set('id_number', JSON.stringify(['PPS', '1234567X(Y)']));
      Cookies.set('phone_nr_placeholder', '+353871234567');
      Cookies.set(
        'postcode_placeholders',
        JSON.stringify(['Eircode', 'XXXYYYY', 'D02X285'])
      );
    } else {
      console.warn(`Unsupported country: ${COUNTRY}`);
    }
  }

  let tokenObj = Cookies.get('auth_token');
  if (tokenObj) {
    try {
      tokenObj = JSON.parse(tokenObj);
    } catch (error) {
      console.error('Error parsing tokenObj:', error);
      tokenObj = null; // ensure tokenObj is null if parsing fails
    }
  } else {
    console.log('No token in cookies:', tokenObj);
  }

  useEffect(() => {
    if (tokenObj) {
      dispatch(loginSuccess({ tokenObj }));
      dispatch(fetchUser());
    } else {
      console.log('No token detected');
    }
  }, [dispatch, tokenObj]);

  return (
    <Router>
      <>
        <div>
          <NavBar />
        </div>
        {isLoggedIn && (
          <div
            className='container-fluid p-0 '
            style={{ maxWidth: '1200px', margin: '4px auto' }}
          >
            <CookieConsent />
          </div>
        )}
        {isLoggedIn && <AutoLogoutComponent />}{' '}
        <Routes>
          {/* ALL THE STATIC ROUTES TURNED OFF NOW, THEY WILL BE AUTO REDIRECTING TO LOGIN */}
          {/* Redirect all static pages to /login */}
          <Route path='/' element={<Navigate to='/login' replace />} />
          <Route
            path='/understanding'
            element={<Navigate to='/login' replace />}
          />
          <Route
            path='/howItWorks'
            element={<Navigate to='/login' replace />}
          />
          <Route path='/benefits' element={<Navigate to='/login' replace />} />
          {/* IF STATIC ROUTES ARE BACK JUST UNCOMENT ABOVE */}
          {/* Static Pages */}
          <Route
            path='/'
            element={
              <div
                className='container-fluid p-0 '
                style={{ maxWidth: '1200px', margin: '4px auto' }}
              >
                <Home />
              </div>
            }
          />
          <Route
            path='/understanding'
            element={
              <div
                className='container-fluid p-0 '
                style={{ maxWidth: '1200px', margin: '4px auto' }}
              >
                <UnderstandingProbate />
              </div>
            }
          />
          <Route
            path='/howItWorks'
            element={
              <div
                className='container-fluid p-0 '
                style={{ maxWidth: '1200px', margin: '4px auto' }}
              >
                <HowItWorks />
              </div>
            }
          />
          <Route
            path='/benefits'
            element={
              <div
                className='container-fluid p-0 '
                style={{ maxWidth: '1200px', margin: '4px auto' }}
              >
                <Benefits />
              </div>
            }
          />

          {/* Application Paths */}
          <Route
            path='/addApplication'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={
                  <div
                    className='container-fluid p-0 '
                    style={{ maxWidth: '1200px', margin: '4px auto' }}
                  >
                    <AddApplication />
                  </div>
                }
              />
            }
          />
          <Route
            path='/applications'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={
                  <div
                    className='container-fluid p-0 '
                    style={{ maxWidth: '1200px', margin: '4px auto' }}
                  >
                    <Applications />
                  </div>
                }
              />
            }
          />
          <Route
            path='/applications/:id'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={
                  <div
                    className='container-fluid p-0 '
                    style={{ maxWidth: '1200px', margin: '4px auto' }}
                  >
                    <ApplicationDetails />
                  </div>
                }
              />
            }
          />
          <Route
            path='/createApplicationPdfsForSign/:id'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={
                  <div className=' container-fluid p-0 mx-1 mx-md-0'>
                    <AdvancementDetailsConfirm />
                  </div>
                }
              />
            }
          />

          {/* Solicitor Paths */}
          <Route
            path='/solicitors'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={
                  <div
                    className='container-fluid p-0 '
                    style={{ maxWidth: '1200px', margin: '4px auto' }}
                  >
                    <Solicitors />
                  </div>
                }
              />
            }
          />

          {/* Login Paths */}
          <Route
            path='/login'
            element={
              !isLoggedIn ? (
                <div
                  className='container-fluid p-0 '
                  style={{ maxWidth: '1200px', margin: '4px auto' }}
                >
                  {autoLoggedOutMessage && (
                    <div className=' alert alert-danger text-center'>
                      {renderErrors(autoLoggedOutMessage)}
                    </div>
                  )}
                  <LoginComponent />
                </div>
              ) : (
                <CustomRedirect />
              )
            }
          />
          <Route
            path='/register'
            element={
              <div
                className='container-fluid p-0 '
                style={{ maxWidth: '1200px', margin: '4px auto' }}
              >
                <RegisterComponent />
              </div>
            }
          />
          <Route
            path='/forgotPassword'
            element={
              <div
                className='container-fluid p-0 '
                style={{ maxWidth: '1200px', margin: '4px auto' }}
              >
                <ForgotPassword />
              </div>
            }
          />
          <Route
            path='/reset-password/:uidb64/:token'
            element={
              <div
                className='container-fluid p-0 '
                style={{ maxWidth: '1200px', margin: '4px auto' }}
              >
                <ResetPassword />
              </div>
            }
          />
          <Route
            path='/activate/:activation_token'
            element={
              <div
                className='container-fluid p-0 '
                style={{ maxWidth: '1200px', margin: '4px auto' }}
              >
                <ActivationPage />
              </div>
            }
          />
          <Route
            path='/verify-otp'
            element={
              <div
                className='container-fluid p-0 '
                style={{ maxWidth: '1200px', margin: '4px auto' }}
              >
                <OtpVerification />
              </div>
            }
          />

          {/* Document Uploading Paths */}
          <Route
            path='/upload_new_document/:applicationId'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={
                  <div
                    className='container-fluid p-0 '
                    style={{ maxWidth: '1200px', margin: '4px auto' }}
                  >
                    <UploadNewDocument />
                  </div>
                }
              />
            }
          />
          <Route
            path='/upload_new_document_signed/:applicationId'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={
                  <div
                    className='container-fluid p-0 '
                    style={{ maxWidth: '1200px', margin: '4px auto' }}
                  >
                    <UploadNewDocumentSigned />
                  </div>
                }
              />
            }
          />

          {/* User Profile and Management Paths */}
          <Route
            path='/user_profile'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={
                  <div
                    className='container-fluid p-0 '
                    style={{ maxWidth: '1200px', margin: '4px auto' }}
                  >
                    <UserProfile />
                  </div>
                }
              />
            }
          />
          <Route
            path='/update_password'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={
                  <div
                    className='container-fluid p-0 '
                    style={{ maxWidth: '1200px', margin: '4px auto' }}
                  >
                    <UpdatePasswordComponent />
                  </div>
                }
              />
            }
          />
          <Route
            path='/documentsForDownload'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={
                  <div
                    className='container-fluid p-0 '
                    style={{ maxWidth: '1200px', margin: '4px auto' }}
                  >
                    <FileManager />
                  </div>
                }
              />
            }
          />
        </Routes>
        <FooterComponent />
      </>
    </Router>
  );
}

// Custom ProtectedRoute component to handle authentication and redirects
const ProtectedRoute = ({ component, isLoggedIn }) => {
  const location = useLocation();
  return isLoggedIn ? (
    component
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

// Custom Redirect Component to redirect users to their intended route
const CustomRedirect = () => {
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/applications';
  return <Navigate to={redirectTo} replace />;
};

export default App;
