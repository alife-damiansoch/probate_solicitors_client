import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import EstateSummarySticky from '../Applications/AddApplicationParts/FormParts/EstateSummarySticky';
import EstateManagerModal from './EstatesManagerModal';
import { estateFieldMap } from './EstatesManagerModalParts/estateFieldConfig'; // Import the field configuration

const EstatesPart = ({ application, refresh, setRefresh }) => {
  const currency_sign = Cookies.get('currency_sign');
  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEstateModal, setShowEstateModal] = useState(false);

  console.log('Application:', application.id);

  // Fetch estates when application.estate_summary changes
  useEffect(() => {
    const getEstates = async () => {
      if (!application.estate_summary) return;
      console.log(
        `Fetching estates for application ${application.id} from ${application.estate_summary}`
      );
      setLoading(true);
      try {
        const token = Cookies.get('auth_token')?.access;
        // Use fetchData helper. (Adjust if yours expects full auth object.)
        const response = await fetchData(
          token,
          application.estate_summary,
          true
        ); // true = absolute url
        console.log('Estates response:', response);

        // Flatten all estate categories into a single array
        const estatesData = response.data;
        const allEstates = [];

        // Extract estates from all categories and add category labels
        Object.entries(estatesData).forEach(([category, categoryEstates]) => {
          if (Array.isArray(categoryEstates) && categoryEstates.length > 0) {
            categoryEstates.forEach((estate) => {
              // Add category information to each estate
              const isLiability = category === 'irish_debt';
              allEstates.push({
                ...estate,
                category: category,
                group_label: formatCategoryName(category),
                is_asset: isLiability ? false : estate.is_asset, // Mark irish_debt as liability
              });
            });
          }
        });

        console.log('Flattened estates:', allEstates);
        setEstates(allEstates);
      } catch (e) {
        console.error('Error fetching estates:', e);
        setEstates([]);
      }
      setLoading(false);
    };
    getEstates();
  }, [application.estate_summary, refresh]);

  // Helper function to format category names for display
  const formatCategoryName = (category) => {
    return category
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to format field names for display
  const formatFieldName = (fieldName) => {
    return fieldName
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to get field configuration for an estate category
  const getFieldsForCategory = (category) => {
    return estateFieldMap[category] || [];
  };

  // Helper function to render estate fields based on configuration
  const renderEstateFields = (estate) => {
    const fields = getFieldsForCategory(estate.category);

    if (fields.length === 0) {
      // Fallback to displaying all available properties if no config found
      const relevantFields = Object.entries(estate).filter(
        ([key, val]) =>
          val !== null &&
          val !== undefined &&
          val !== '' &&
          !['id', 'category', 'group_label', 'is_asset', 'value'].includes(key)
      );

      if (relevantFields.length === 0) return null;

      return (
        <div>
          {relevantFields.map(([key, val]) => (
            <div key={key} style={{ marginBottom: '0.6rem' }}>
              <div
                style={{
                  fontWeight: 500,
                  color: '#495057',
                  fontSize: '0.9rem',
                  marginBottom: '0.2rem',
                }}
              >
                {formatFieldName(key)}:
              </div>
              <div
                style={{
                  color: '#6c757d',
                  fontSize: '0.9rem',
                  paddingLeft: '0.5rem',
                }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Use field configuration to display structured data
    const fieldsToShow = fields.filter((field) => {
      const value = estate[field.name];
      return (
        field.name !== 'value' &&
        value !== null &&
        value !== undefined &&
        value !== ''
      );
    });

    if (fieldsToShow.length === 0) return null;

    return (
      <div>
        {fieldsToShow.map((field) => {
          const value = estate[field.name];
          return (
            <div key={field.name} style={{ marginBottom: '0.6rem' }}>
              <div
                style={{
                  fontWeight: 500,
                  color: '#495057',
                  fontSize: '0.9rem',
                  marginBottom: '0.2rem',
                }}
              >
                {field.label}:
              </div>
              <div
                style={{
                  color: '#6c757d',
                  fontSize: '0.9rem',
                  paddingLeft: '0.5rem',
                }}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <div className='text-center my-4'>Loading estates...</div>;
  }

  if (!estates || estates.length === 0) {
    return (
      <div className='card mt-3 mx-md-3 rounded border-0'>
        <div className='card-header rounded-top my-3'>
          <h4 className='card-subtitle text-info-emphasis'>Estates</h4>
        </div>
        <div className='alert alert-danger col-auto mx-auto'>
          No estate information available for this application.
        </div>
        <div className='text-end mb-3'>
          <button
            className='btn btn-outline-primary btn-sm'
            onClick={() => setShowEstateModal(true)}
          >
            + Manage Estates
          </button>
        </div>
        <EstateManagerModal
          show={showEstateModal}
          onClose={() => setShowEstateModal(false)}
          estates={estates}
          applicationId={application.id}
          refreshEstates={() => setRefresh(!refresh)}
        />
      </div>
    );
  }

  // Group by label and separate assets from liabilities
  const grouped = estates.reduce((acc, estate) => {
    const key = estate.group_label || estate.label || estate.name || 'Unnamed';
    if (!acc[key]) acc[key] = [];
    acc[key].push(estate);
    return acc;
  }, {});

  // Separate assets and liabilities
  const assetGroups = {};
  const liabilityGroups = {};

  Object.entries(grouped).forEach(([key, estatesArray]) => {
    if (estatesArray.some((estate) => estate.is_asset === false)) {
      liabilityGroups[key] = estatesArray;
    } else {
      assetGroups[key] = estatesArray;
    }
  });

  return (
    <div className='card mt-3 mx-md-3 rounded border-0'>
      <div className='card-header rounded-top mt-3'>
        <h4 className='card-subtitle text-info-emphasis'>Estates</h4>
      </div>

      <div className='card-body p-0 p-md-3'>
        {/* Assets Section */}
        {Object.keys(assetGroups).length > 0 && (
          <>
            <div
              style={{
                backgroundColor: '#e3f2fd',
                border: '1px solid #1976d2',
                borderRadius: '8px',
                padding: '1rem 1.5rem',
                marginBottom: '1.5rem',
                marginTop: '1rem',
              }}
            >
              <h6
                style={{
                  margin: 0,
                  color: '#1976d2',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                ESTATE ASSETS
              </h6>
              <p
                style={{
                  margin: '0.5rem 0 0 0',
                  color: '#424242',
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                }}
              >
                Property, investments, debts owed to the deceased, and other
                valuable items comprising the gross estate
              </p>
            </div>

            {Object.entries(assetGroups).map(
              ([estateName, groupedEstates], groupIndex) => (
                <div key={groupIndex} className='mb-4'>
                  {/* Create individual cards for each estate group */}
                  <div className='card border rounded-3 shadow-sm'>
                    <div className='card-header bg-light'>
                      <h5 className='text-primary fw-bold mb-0'>
                        {estateName}
                      </h5>
                    </div>
                    <div className='card-body'>
                      {groupedEstates.map((estate, index) => {
                        const displayName =
                          groupedEstates.length > 1
                            ? `${estateName} (${index + 1})`
                            : estateName;

                        return (
                          <div
                            key={index}
                            className={
                              'd-flex flex-column flex-md-row align-items-start align-items-md-center ' +
                              'border rounded-3 p-3 pb-2 position-relative ' +
                              (index < groupedEstates.length - 1
                                ? 'mb-3 '
                                : '') +
                              (estate.is_asset === false
                                ? 'bg-liability'
                                : 'bg-white')
                            }
                            style={{
                              borderLeft:
                                estate.is_asset === false
                                  ? '5px solid #495d8b'
                                  : '5px solid #0dcaf0',
                              minHeight: '120px',
                              transition: 'box-shadow 0.2s',
                            }}
                          >
                            <div className='flex-grow-1'>
                              {groupedEstates.length > 1 && (
                                <div className='mb-2 d-flex align-items-center'>
                                  <span className='fw-bold fs-6 text-secondary'>
                                    {displayName}
                                  </span>
                                  {estate.is_asset === false && (
                                    <span
                                      className='ms-2'
                                      title='Non-asset item'
                                      style={{
                                        color: '#495d8b',
                                        opacity: 0.7,
                                        verticalAlign: 'middle',
                                      }}
                                    >
                                      <FaFileInvoiceDollar size={15} />
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Enhanced field rendering using configuration */}
                              {renderEstateFields(estate)}
                            </div>

                            <div
                              className='d-flex flex-row align-items-center ms-md-3 my-2 my-md-0'
                              style={{ minWidth: 220 }}
                            >
                              <div>
                                <div className='form-label mb-1 small text-nowrap'>
                                  {estate.category === 'irish_debt'
                                    ? 'Amount Owed:'
                                    : 'Value:'}
                                </div>
                                <div className='input-group input-group-sm'>
                                  <input
                                    type='text'
                                    className='form-control shadow-none'
                                    style={{ minWidth: 90, fontWeight: 500 }}
                                    value={`${currency_sign} ${estate.value}`}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )
            )}
          </>
        )}

        {/* Liabilities Section */}
        {Object.keys(liabilityGroups).length > 0 && (
          <>
            <div
              style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                padding: '1rem 1.5rem',
                marginBottom: '1.5rem',
                marginTop:
                  Object.keys(assetGroups).length > 0 ? '2rem' : '1rem',
              }}
            >
              <h6
                style={{
                  margin: 0,
                  color: '#856404',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                ESTATE LIABILITIES
              </h6>
              <p
                style={{
                  margin: '0.5rem 0 0 0',
                  color: '#424242',
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                }}
              >
                Debts, funeral expenses, and other obligations payable by the
                estate
              </p>
            </div>

            {Object.entries(liabilityGroups).map(
              ([estateName, groupedEstates], groupIndex) => (
                <div key={groupIndex} className='mb-4'>
                  {/* Create individual cards for each estate group */}
                  <div className='card border rounded-3 shadow-sm'>
                    <div className='card-header bg-light'>
                      <h5 className='text-primary fw-bold mb-0'>
                        {estateName}
                      </h5>
                    </div>
                    <div className='card-body'>
                      {groupedEstates.map((estate, index) => {
                        const displayName =
                          groupedEstates.length > 1
                            ? `${estateName} (${index + 1})`
                            : estateName;

                        return (
                          <div
                            key={index}
                            className={
                              'd-flex flex-column flex-md-row align-items-start align-items-md-center ' +
                              'border rounded-3 p-3 pb-2 position-relative ' +
                              (index < groupedEstates.length - 1
                                ? 'mb-3 '
                                : '') +
                              (estate.is_asset === false
                                ? 'bg-liability'
                                : 'bg-white')
                            }
                            style={{
                              borderLeft:
                                estate.is_asset === false
                                  ? '5px solid #495d8b'
                                  : '5px solid #0dcaf0',
                              minHeight: '120px',
                              transition: 'box-shadow 0.2s',
                            }}
                          >
                            <div className='flex-grow-1'>
                              {groupedEstates.length > 1 && (
                                <div className='mb-2 d-flex align-items-center'>
                                  <span className='fw-bold fs-6 text-secondary'>
                                    {displayName}
                                  </span>
                                  {estate.is_asset === false && (
                                    <span
                                      className='ms-2'
                                      title='Non-asset item'
                                      style={{
                                        color: '#495d8b',
                                        opacity: 0.7,
                                        verticalAlign: 'middle',
                                      }}
                                    >
                                      <FaFileInvoiceDollar size={15} />
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Enhanced field rendering using configuration */}
                              {renderEstateFields(estate)}
                            </div>

                            <div
                              className='d-flex flex-row align-items-center ms-md-3 my-2 my-md-0'
                              style={{ minWidth: 220 }}
                            >
                              <div>
                                <div className='form-label mb-1 small text-nowrap'>
                                  {estate.category === 'irish_debt'
                                    ? 'Amount Owed:'
                                    : 'Value:'}
                                </div>
                                <div className='input-group input-group-sm'>
                                  <input
                                    type='text'
                                    className='form-control shadow-none'
                                    style={{ minWidth: 90, fontWeight: 500 }}
                                    value={`${currency_sign} ${estate.value}`}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )
            )}
          </>
        )}

        <div className='text-end mb-3'>
          <button
            className='btn btn-outline-primary btn-sm'
            onClick={() => setShowEstateModal(true)}
          >
            + Manage Estates
          </button>
        </div>

        <EstateSummarySticky
          estates={estates}
          formData={application}
          currency_sign={currency_sign}
        />
      </div>
      <EstateManagerModal
        show={showEstateModal}
        onClose={() => setShowEstateModal(false)}
        estates={estates}
        applicationId={application.id}
        refreshEstates={() => setRefresh(!refresh)}
      />
    </div>
  );
};

export default EstatesPart;
