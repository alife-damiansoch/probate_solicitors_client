
import { FaTrash, FaSave } from 'react-icons/fa';
import Cookies from 'js-cookie';
import {
  deleteData,
  postData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import {useState} from "react";

const ExpensesComponent = ({
  application,
  applicationId,
  existingExpenses,
}) => {
  const [expenses, setExpenses] = useState(existingExpenses);
  const [newExpense, setNewExpense] = useState({ description: '', value: '' });
  const [errorMessage, setErrorMessage] = useState('');

  let tokenObj = Cookies.get('auth_token');
  const currency_sign = Cookies.get('currency_sign');
  tokenObj = tokenObj ? JSON.parse(tokenObj) : null;
  const access = tokenObj ? tokenObj.access : null;

  const handleNewExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const addNewExpense = async (e) => {
    e.preventDefault();
    try {
      if (access) {
        const endpoint = `/api/applications/expenses/`;
        const response = await postData(access, endpoint, {
          ...newExpense,
          application: applicationId,
        });
        setExpenses((prevExpenses) => [...prevExpenses, response.data]);
        setNewExpense({ description: '', value: '' });
      } else {
        console.log('No access token detected');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      setErrorMessage('Failed to add expense');
    }
  };

  const removeExpense = async (expenseId) => {
    try {
      const endpoint = `/api/applications/expenses/${expenseId}/`;
      await deleteData(endpoint);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );
    } catch (error) {
      console.error('Error removing expense:', error);
      setErrorMessage('Failed to remove expense');
    }
  };

  const isFormValid = newExpense.description !== '' && newExpense.value !== '';

  const isAnyFieldFilled = Object.values(newExpense).some(
    (value) => value !== ''
  );

  const getFieldClassName = (field) => {
    return `form-control form-control-sm ${
      !newExpense[field] && isAnyFieldFilled ? 'border-1 border-danger' : ''
    }`;
  };

  return (
    <div className='card rounded border-0 shadow mx-3 my-3'>
      <div className='card-header mb-2  rounded-top py-3'>
        <h4 className='card-subtitle text-info-emphasis'>Expenses</h4>
      </div>
      <div className=' card-body px-0 px-md-3 '>
        <ul className='list-group mb-3 mx-3'>
          {expenses.map((expense) => (
            <div key={expense.id} className='row rounded shadow mb-2'>
              <div className='col-lg-8'>
                <div className='mb-3'>
                  <label htmlFor='description' className='form-label'>
                    <strong>Description:</strong>
                  </label>
                  <input
                    type='text'
                    id='description'
                    className='form-control form-control-sm shadow'
                    value={expense.description}
                    readOnly
                  />
                </div>
              </div>
              <div className='col-lg-3'>
                <div className='mb-3'>
                  <label htmlFor='value' className='form-label'>
                    <strong>Value:</strong>
                  </label>
                  <input
                    type='text'
                    id='value'
                    className='form-control form-control-sm shadow'
                    value={`${currency_sign} ${expense.value}`}
                    readOnly
                  />
                </div>
              </div>
              <div className=' col-lg-1 my-auto text-end text-lg-center'>
                <button
                  type='button'
                  className='btn btn-outline-danger btn-sm border-0 icon-shadow'
                  onClick={() => removeExpense(expense.id)}
                  disabled={application.approved || application.is_rejected}
                >
                  <FaTrash size={15} />
                </button>
              </div>
            </div>
          ))}
        </ul>

        {/* Add expence component */}
        <hr />
        {!application.approved && !application.is_rejected && (
          <form onSubmit={addNewExpense}>
            <div className='card-body px-0 mx-md-2'>
              <div className='row border border-3 border-warning rounded mx-1 mx-md-5 shadow mb-2 py-2'>
                <h4 className='card-subtitle text-warning-emphasis'>
                  Add New Expense
                </h4>
                <div className='col-md-7 mb-3'>
                  <label htmlFor='description' className='form-label'>
                    Description
                  </label>
                  <input
                    type='text'
                    id='description'
                    name='description'
                    className={getFieldClassName('description')}
                    value={newExpense.description}
                    onChange={handleNewExpenseChange}
                    required
                  />
                </div>
                <div className='col-md-3'>
                  <label htmlFor='value' className='form-label'>
                    Value
                  </label>
                  <input
                    type='number'
                    step='0.01' // Allows two decimal places
                    min='0'
                    id='value'
                    name='value'
                    className={getFieldClassName('value')}
                    value={newExpense.value}
                    onChange={handleNewExpenseChange}
                    placeholder={currency_sign}
                    required
                  />
                </div>
                <div className='col-md-2 my-auto text-end mt-2'>
                  <button
                    type='submit'
                    className='btn btn-sm btn-dark me-1'
                    disabled={!isFormValid}
                  >
                    <FaSave size={20} color={isFormValid ? 'red' : 'grey'} />
                  </button>
                </div>
              </div>
              {errorMessage && (
                <div className='alert alert-danger mt-3' role='alert'>
                  {errorMessage.split('\n').map((msg, index) => (
                    <div key={index}>{msg}</div>
                  ))}
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ExpensesComponent;
