import DocumentCard from './DocumentCard';

const DocumentsGrid = ({ documents, token, onSignDocument }) => {
  return (
    <div className='row g-3'>
      {documents.map((doc) => (
        <div key={doc.id} className='col-12 col-xxl-6'>
          <DocumentCard
            doc={doc}
            token={token}
            onSignDocument={onSignDocument}
          />
        </div>
      ))}
    </div>
  );
};

export default DocumentsGrid;
