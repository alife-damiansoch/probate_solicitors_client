const FooterComponent = () => {
  return (
    <footer className='text-white py-4 border-top border-black'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col text-end '>
            <p className='mb-0'>
              &copy; {new Date().getFullYear()} ALI. All rights reserved.
            </p>
          </div>
          {/* <Col md={6} className='text-center text-md-right'>
            <p className='mb-0'>Designed and Developed by Your Company</p>
          </Col> */}
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
