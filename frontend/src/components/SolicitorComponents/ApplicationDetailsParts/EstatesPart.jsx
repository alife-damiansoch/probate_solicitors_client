import { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import Cookies from 'js-cookie';
import {EstateSummaryForApp} from "./EstateSummaryForApp.jsx";
import AutoResizingTextarea from "./AutoResizingTextarea.jsx";




const EstatesPart = ({
  addItem,
  application,
  handleListChange,
  editMode,
  submitChangesHandler,
  toggleEditMode,
  removeItem,
  triggerChandleChange,
  setTriggerChandleChange,
}) => {
  const currency_sign = Cookies.get('currency_sign');

  const [newEstate, setNewEstate] = useState({
    description: '',
    value: '',
  });

  const handleNewEstateChange = (e, field) => {
    setNewEstate({
      ...newEstate,
      [field]: e.target.value,
    });
  };

  const addEstate = () => {
    addItem('estates', newEstate);
    setNewEstate({
      description: '',
      value: '',
      lendable:true
    });
    setTriggerChandleChange(!triggerChandleChange);
  };

  const isEstateFormValid = newEstate.description && newEstate.value;

  const isAnyFieldFilled = Object.values(newEstate).some(
    (value) => value !== ''
  );

  const getFieldClassName = (field) => {
    return `form-control form-control-sm ${
      !newEstate[field] && isAnyFieldFilled ? 'border-1 border-danger' : ''
    }`;
  };
  useEffect(() => {
    if(application) {
      console.log(application.estates);
    }
  }, [application]);

  useEffect(() => {
    submitChangesHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerChandleChange]);

  return (
    <div className='card mt-3  mx-md-3 rounded border-0 '>
      <div className='card-header  rounded-top mt-3'>
        <h4 className='card-subtitle text-info-emphasis'>Estates</h4>
      </div>
      {(!application.estates || application.estates.length === 0) && (
        <div className='row mt-3'>
          <div className=' alert alert-danger col-auto mx-auto'>
            Please provide details for at least one estate.
          </div>
        </div>
      )}
      <div className='card-body p-0 p-md-3'>
        {application.estates.map((estate, index) => (
          <div
            key={index}
            className={`row my-2 py-2 rounded mx-1 d-flex align-items-center shadow ${estate.lendable === null ? "bg-danger-subtle" : ""}`}
          >
            <div className='col-md-8'>
              <label className='form-label col-12'>Description:</label>
              <div className='input-group input-group-sm shadow'>
                <AutoResizingTextarea
                  value={estate.description}
                  onChange={e =>
                    handleListChange(e, index, 'estates', 'description')
                  }
                  readOnly={!editMode[`estate_${index}_description`]}
                  className={
                    `form-control form-control-sm` +
                    (editMode[`estate_${index}_description`] ? ' bg-warning-subtle' : '')
                  }
                />
                <button
                  type='button'
                  className='btn btn-dark'
                  onClick={() => {
                    if (editMode[`estate_${index}_description`])
                      submitChangesHandler();
                    toggleEditMode(`estate_${index}_description`);
                  }}
                  disabled={application.approved || application.is_rejected}
                >
                  {editMode[`estate_${index}_description`] ? (
                    <FaSave size={20} color='red' />
                  ) : (
                    <FaEdit size={20} />
                  )}
                </button>
              </div>
            </div>
            <div className='col-md-3'>
              <label className='form-label col-12'>Value:</label>
              <div className='input-group input-group-sm shadow'>
                <input
                  type='text'
                  className={`form-control ${
                    editMode[`estate_${index}_value`] && ' bg-warning-subtle'
                  }`}
                  value={
                    editMode[`estate_${index}_value`]
                      ? estate.value
                      : `${currency_sign} ${estate.value}`
                  }
                  onChange={(e) =>
                    handleListChange(e, index, 'estates', 'value')
                  }
                  readOnly={!editMode[`estate_${index}_value`]}
                />
                <button
                  type='button'
                  className='btn btn-dark'
                  onClick={() => {
                    if (editMode[`estate_${index}_value`])
                      submitChangesHandler();
                    toggleEditMode(`estate_${index}_value`);
                  }}
                  disabled={application.approved || application.is_rejected}
                >
                  {editMode[`estate_${index}_value`] ? (
                    <FaSave size={20} color='red' />
                  ) : (
                    <FaEdit size={20} />
                  )}
                </button>
              </div>
            </div>
            <div className='col-md-1 text-end my-auto'>
              <button
                type='button'
                className='btn btn-sm btn-outline-danger mt-2 border-0 icon-shadow'
                onClick={() => removeItem('estates', index)}
                disabled={application.approved || application.is_rejected}
              >
                <FaTrash size={15} />
              </button>
            </div>
          </div>
        ))}
        {/* Add New Estate Form */}
        <hr />
        {!application.approved && !application.is_rejected && (
          <div className='row border border-3 border-warning rounded mx-1 pb-1 mx-md-5 shadow'>
            <div className='card-body px-2 px-md-1 mx-md-3'>
              <h4 className='card-subtitle text-warning-emphasis'>
                Add Estate
              </h4>
              <div className='row'>
                <div className='col-md-7'>
                  <label className='form-label col-12'>Description:</label>
                  <AutoResizingTextarea
                    value={newEstate.description}
                    onChange={e => handleNewEstateChange(e, 'description')}
                    readOnly={false}
                    className={`shadow ${getFieldClassName('description')}`}
                  />
                </div>
                <div className='col-md-3'>
                  <label className='form-label col-12'>Value:</label>
                  <input
                    type='number'
                    step='0.01'
                    min='0'
                    className={`shadow ${getFieldClassName('value')}`}
                    value={newEstate.value}
                    onChange={e => handleNewEstateChange(e, 'value')}
                    placeholder={currency_sign}
                  />
                </div>
                <div className='col-md-2 my-auto text-end'>
                  <button
                    type='button'
                    className='btn btn-sm btn-dark me-1 mt-4'
                    onClick={addEstate}
                    disabled={!isEstateFormValid}
                  >
                    <FaSave size={20} color={isEstateFormValid && 'red'} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <EstateSummaryForApp
          estates={application.estates}
          requestedAmount={application.amount}
          currency_sign={currency_sign}
        />
      </div>

    </div>
  );
};

export default EstatesPart;
