export default function ApplicationPart({ formData, setFormData }) {
  // Helper: check if a required field is empty
  const isEmpty = (val) => val === '' || val === null || val === undefined;

  return (
    <>
      <h5 className='my-2'>Application</h5>
      <div className='row mb-3'>
        <div className='col-md-6'>
          <label className='form-label'>Advance Amount Requested</label>
          <input
            type='number'
            className={`form-control form-control-sm ${
              isEmpty(formData.amount) ? 'is-invalid' : ''
            }`}
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                amount: e.target.value.replace(/[^0-9.]/g, ''),
              }))
            }
            min='0'
            step='0.01'
            placeholder='Amount'
            required
          />
          {isEmpty(formData.amount) && (
            <div className='invalid-feedback'>Amount is required.</div>
          )}
        </div>
        <div className='col-md-6'>
          <label className='form-label'>Initial Term(months)</label>
          <input
            type='number'
            className={`form-control form-control-sm bg-light ${
              isEmpty(formData.term) ? 'is-invalid' : ''
            }`}
            value={formData.term}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, term: e.target.value }))
            }
            required
            disabled
          />
          {isEmpty(formData.term) && (
            <div className='invalid-feedback'>Term is required.</div>
          )}
        </div>
      </div>
      <div className='row mb-3'>
        <div className='col-md-6'>
          <label className='form-label'>Deceased First Name</label>
          <input
            type='text'
            className={`form-control form-control-sm ${
              isEmpty(formData.deceased.first_name) ? 'is-invalid' : ''
            }`}
            value={formData.deceased.first_name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                deceased: { ...prev.deceased, first_name: e.target.value },
              }))
            }
            required
          />
          {isEmpty(formData.deceased.first_name) && (
            <div className='invalid-feedback'>
              Deceased first name is required.
            </div>
          )}
        </div>
        <div className='col-md-6'>
          <label className='form-label'>Deceased Last Name</label>
          <input
            type='text'
            className={`form-control form-control-sm ${
              isEmpty(formData.deceased.last_name) ? 'is-invalid' : ''
            }`}
            value={formData.deceased.last_name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                deceased: { ...prev.deceased, last_name: e.target.value },
              }))
            }
            required
          />
          {isEmpty(formData.deceased.last_name) && (
            <div className='invalid-feedback'>
              Deceased last name is required.
            </div>
          )}
        </div>
      </div>
      <div className='row mb-3'>
        <div className='col-md-12'>
          <label className='form-label'>Dispute Details</label>
          <textarea
            type='text'
            className='form-control form-control-sm'
            value={formData.dispute.details}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                dispute: { ...prev.dispute, details: e.target.value },
              }))
            }
            placeholder='Optional: You may add details about any disputes related to this application. If there are no disputes, feel free to leave this field empty.'
          />
        </div>
      </div>
      <hr />
      {/* Will prepared by solicitor */}
      <div className='row mb-3 align-items-center'>
        <div className='col-12'>
          <div className='d-flex align-items-center gap-3'>
            <label className='form-label mb-0' style={{ minWidth: 320 }}>
              Was this will professionally prepared by a solicitor?
              <span className='text-danger ms-1'>*</span>
            </label>
            <div className='form-check form-check-inline mb-0'>
              <input
                className={`form-check-input ${
                  isEmpty(formData.was_will_prepared_by_solicitor)
                    ? 'is-invalid'
                    : ''
                }`}
                type='radio'
                name='was_will_prepared_by_solicitor'
                id='will_prepared_yes'
                value='true'
                checked={formData.was_will_prepared_by_solicitor === true}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    was_will_prepared_by_solicitor: true,
                  }))
                }
                required
              />
              <label
                className='form-check-label'
                htmlFor='will_prepared_yes'
                style={{ marginLeft: 4, marginRight: 16, fontWeight: 500 }}
              >
                Yes
              </label>
            </div>
            <div className='form-check form-check-inline mb-0'>
              <input
                className={`form-check-input ${
                  isEmpty(formData.was_will_prepared_by_solicitor)
                    ? 'is-invalid'
                    : ''
                }`}
                type='radio'
                name='was_will_prepared_by_solicitor'
                id='will_prepared_no'
                value='false'
                checked={formData.was_will_prepared_by_solicitor === false}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    was_will_prepared_by_solicitor: false,
                  }))
                }
                required
              />
              <label
                className='form-check-label'
                htmlFor='will_prepared_no'
                style={{ marginLeft: 4, fontWeight: 500 }}
              >
                No
              </label>
            </div>
          </div>
          {isEmpty(formData.was_will_prepared_by_solicitor) && (
            <div className='text-danger mt-1 small'>
              Please select an answer.
            </div>
          )}
        </div>
      </div>
      <hr />
    </>
  );
}
