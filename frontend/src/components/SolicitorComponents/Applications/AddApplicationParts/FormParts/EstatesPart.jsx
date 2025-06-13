import { ESTATE_DEFINITIONS } from './EstatePartParts/estateConstants';
import EstateFieldDebtsOwing from './EstatePartParts/EstateFieldDebtsOwing';
import EstateFieldFinancialAssets from './EstatePartParts/EstateFieldFinancialAssets';
import EstateFieldIrishDebts from './EstatePartParts/EstateFieldIrishDebts';
import EstateFieldLifeInsurance from './EstatePartParts/EstateFieldLifeInsurance';
import EstateFieldOtherProperty from './EstatePartParts/EstateFieldOtherProperty';
import EstateFieldRealAndLeasehold from './EstatePartParts/EstateFieldRealAndLeasehold';
import EstateFieldSecuritiesQuoted from './EstatePartParts/EstateFieldSecuritiesQuoted';
import EstateFieldSecuritiesUnquoted from './EstatePartParts/EstateFieldSecuritiesUnquoted';
import EstateFieldSingle from './EstatePartParts/EstateFieldSingle';

export const toNumber = (val) => (isNaN(parseFloat(val)) ? 0 : parseFloat(val));

export default function EstatesPart({ estates, setFormData, currency_sign }) {
  return (
    <div className='mb-3'>
      <h5 className='my-2'>Estates (per Inland Revenue Affidavit)</h5>
      {ESTATE_DEFINITIONS.map((def) => {
        if (def.render === 'real') {
          return (
            <EstateFieldRealAndLeasehold
              key={def.key}
              estates={estates}
              setFormData={setFormData}
              currency_sign={currency_sign}
              def={def}
            />
          );
        }
        if (def.type === 'single') {
          return (
            <EstateFieldSingle
              key={def.key}
              estates={estates}
              setFormData={setFormData}
              currency_sign={currency_sign}
              def={def}
            />
          );
        }
        if (def.key === 'financial_assets') {
          return (
            <EstateFieldFinancialAssets
              key={def.key}
              estates={estates}
              setFormData={setFormData}
              currency_sign={currency_sign}
              def={def}
            />
          );
        }
        if (def.key === 'life_insurance') {
          return (
            <EstateFieldLifeInsurance
              key={def.key}
              estates={estates}
              setFormData={setFormData}
              currency_sign={currency_sign}
              def={def}
            />
          );
        }
        if (def.key === 'debts_owing') {
          return (
            <EstateFieldDebtsOwing
              key={def.key}
              estates={estates}
              setFormData={setFormData}
              currency_sign={currency_sign}
              def={def}
            />
          );
        }
        if (def.key === 'securities_quoted') {
          return (
            <EstateFieldSecuritiesQuoted
              key={def.key}
              estates={estates}
              setFormData={setFormData}
              currency_sign={currency_sign}
              def={def}
            />
          );
        }
        if (def.key === 'securities_unquoted') {
          return (
            <EstateFieldSecuritiesUnquoted
              key={def.key}
              estates={estates}
              setFormData={setFormData}
              currency_sign={currency_sign}
              def={def}
            />
          );
        }
        if (def.key === 'other_property') {
          return (
            <EstateFieldOtherProperty
              key={def.key}
              estates={estates}
              setFormData={setFormData}
              currency_sign={currency_sign}
              def={def}
            />
          );
        }
        if (def.key === 'irish_debts') {
          return (
            <EstateFieldIrishDebts
              key={def.key}
              estates={estates}
              setFormData={setFormData}
              currency_sign={currency_sign}
              def={def}
            />
          );
        }
        return null;
      })}
      <hr />
    </div>
  );
}
