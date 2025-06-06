import { FaPlus, FaTrash } from 'react-icons/fa';

// --- SINGLE SOURCE OF TRUTH ---
export const ESTATE_DEFINITIONS = [
  {
    key: 'real_and_leasehold',
    label: 'Real and leasehold property',
    type: 'array',
    default: { address: '', county: '', nature: '', value: '', lendable: true },
    render: 'real', // Special rendering
  },
  {
    key: 'household_contents',
    label: 'Household contents (furniture, antiques, jewellery, paintings etc.)',
    type: 'single',
    default: { value: '', lendable: true },
    placeholder: 'Estimated value',
  },
  {
    key: 'cars_boats',
    label: 'Cars/boats',
    type: 'single',
    default: { value: '', lendable: true },
    placeholder: 'Estimated value',
  },
  {
    key: 'business_farming',
    label: 'Business assets: farming assets',
    type: 'single',
    default: { value: '', lendable: true },
    placeholder: 'Estimated value',
  },
  {
    key: 'business_other',
    label: 'Business assets: other business assets (goodwill, plant and equipment, stock-in-trade, book debts etc.)',
    type: 'single',
    default: { value: '', lendable: true },
    placeholder: 'Estimated value',
  },
  {
    key: 'unpaid_purchase_money',
    label: 'Unpaid purchase money of property contracted to be sold',
    type: 'single',
    default: { value: '', lendable: true },
    placeholder: 'Estimated value',
  },
  {
    key: 'financial_assets',
    label: 'Assets with financial institutions',
    type: 'array',
    default: { description: '', value: '', lendable: true },
    placeholder: 'Institution, account, details...',
    textarea: true,
  },
  {
    key: 'life_insurance',
    label: 'Proceeds of life insurance policies',
    type: 'array',
    default: { description: '', value: '', lendable: true },
    placeholder: 'Policy, institution, etc.',
    textarea: true,
  },
  {
    key: 'debts_owing',
    label: 'Debts owing to the deceased',
    type: 'array',
    default: { description: '', value: '', lendable: false },
    placeholder: 'Debtor name, details',
    textarea: true,
  },
  {
    key: 'securities_quoted',
    label: 'Stocks, shares and securities (Quoted)',
    type: 'array',
    default: { description: '', value: '', lendable: true },
    placeholder: 'Quoted description (e.g. Company, ISIN, # of shares)',
    textarea: true,
  },
  {
    key: 'securities_unquoted',
    label: 'Stocks, shares and securities (Unquoted)',
    type: 'array',
    default: { description: '', value: '', lendable: false },
    placeholder: 'Unquoted description (e.g. Private company, share class)',
    textarea: true,
  },
  {
    key: 'other_property',
    label: 'Any other property not already included',
    type: 'array',
    default: { description: '', value: '', lendable: true },
    placeholder: 'Description',
    textarea: true,
  },
  {
    key: 'irish_debts',
    label: 'Irish debts* owing by the deceased and funeral expenses payable in the State',
    type: 'array',
    default: { creditor: '', description: '', value: '' },
    irishDebt: true, // special render
  },
];

export const defaultEstates = ESTATE_DEFINITIONS.reduce((acc, item) => {
  acc[item.key] = item.type === 'array' ? [ { ...item.default } ] : { ...item.default };
  return acc;
}, {});

export const NATURE_CHOICES = ['Land', 'Building', 'Mixed', 'Other'];
export const toNumber = val => isNaN(parseFloat(val)) ? 0 : parseFloat(val);

