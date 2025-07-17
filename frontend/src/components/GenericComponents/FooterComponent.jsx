const FooterComponent = () => {
  return (
    <footer
      className='w-100 border-0'
      style={{
        background: 'rgba(36,43,67,0.90)',
        boxShadow:
          '0 -4px 24px 0 rgba(16,185,129,0.04), 0 0px 0px 0 rgba(59,130,246,0.07)',
        backdropFilter: 'blur(8px)',
        color: '#f1f5fa',
        borderTop: '2px solid #e5e7eb',
        letterSpacing: '0.01em',
      }}
    >
      <div className='container py-3'>
        <div className='row align-items-center justify-content-between'>
          <div className='col-12 text-center'>
            <p
              className='mb-0 small'
              style={{ color: '#dbeafe', fontWeight: 500 }}
            >
              &copy; {new Date().getFullYear()}{' '}
              <span className='fw-bold'>ALI</span>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
