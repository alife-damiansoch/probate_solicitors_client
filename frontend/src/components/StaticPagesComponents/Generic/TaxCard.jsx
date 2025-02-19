const cardStyle = {
  backgroundColor: 'white',
  color: 'black',
  padding: '30px',
  border: '1px solid #ddd',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
};

const columnStyle = {
  padding: '10px',
  border: '1px solid lightgray',
  borderRadius: '5px',
};

const TaxCard = () => (
  <div className='card w-auto' style={cardStyle}>
    <div className='row text-center'>
      <div className='col-lg-6' style={columnStyle}>
        <h5>Tax liability with no advance</h5>
        <br />
        <p>Incumbrance free value of the estate €3,000,000</p>
        <p>Payment to sisters - €1,000,000</p>
        <p>Legal Fees - €50,000</p>
        <p>Tax Free Threshold - €335,000</p>
        <p> -</p>
        <p>
          <strong>Taxable Value of the estate €1,600,000</strong>
        </p>
        <p>@33% CAT</p>
        <p>
          <strong>Total Tax Due €532,950</strong>
        </p>
      </div>
      <div className='col-md-6' style={columnStyle}>
        <h5>Tax liability with advance</h5>
        <br />
        <p>Incumbrance free value of the estate €3,000,000</p>
        <p>Payment to sisters - €1,000,000</p>
        <p>Legal Fees - €50,000</p>
        <p>Tax Free Threshold - €335,000</p>
        <p>Advancement Fee - €300,000</p>
        <p>
          <strong>Taxable Value of the estate €1,300,000</strong>
        </p>
        <p>@33% CAT</p>
        <p>
          <strong>Total Tax Due €433,950</strong>
        </p>
      </div>
    </div>
  </div>
);

export default TaxCard;
