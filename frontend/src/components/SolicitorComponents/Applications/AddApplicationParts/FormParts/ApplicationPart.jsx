
export default function ApplicationPart({ formData, setFormData }) {
  const handleChange = (e, field) => {
    let value = e.target.value;
    if (field === 'amount') {
      value = value.replace(/[^0-9.]/g, '');
    }
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (e, parentField, field) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: e.target.value,
      },
    }));
  };

  return (
    <>
      <h5 className='my-2'>Application</h5>
      <div className='row mb-3'>
        <div className='col-md-6'>
          <label className='form-label'>Advance Amount Requested</label>
          <input
              type='number'
              className='form-control form-control-sm'
            value={formData.amount}
            onChange={e => handleChange(e, 'amount')}
            min='0'
            step='0.01'
            placeholder='Amount'
            required
          />
        </div>
        <div className='col-md-6'>
          <label className='form-label'>Initial Term(months)</label>
          <input
            type='number'
            className='form-control form-control-sm bg-light'
            value={formData.term}
            onChange={e => handleChange(e, 'term')}
            required
            disabled
          />
        </div>
      </div>
      <div className='row mb-3'>
        <div className='col-md-6'>
          <label className='form-label'>Deceased First Name</label>
          <input
            type='text'
            className='form-control form-control-sm'
            value={formData.deceased.first_name}
            onChange={e => handleNestedChange(e, 'deceased', 'first_name')}
            required
          />
        </div>
        <div className='col-md-6'>
          <label className='form-label'>Deceased Last Name</label>
          <input
            type='text'
            className='form-control form-control-sm'
            value={formData.deceased.last_name}
            onChange={e => handleNestedChange(e, 'deceased', 'last_name')}
            required
          />
        </div>
      </div>
      <div className='row mb-3'>
        <div className='col-md-12'>
          <label className='form-label'>Dispute Details</label>
          <textarea
            type='text'
            className='form-control form-control-sm'
            value={formData.dispute.details}
            onChange={e => handleNestedChange(e, 'dispute', 'details')}
            placeholder='Optional: You may add details about any disputes related to this application. If there are no disputes, feel free to leave this field empty.'
          />
        </div>
      </div>
      <hr />
    </>
  );
}
