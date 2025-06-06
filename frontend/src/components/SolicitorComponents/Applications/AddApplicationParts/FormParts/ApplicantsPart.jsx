import { FaPlus, FaTrash } from 'react-icons/fa';

const TITLE_CHOICES = ['Mr', 'Ms', 'Mrs', 'Dr', 'Prof'];

// Helper function to check for emptiness
const isEmpty = (val) => val === '' || val === null || val === undefined;

export default function ApplicantsPart({
  applicants,
  setFormData,
  idNumberArray,
}) {
  const handleListChange = (e, index, field) => {
    setFormData((prev) => {
      const newApplicants = [...prev.applicants];
      newApplicants[index][field] = e.target.value;
      return { ...prev, applicants: newApplicants };
    });
  };

  const addApplicant = () => {
    setFormData((prev) => ({
      ...prev,
      applicants: [
        ...prev.applicants,
        { title: 'Mr', first_name: '', last_name: '', pps_number: '' },
      ],
    }));
  };

  const removeApplicant = (index) => {
    setFormData((prev) => {
      const newApplicants = [...prev.applicants];
      newApplicants.splice(index, 1);
      return { ...prev, applicants: newApplicants };
    });
  };

  return (
    <div className='mb-3'>
      <h5 className='my-2'>Applicants</h5>
      {applicants.map((applicant, index) => (
        <div key={index} className='card mb-3 p-2 bg-light'>
          <div className='row'>
            <div className='col-md-2'>
              <label className='form-label'>Title</label>
              <select
                className={`form-control form-control-sm ${
                  isEmpty(applicant.title) ? 'is-invalid' : ''
                }`}
                value={applicant.title}
                onChange={(e) => handleListChange(e, index, 'title')}
                required
              >
                {TITLE_CHOICES.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              {isEmpty(applicant.title) && (
                <div className='invalid-feedback'>Title is required.</div>
              )}
            </div>
            <div className='col-md-3'>
              <label className='form-label'>First Name</label>
              <input
                type='text'
                className={`form-control form-control-sm ${
                  isEmpty(applicant.first_name) ? 'is-invalid' : ''
                }`}
                value={applicant.first_name}
                onChange={(e) => handleListChange(e, index, 'first_name')}
                required
              />
              {isEmpty(applicant.first_name) && (
                <div className='invalid-feedback'>First name is required.</div>
              )}
            </div>
            <div className='col-md-3'>
              <label className='form-label'>Last Name</label>
              <input
                type='text'
                className={`form-control form-control-sm ${
                  isEmpty(applicant.last_name) ? 'is-invalid' : ''
                }`}
                value={applicant.last_name}
                onChange={(e) => handleListChange(e, index, 'last_name')}
                required
              />
              {isEmpty(applicant.last_name) && (
                <div className='invalid-feedback'>Last name is required.</div>
              )}
            </div>
            <div className='col-md-3'>
              <label className='form-label'>{idNumberArray[0]} Number</label>
              <input
                type='text'
                className={`form-control form-control-sm ${
                  isEmpty(applicant.pps_number) ? 'is-invalid' : ''
                }`}
                value={applicant.pps_number}
                onChange={(e) => handleListChange(e, index, 'pps_number')}
                placeholder={idNumberArray[1]}
                required
              />
              {isEmpty(applicant.pps_number) && (
                <div className='invalid-feedback'>
                  {idNumberArray[0]} number is required.
                </div>
              )}
            </div>
            <div className='col-md-1 text-end'>
              <button
                type='button'
                className='btn btn-danger mt-4 btn-sm'
                onClick={() => removeApplicant(index)}
                disabled={applicants.length === 1}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        type='button'
        className='btn btn-primary btn-sm'
        onClick={addApplicant}
      >
        <FaPlus /> Add Applicant
      </button>
      <hr />
    </div>
  );
}