// --- Main Estates Part Component ---
export default function EstatesPart({ estates, setFormData, currency_sign }) {
  // Generic field updaters
  const handleArrayChange = (field, idx, subfield, value) => {
    const updated = [...estates[field]];
    updated[idx][subfield] = value;
    setFormData(prev => ({ ...prev, estates: { ...prev.estates, [field]: updated }}));
  };
  const addArrayItem = (field, def) => {
    setFormData(prev => ({
      ...prev,
      estates: { ...prev.estates, [field]: [ ...prev.estates[field], { ...def } ] },
    }));
  };
  const removeArrayItem = (field, idx) => {
    const updated = [...estates[field]];
    updated.splice(idx, 1);
    setFormData(prev => ({ ...prev, estates: { ...prev.estates, [field]: updated }}));
  };

  // For "single" fields
  const handleSingleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      estates: { ...prev.estates, [key]: { ...prev.estates[key], value } }
    }));
  };

  return (
    <div className='mb-3'>
      <h5 className='my-2'>Estates (per Inland Revenue Affidavit)</h5>
      {ESTATE_DEFINITIONS.map(def => {
        if (def.render === 'real') {
          // Special rendering for real_and_leasehold (with validation, add btn at end)
          return (
            <div key={def.key}>
              {estates.real_and_leasehold.map((item, idx) => {
                // Validation for empty fields
                const addressInvalid = item.address.trim() === '';
                const countyInvalid = item.county.trim() === '';
                const natureInvalid = item.nature.trim() === '';
                const valueInvalid = !item.value || item.value === '';

                return (
                  <div key={idx} className='card mb-3 p-3 border-primary'>
                    <h6 className='mb-3 text-primary'>{def.label} #{idx + 1}</h6>
                    <div className='row'>
                      <div className='col-md-4 mb-2'>
                        <textarea
                          className={`form-control form-control-sm${addressInvalid ? ' is-invalid' : ''}`}
                          placeholder='Address (townland/street & number)'
                          value={item.address}
                          onChange={e => handleArrayChange('real_and_leasehold', idx, 'address', e.target.value)}
                          rows={2}
                          required
                        />
                        {addressInvalid && (
                          <div className="invalid-feedback d-block">
                            Address is required.
                          </div>
                        )}
                      </div>
                      <div className='col-md-2 mb-2'>
                        <input
                          type='text'
                          className={`form-control form-control-sm${countyInvalid ? ' is-invalid' : ''}`}
                          placeholder='County'
                          value={item.county}
                          onChange={e => handleArrayChange('real_and_leasehold', idx, 'county', e.target.value)}
                          required
                        />
                        {countyInvalid && (
                          <div className="invalid-feedback d-block">
                            County is required.
                          </div>
                        )}
                      </div>
                      <div className='col-md-2 mb-2'>
                        <select
                          className={`form-control form-control-sm${natureInvalid ? ' is-invalid' : ''}`}
                          value={item.nature}
                          onChange={e => handleArrayChange('real_and_leasehold', idx, 'nature', e.target.value)}
                          required
                        >
                          <option value=''>Select nature...</option>
                          {NATURE_CHOICES.map(choice => (
                            <option key={choice} value={choice}>{choice}</option>
                          ))}
                        </select>
                        {natureInvalid && (
                          <div className="invalid-feedback d-block">
                            Nature is required.
                          </div>
                        )}
                      </div>
                      <div className='col-md-2 mb-2'>
                        <input
                          type='number'
                          min='0'
                          step='0.01'
                          className={`form-control form-control-sm${valueInvalid ? ' is-invalid' : ''}`}
                          placeholder={currency_sign}
                          value={item.value}
                          onChange={e => handleArrayChange('real_and_leasehold', idx, 'value', e.target.value)}
                          required
                        />
                        {valueInvalid && (
                          <div className="invalid-feedback d-block">
                            Value is required.
                          </div>
                        )}
                      </div>
                      <div className='col-md-2 mb-2 text-end'>
                        <button
                          type='button'
                          className='btn btn-danger btn-sm'
                          onClick={() => removeArrayItem('real_and_leasehold', idx)}
                          disabled={estates.real_and_leasehold.length === 1}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* ADD PROPERTY BUTTON */}
              <button
                type='button'
                className='btn btn-primary btn-sm mb-3'
                onClick={() => addArrayItem('real_and_leasehold', def.default)}
              >
                <FaPlus /> Add Property
              </button>
            </div>
          );
        }
        if (def.type === 'single') {
          return (
            <div className='card mb-3 p-3' key={def.key}>
              <label className='form-label'>{def.label}</label>
              <input
                type='number'
                min='0'
                step='0.01'
                className='form-control form-control-sm'
                value={estates[def.key].value}
                onChange={e => handleSingleChange(def.key, e.target.value)}
                placeholder={def.placeholder || currency_sign}
              />
            </div>
          );
        }
        if (def.irishDebt) {
          // Special block for irish debts
          return (
            <div className='mb-3' key={def.key}>
              <div className='card p-3'>
                <label className='form-label fw-bold'>{def.label}</label>
                {estates[def.key].map((item, idx) => {
                  const descriptionMissing = item.description.trim() === '' && item.value.trim() !== '';
                  const valueMissing = item.value.trim() === '' && item.description.trim() !== '';
                  return (
                    <div key={idx} className='row mb-1'>
                      <div className='col-md-3 mb-2'>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          placeholder='Creditor'
                          value={item.creditor}
                          onChange={e => handleArrayChange(def.key, idx, 'creditor', e.target.value)}
                        />
                      </div>
                      <div className='col-md-6 mb-2'>
                        <textarea
                          className={`form-control form-control-sm${descriptionMissing ? ' is-invalid' : ''}`}
                          placeholder='Description of debt'
                          value={item.description}
                          onChange={e => handleArrayChange(def.key, idx, 'description', e.target.value)}
                          rows={2}
                        />
                        {descriptionMissing && (
                          <div className="invalid-feedback d-block">
                            Description is required when value is entered.
                          </div>
                        )}
                      </div>
                      <div className='col-md-2 mb-2'>
                        <input
                          type='number'
                          min='0'
                          step='0.01'
                          className={`form-control form-control-sm${valueMissing ? ' is-invalid' : ''}`}
                          placeholder={currency_sign}
                          value={item.value}
                          onChange={e => handleArrayChange(def.key, idx, 'value', e.target.value)}
                        />
                        {valueMissing && (
                          <div className="invalid-feedback d-block">
                            Value is required when description is entered.
                          </div>
                        )}
                      </div>
                      <div className='col-md-1 mb-2 text-end'>
                        <button
                          type='button'
                          className='btn btn-danger btn-sm'
                          onClick={() => removeArrayItem(def.key, idx)}
                          disabled={estates[def.key].length === 1}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  type='button'
                  className='btn btn-primary btn-sm mb-2'
                  onClick={() => addArrayItem(def.key, def.default)}
                >
                  <FaPlus /> Add Debt/Funeral Expense
                </button>
                <div className="form-text">
                  *Debts owing to persons resident in the State, or to persons resident outside the State, but contracted to be paid in the State, or charged on property situate within the State.
                </div>
              </div>
            </div>
          );
        }
        if (def.type === 'array') {
          return (
            <div className='mb-3' key={def.key}>
              <div className='card p-3'>
                <label className='form-label'>{def.label}</label>
                {estates[def.key].map((item, idx) => {
                  const descriptionMissing = item.description?.trim() === '' && item.value?.trim() !== '';
                  const valueMissing = item.value?.trim() === '' && item.description?.trim() !== '';
                  return (
                    <div key={idx} className='row mb-1'>
                      <div className='col-md-8 mb-2'>
                        {def.textarea ? (
                          <textarea
                            className={`form-control form-control-sm${descriptionMissing ? ' is-invalid' : ''}`}
                            placeholder={def.placeholder}
                            value={item.description}
                            onChange={e => handleArrayChange(def.key, idx, 'description', e.target.value)}
                            rows={2}
                            required={item.value?.trim() !== ''}
                          />
                        ) : (
                          <input
                            type='text'
                            className={`form-control form-control-sm${descriptionMissing ? ' is-invalid' : ''}`}
                            placeholder={def.placeholder}
                            value={item.description}
                            onChange={e => handleArrayChange(def.key, idx, 'description', e.target.value)}
                            required={item.value?.trim() !== ''}
                          />
                        )}
                        {descriptionMissing && (
                          <div className="invalid-feedback d-block">
                            Description is required when value is entered.
                          </div>
                        )}
                      </div>
                      <div className='col-md-3 mb-2'>
                        <input
                          type='number'
                          min='0'
                          step='0.01'
                          className={`form-control form-control-sm${valueMissing ? ' is-invalid' : ''}`}
                          placeholder={currency_sign}
                          value={item.value}
                          onChange={e => handleArrayChange(def.key, idx, 'value', e.target.value)}
                          required={item.description?.trim() !== ''}
                        />
                        {valueMissing && (
                          <div className="invalid-feedback d-block">
                            Value is required when description is entered.
                          </div>
                        )}
                      </div>
                      <div className='col-md-1 mb-2 text-end'>
                        <button
                          type='button'
                          className='btn btn-danger btn-sm'
                          onClick={() => removeArrayItem(def.key, idx)}
                          disabled={estates[def.key].length === 1}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  type='button'
                  className='btn btn-primary btn-sm mb-2'
                  onClick={() => addArrayItem(def.key, def.default)}
                >
                  <FaPlus /> Add Another
                </button>
              </div>
            </div>
          );
        }
        return null;
      })}
      <hr />
    </div>
  );
}
