
import Cookies from 'js-cookie';
import {useEffect, useState} from "react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!Cookies.get('cookieConsent')) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = () => {
    Cookies.set('cookieConsent', 'true', { expires: 365, path: '/' });
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.content}>
        <p style={styles.text} className=' text-center'>
          We use essential cookies to enhance your browsing experience and
          provide localized functionality. <br />
          By continuing to use this website, you agree to our use of essential
          cookies.
        </p>
        <button style={styles.button} onClick={handleConsent}>
          Accept
        </button>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 20px',
    zIndex: 1000,
  },
  content: {
    maxWidth: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    margin: 0,
    padding: 0,
    fontSize: '14px',
    flex: 1,
    marginX: '10px',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    flexShrink: 0,
  },
};

export default CookieConsent;
