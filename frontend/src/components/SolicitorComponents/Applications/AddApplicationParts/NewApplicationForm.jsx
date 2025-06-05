import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import { postData } from '../../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';

import ApplicationPart from './FormParts/ApplicationPart';
import ApplicantsPart from './FormParts/ApplicantsPart';
import EstatesPart, { defaultEstates, toNumber, estateSingleFields } from './FormParts/EstatesPart';
import EstateSummarySticky from './FormParts/EstateSummarySticky';

const currency_sign = Cookies.get('currency_sign');
const idNumberArray = JSON.parse(Cookies.get('id_number'));

export default function NewApplicationForm() {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token.access);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    term: 12,
    deceased: { first_name: '', last_name: '' },
    dispute: { details: '' },
    applicants: [{ title: 'Mr', first_name: '', last_name: '', pps_number: '' }],
    estates: JSON.parse(JSON.stringify(defaultEstates)),
  });

  // ---- Estate calculation helpers
const sumEstate = (formData, filterFn) => {
  let total = 0;
  total += formData.estates.real_and_leasehold.reduce((sum, item) =>
    filterFn(item) ? sum + toNumber(item.value) : sum, 0);
  ['household_contents', 'cars_boats', 'business_farming', 'business_other', 'unpaid_purchase_money'].forEach(key => {
    if (filterFn(formData.estates[key])) total += toNumber(formData.estates[key].value);
  });
  // ---- Add 'debts_owing' field here:
  ['financial_assets', 'life_insurance', 'debts_owing', 'securities_quoted', 'securities_unquoted', 'other_property'].forEach(key => {
    formData.estates[key].forEach(item => { if (filterFn(item)) total += toNumber(item.value); });
  });
  return total;
};
const sumIrishDebts = (formData) =>
  formData.estates.irish_debts.reduce((sum, item) => sum + toNumber(item.value), 0);

const netIrishEstate = sumEstate(formData, () => true) - sumIrishDebts(formData);
const lendableIrishEstate = sumEstate(formData, item => item.lendable !== false) - sumIrishDebts(formData);

// ---- Estates: Compile for backend
const compileEstatesForBackend = (estates) => {
  const items = [];
  estates.real_and_leasehold.forEach((item) => {
    if (item.address || item.county || item.nature || item.value) {
      items.push({
        description: `Real and leasehold property: ${item.address}${item.county ? ', ' + item.county : ''}${item.nature ? ', ' + item.nature : ''}`,
        value: item.value || '',
        lendable: item.lendable,
      });
    }
  });
  estateSingleFields.forEach(f => {
    if (estates[f.key] && estates[f.key].value) {
      items.push({ description: f.label, value: estates[f.key].value, lendable: estates[f.key].lendable });
    }
  });
  estates.financial_assets.forEach((item) => {
    if (item.description || item.value)
      items.push({ description: 'Assets with financial institutions: ' + item.description, value: item.value, lendable: item.lendable });
  });
  estates.life_insurance.forEach((item) => {
    if (item.description || item.value)
      items.push({ description: 'Proceeds of life insurance policies: ' + item.description, value: item.value, lendable: item.lendable });
  });
  // ---- ADD lendable here for debts_owing:
  estates.debts_owing.forEach((item) => {
    if (item.description || item.value)
      items.push({ description: 'Debts owing to the deceased: ' + item.description, value: item.value, lendable: item.lendable });
  });
  estates.securities_quoted.forEach((item) => {
    if (item.description || item.value)
      items.push({ description: 'Stocks, shares and securities (Quoted): ' + item.description, value: item.value, lendable: item.lendable });
  });
  estates.securities_unquoted.forEach((item) => {
    if (item.description || item.value)
      items.push({ description: 'Stocks, shares and securities (Unquoted): ' + item.description, value: item.value, lendable: item.lendable });
  });
  if (estates.unpaid_purchase_money && estates.unpaid_purchase_money.value)
    items.push({ description: 'Unpaid purchase money of property contracted to be sold', value: estates.unpaid_purchase_money.value, lendable: estates.unpaid_purchase_money.lendable });
  estates.other_property.forEach((item) => {
    if (item.description || item.value)
      items.push({ description: 'Other property not already included: ' + item.description, value: item.value, lendable: item.lendable });
  });
  estates.irish_debts.forEach((item) => {
    if (item.creditor || item.description || item.value)
      items.push({
        description: `Irish debts/funeral expenses: Creditor: ${item.creditor} - ${item.description}`,
        value: item.value
      });
  });
  return items;
};


  // ---- Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setLoading(true);

    const data = {
      ...formData,
      estates: compileEstatesForBackend(formData.estates),
    };
    if (data.dispute.details.trim() === '') {
      data.dispute.details = 'No dispute';
    }
    console.log('data:', JSON.stringify(data, null, 2));
    try {
      const endpoint = `/api/applications/solicitor_applications/`;
      const response = await postData(token, endpoint, data);
      if (response.status === 201) {
        setIsError(false);
        setMessage([{ value: response.statusText }]);
        const new_app_id = response.data.id;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        navigate(`/applications/${new_app_id}`);
      } else {
        setIsError(true);
        setMessage(response.data);
        setLoading(false);
      }
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        setMessage(renderErrors(error.response.data));
      } else {
        setMessage(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className='card mt-5 ' style={{ marginBottom: "200px" }}>
      <div className='card-header text-center'>
        <div className='card-title'><h1>Create New Application</h1></div>
      </div>
      <div className='card-body'>
        <form onSubmit={submitHandler} >
          <ApplicationPart formData={formData} setFormData={setFormData} />
          <ApplicantsPart
            applicants={formData.applicants}
            setFormData={setFormData}
            idNumberArray={idNumberArray}
          />
          <EstatesPart
            estates={formData.estates}
            setFormData={setFormData}
            currency_sign={currency_sign}
          />
          <div className='row'>
            <button
              type='submit'
              className='btn btn-info my-2'
              disabled={
                loading ||
                lendableIrishEstate <= 0 ||
                toNumber(formData.amount) <= 0 ||
                toNumber(formData.amount) > lendableIrishEstate * 0.5
              }
            >
              {loading ? (
                <LoadingComponent message='Adding application...' />
              ) : (
                'Create Application'
              )}
            </button>
            {message && (
              <div className={`alert text-center ${isError ? ' alert-danger' : 'alert-success'}`} role='alert'>
                {renderErrors(message)}
              </div>
            )}
          </div>
        </form>
        <EstateSummarySticky
          netIrishEstate={netIrishEstate}
          lendableIrishEstate={lendableIrishEstate}
          formData={formData}
          currency_sign={currency_sign}
        />
      </div>
    </div>
  );
}
