
import { useParams } from 'react-router-dom';

import BackToApplicationsIcon from '../../../../GenericComponents/BackToApplicationsIcon';
import FileDropZoneSigned from './FileDropZoneSigned';
import {useState} from "react";

const UploadNewDocumentSigned = () => {
  const { applicationId } = useParams();
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <>
      <BackToApplicationsIcon backUrl={`/applications/${applicationId}`} />
      <div className='card my-5'>
        <div className='card mb-5'>
          <div className='card-header'>
            <h4>Select a document type</h4>
          </div>
          <div className='card-body d-flex align-items-center justify-content-evenly flex-wrap'>
            <div className='form-check'>
              <input
                className='form-check-input'
                type='radio'
                name='radioSelect'
                id='option1'
                value='Solicitor undertaking'
                onChange={handleChange}
                checked={selectedValue === 'Solicitor undertaking'}
              />
              <label className='form-check-label' htmlFor='option1'>
                Solicitor undertaking
              </label>
            </div>

            <div className='form-check'>
              <input
                className='form-check-input'
                type='radio'
                name='radioSelect'
                id='option2'
                value='Advancement agreement'
                onChange={handleChange}
                checked={selectedValue === 'Advancement agreement'}
              />
              <label className='form-check-label' htmlFor='option2'>
                Advancement agreement
              </label>
            </div>

            <div className='form-check'>
              <input
                className='form-check-input'
                type='radio'
                name='radioSelect'
                id='option3'
                value='Other'
                onChange={handleChange}
                checked={selectedValue === 'Other'}
              />
              <label className='form-check-label' htmlFor='option3'>
                Other
              </label>
            </div>
          </div>
          <div className='card-footer'>
            <h6 className={`${selectedValue ? 'text-info' : 'text-danger'}`}>
              Selected Value: {selectedValue || 'None'}
            </h6>
          </div>
        </div>
        {selectedValue !== '' && (
          <FileDropZoneSigned
            applicationId={applicationId}
            selectedDocumentType={selectedValue}
          />
        )}
      </div>
    </>
  );
};

export default UploadNewDocumentSigned;
