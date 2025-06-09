import Cookies from 'js-cookie';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import { postData } from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';

import ApplicantsPart from './FormParts/ApplicantsPart';
import ApplicationPart from './FormParts/ApplicationPart';
import EstatesPart, {
  ESTATE_DEFINITIONS,
  defaultEstates,
  toNumber,
} from './FormParts/EstatesPart';
import EstateSummarySticky from './FormParts/EstateSummarySticky';



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
    applicants: [
      { title: 'Mr', first_name: '', last_name: '', pps_number: '' },
    ],
    estates: JSON.parse(JSON.stringify(defaultEstates)),
    was_will_prepared_by_solicitor: null,
  });

  const currency_sign = Cookies.get('currency_sign');
const idNumberArray = JSON.parse(Cookies.get('id_number'));

  // --- Calculation helpers
  const sumEstate = (formData, filterFn) => {
    let total = 0;
    ESTATE_DEFINITIONS.forEach((def) => {
      if (def.key === 'irish_debts') return; // Exclude here
      if (def.type === 'array') {
        formData.estates[def.key].forEach((item) => {
          if (filterFn(item)) total += toNumber(item.value);
        });
      } else if (def.type === 'single') {
        if (filterFn(formData.estates[def.key]))
          total += toNumber(formData.estates[def.key].value);
      }
    });
    return total;
  };
  const sumIrishDebts = (formData) =>
    formData.estates.irish_debts.reduce(
      (sum, item) => sum + toNumber(item.value),
      0
    );

  const netIrishEstate =
    sumEstate(formData, () => true) - sumIrishDebts(formData);
  const lendableIrishEstate =
    sumEstate(formData, (item) => item.lendable !== false) -
    sumIrishDebts(formData);

  // --- Compile for backend (schema-driven)
  const compileEstatesForBackend = (estates) => {
    const items = [];
    ESTATE_DEFINITIONS.forEach((def) => {
      if (def.key === 'real_and_leasehold') {
        estates.real_and_leasehold.forEach((item) => {
          if (item.address || item.county || item.nature || item.value) {
            items.push({
              description: `${def.label}: ${item.address}${
                item.county ? ', ' + item.county : ''
              }${item.nature ? ', ' + item.nature : ''}`,
              value: item.value || '',
              lendable: item.lendable,
            });
          }
        });
      } else if (def.key === 'irish_debts') {
        estates.irish_debts.forEach((item) => {
          if (item.creditor || item.description || item.value) {
            items.push({
              description: `Irish debts/funeral expenses: Creditor: ${item.creditor} - ${item.description}`,
              value: item.value,
            });
          }
        });
      } else if (def.type === 'single') {
        if (estates[def.key] && estates[def.key].value) {
          items.push({
            description: def.label,
            value: estates[def.key].value,
            lendable: estates[def.key].lendable,
          });
        }
      } else if (def.type === 'array') {
        estates[def.key].forEach((item) => {
          if (item.description || item.value) {
            items.push({
              description:
                def.label + (item.description ? ': ' + item.description : ''),
              value: item.value,
              lendable: item.lendable,
            });
          }
        });
      }
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
    <div className='card mt-5 ' style={{ marginBottom: '200px' }}>
      <div className='card-header text-center'>
        <div className='card-title'>
          <h1>Create New Application</h1>
        </div>
      </div>
      <div className='card-body'>
        <form onSubmit={submitHandler}>
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
              <div
                className={`alert text-center ${
                  isError ? ' alert-danger' : 'alert-success'
                }`}
                role='alert'
              >
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
