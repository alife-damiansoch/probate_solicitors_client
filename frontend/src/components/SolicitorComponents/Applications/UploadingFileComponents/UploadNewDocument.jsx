
import { useParams } from 'react-router-dom';
import FilesDropZone from './FileDropZone';
import BackToApplicationsIcon from '../../../GenericComponents/BackToApplicationsIcon';

const UploadNewDocument = () => {
  const { applicationId } = useParams();
  return (
    <div style={{marginTop:"80px"}}>
      <BackToApplicationsIcon backUrl={`/applications/${applicationId}`} />
      <div className='card my-5'>
        <FilesDropZone applicationId={applicationId} />
      </div>
    </div>
  );
};

export default UploadNewDocument;
