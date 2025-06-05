import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

// --- Defaults & Constants ---
export const defaultEstates = {
  real_and_leasehold: [{ address: '', county: '', nature: '', value: '', lendable: true }],
  household_contents: { value: '', lendable: true },
  cars_boats: { value: '', lendable: true },
  business_farming: { value: '', lendable: true },
  business_other: { value: '', lendable: true },
  financial_assets: [{ description: '', value: '', lendable: true }],
  life_insurance: [{ description: '', value: '', lendable: true }],
  debts_owing: [{ description: '', value: '' }],
  securities_quoted: [{ description: '', value: '', lendable: true }],
  securities_unquoted: [{ description: '', value: '', lendable: false }],
  unpaid_purchase_money: { value: '', lendable: true },
  other_property: [{ description: '', value: '', lendable: true }],
  irish_debts: [{ creditor: '', description: '', value: '' }],
};

export const estateSingleFields = [
  {
    key: 'household_contents',
    label: 'Household contents (furniture, antiques, jewellery, paintings etc.)',
    placeholder: 'Estimated value',
  },
  {
    key: 'cars_boats',
    label: 'Cars/boats',
    placeholder: 'Estimated value',
  },
  {
    key: 'business_farming',
    label: 'Business assets: farming assets',
    placeholder: 'Estimated value',
  },
  {
    key: 'business_other',
    label: 'Business assets: other business assets (goodwill, plant and equipment, stock-in-trade, book debts etc.)',
    placeholder: 'Estimated value',
  },
  {
    key: 'unpaid_purchase_money',
    label: 'Unpaid purchase money of property contracted to be sold',
    placeholder: 'Estimated value',
  },
];

export const NATURE_CHOICES = ['Land', 'Building', 'Mixed', 'Other'];
export const toNumber = val => isNaN(parseFloat(val)) ? 0 : parseFloat(val);

// --- Main Estates Part Component ---
export default function EstatesPart({ estates, setFormData, currency_sign }) {
  // --- Real and leasehold property helpers
  const handleRealAndLeaseholdChange = (idx, subfield, value) => {
    const updated = [...estates.real_and_leasehold];
    updated[idx][subfield] = value;
    setFormData(prev => ({
      ...prev,
      estates: { ...prev.estates, real_and_leasehold: updated },
    }));
  };
  const addRealAndLeasehold = () => {
    setFormData(prev => ({
      ...prev,
      estates: {
        ...prev.estates,
        real_and_leasehold: [
          ...prev.estates.real_and_leasehold,
          { address: '', county: '', nature: '', value: '', lendable: true },
        ],
      },
    }));
  };
  const removeRealAndLeasehold = idx => {
    const updated = [...estates.real_and_leasehold];
    updated.splice(idx, 1);
    setFormData(prev => ({
      ...prev,
      estates: { ...prev.estates, real_and_leasehold: updated },
    }));
  };

  // --- Estates: Generic array field helpers
  const handleEstateArrayChange = (field, idx, subfield, value) => {
    const updated = [...estates[field]];
    updated[idx][subfield] = value;
    setFormData(prev => ({
      ...prev,
      estates: { ...prev.estates, [field]: updated },
    }));
  };
  const addEstateArrayItem = (field, def = { description: '', value: '', lendable: true }) => {
    setFormData(prev => ({
      ...prev,
      estates: { ...prev.estates, [field]: [...prev.estates[field], { ...def }] },
    }));
  };
  const removeEstateArrayItem = (field, idx) => {
    const updated = [...estates[field]];
    updated.splice(idx, 1);
    setFormData(prev => ({
      ...prev,
      estates: { ...prev.estates, [field]: updated },
    }));
  };

  // --- Irish debts/funeral expenses helpers
  const handleIrishDebtChange = (idx, field, value) => {
    const updated = [...estates.irish_debts];
    updated[idx][field] = value;
    setFormData(prev => ({
      ...prev,
      estates: { ...prev.estates, irish_debts: updated },
    }));
  };
  const addIrishDebt = () => {
    setFormData(prev => ({
      ...prev,
      estates: {
        ...prev.estates,
        irish_debts: [
          ...prev.estates.irish_debts,
          { creditor: '', description: '', value: '' },
        ],
      },
    }));
  };
  const removeIrishDebt = idx => {
    const updated = [...estates.irish_debts];
    updated.splice(idx, 1);
    setFormData(prev => ({
      ...prev,
      estates: { ...prev.estates, irish_debts: updated },
    }));
  };

  return (
    <div className='mb-3'>
      <h5 className='my-2'>Estates (per Inland Revenue Affidavit)</h5>
      {/* Real and Leasehold */}
      {estates.real_and_leasehold.map((item, idx) => (
        <div key={idx} className='card mb-3 p-3 border-primary'>
          <h6 className='mb-3 text-primary'>Real and Leasehold Property #{idx + 1}</h6>
          <div className='row'>
            <div className='col-md-4 mb-2'>
              <textarea
                className='form-control form-control-sm'
                placeholder='Address (townland/street & number)'
                value={item.address}
                onChange={e => handleRealAndLeaseholdChange(idx, 'address', e.target.value)}
                rows={2}
                required
              />
            </div>
            <div className='col-md-2 mb-2'>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='County'
                value={item.county}
                onChange={e => handleRealAndLeaseholdChange(idx, 'county', e.target.value)}
                required
              />
            </div>
            <div className='col-md-2 mb-2'>
              <select
                className='form-control form-control-sm'
                value={item.nature}
                onChange={e => handleRealAndLeaseholdChange(idx, 'nature', e.target.value)}
                required
              >
                <option value=''>Nature</option>
                {NATURE_CHOICES.map(choice => (
                  <option key={choice} value={choice}>{choice}</option>
                ))}
              </select>
            </div>
            <div className='col-md-2 mb-2'>
              <input
                type='number'
                min='0'
                step='0.01'
                className='form-control form-control-sm'
                placeholder={currency_sign}
                value={item.value}
                onChange={e => handleRealAndLeaseholdChange(idx, 'value', e.target.value)}
                required
              />
            </div>
            <div className='col-md-2 mb-2 text-end'>
              <button
                type='button'
                className='btn btn-danger btn-sm'
                onClick={() => removeRealAndLeasehold(idx)}
                disabled={estates.real_and_leasehold.length === 1}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
      <button type='button' className='btn btn-primary btn-sm mb-3' onClick={addRealAndLeasehold}>
        <FaPlus /> Add Property
      </button>

      {/* Single value fields */}
      {estateSingleFields.map(f =>
        <SingleEstateField key={f.key} field={f} estates={estates} setFormData={setFormData} currency_sign={currency_sign} />
      )}

      {/* Array fields */}
      <EstateArrayField
        label='Assets with financial institutions (bank, building societies, insurance, post office, credit union, etc.)'
        field='financial_assets'
        estates={estates}
        handleChange={handleEstateArrayChange}
        addItem={addEstateArrayItem}
        removeItem={removeEstateArrayItem}
        placeholder='Institution, account, details...'
        lendable={true}
        currency_sign={currency_sign}
      />
      <EstateArrayField
        label='Proceeds of life insurance policies'
        field='life_insurance'
        estates={estates}
        handleChange={handleEstateArrayChange}
        addItem={addEstateArrayItem}
        removeItem={removeEstateArrayItem}
        placeholder='Policy, institution, etc.'
        lendable={true}
        currency_sign={currency_sign}
      />
      <EstateArrayField
        label='Debts owing to the deceased'
        field='debts_owing'
        estates={estates}
        handleChange={handleEstateArrayChange}
        addItem={addEstateArrayItem}
        removeItem={removeEstateArrayItem}
        placeholder='Debtor name, details'
        lendable={false}
        currency_sign={currency_sign}
      />
      <EstateArrayField
        label='Stocks, shares and securities (Quoted)'
        field='securities_quoted'
        estates={estates}
        handleChange={handleEstateArrayChange}
        addItem={addEstateArrayItem}
        removeItem={removeEstateArrayItem}
        placeholder='Quoted description (e.g. Company, ISIN, # of shares)'
        lendable={true}
        currency_sign={currency_sign}
      />
      <EstateArrayField
        label='Stocks, shares and securities (Unquoted)'
        field='securities_unquoted'
        estates={estates}
        handleChange={handleEstateArrayChange}
        addItem={addEstateArrayItem}
        removeItem={removeEstateArrayItem}
        placeholder='Unquoted description (e.g. Private company, share class)'
        lendable={false}
        currency_sign={currency_sign}
      />
      <EstateArrayField
        label='Any other property not already included'
        field='other_property'
        estates={estates}
        handleChange={handleEstateArrayChange}
        addItem={addEstateArrayItem}
        removeItem={removeEstateArrayItem}
        placeholder='Description'
        lendable={true}
        currency_sign={currency_sign}
      />

      {/* Irish Debts */}
      <div className='mb-3'>
        <div className='card p-3'>
          <label className='form-label fw-bold'>
            Irish debts* owing by the deceased and funeral expenses payable in the State
          </label>
          {estates.irish_debts.map((item, idx) => {
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
                    onChange={e => handleIrishDebtChange(idx, 'creditor', e.target.value)}
                  />
                </div>
                <div className='col-md-6 mb-2'>
                  <textarea
                    className={`form-control form-control-sm${descriptionMissing ? ' is-invalid' : ''}`}
                    placeholder='Description of debt'
                    value={item.description}
                    onChange={e => handleIrishDebtChange(idx, 'description', e.target.value)}
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
                    onChange={e => handleIrishDebtChange(idx, 'value', e.target.value)}
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
                    onClick={() => removeIrishDebt(idx)}
                    disabled={estates.irish_debts.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
          <button type='button' className='btn btn-primary btn-sm mb-2' onClick={addIrishDebt}>
            <FaPlus /> Add Debt/Funeral Expense
          </button>
          <div className="form-text">
            *Debts owing to persons resident in the State, or to persons resident outside the State, but contracted to be paid in the State, or charged on property situate within the State.
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}

// ---- Reusable supporting components ----
export function SingleEstateField({ field, estates, setFormData, currency_sign }) {
  return (
    <div className='card mb-3 p-3'>
      <label className='form-label'>{field.label}</label>
      <input
        type='number'
        min='0'
        step='0.01'
        className='form-control form-control-sm'
        value={estates[field.key].value}
        onChange={e =>
          setFormData(prev => ({
            ...prev,
            estates: {
              ...prev.estates,
              [field.key]: { ...prev.estates[field.key], value: e.target.value }
            }
          }))
        }
        placeholder={field.placeholder || currency_sign}
      />
    </div>
  );
}

export function EstateArrayField({
  label, field, estates, handleChange, addItem, removeItem, placeholder, lendable = true, currency_sign
}) {
  // Fields where description should be a textarea
  const textareaFields = [
    'financial_assets',
    'life_insurance',
    'debts_owing',
    'securities_quoted',
    'securities_unquoted',
    'other_property'
  ];

  return (
    <div className='mb-3'>
      <div className='card p-3'>
        <label className='form-label'>{label}</label>
        {estates[field].map((item, idx) => {
          const descriptionMissing = item.description.trim() === '' && item.value.trim() !== '';
          const valueMissing = item.value.trim() === '' && item.description.trim() !== '';

          return (
            <div key={idx} className='row mb-1'>
              <div className='col-md-8 mb-2'>
                {textareaFields.includes(field) ? (
                  <textarea
                    className={`form-control form-control-sm${descriptionMissing ? ' is-invalid' : ''}`}
                    placeholder={placeholder || 'Description'}
                    value={item.description}
                    onChange={e => handleChange(field, idx, 'description', e.target.value)}
                    rows={2}
                    required={item.value.trim() !== ''}
                  />
                ) : (
                  <input
                    type='text'
                    className={`form-control form-control-sm${descriptionMissing ? ' is-invalid' : ''}`}
                    placeholder={placeholder || 'Description'}
                    value={item.description}
                    onChange={e => handleChange(field, idx, 'description', e.target.value)}
                    required={item.value.trim() !== ''}
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
                  onChange={e => handleChange(field, idx, 'value', e.target.value)}
                  required={item.description.trim() !== ''}
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
                  onClick={() => removeItem(field, idx)}
                  disabled={estates[field].length === 1}
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
          onClick={() => addItem(field, { description: '', value: '', lendable })}
        >
          <FaPlus /> Add Another
        </button>
      </div>
    </div>
  );
}
