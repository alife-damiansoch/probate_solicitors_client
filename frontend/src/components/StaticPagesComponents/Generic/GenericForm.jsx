// GenericForm.js
import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Row,
} from 'reactstrap';

const GenericForm = ({
  formData,
  handleChange,
  handleAddItem,
  handleSubmit,
}) => {
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        {formData.sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <Card className='border-5'>
              <CardBody className=''>
                <CardHeader className=' bg-light'>
                  <CardTitle className='title  text-center roboto-bold-italic text-black'>
                    {section.title}
                  </CardTitle>
                  <CardSubtitle className=' text-center text-info roboto-regular-italic'>
                    {section.description && <p>{section.description}</p>}
                  </CardSubtitle>
                </CardHeader>

                {section.fields.map((field, fieldIndex) => (
                  <div
                    className='  bg-info text-dark row mx-3 '
                    key={fieldIndex}
                  >
                    <div className=' col-lg-4 my-auto text-lg-end'>
                      <label className=' form-label '>{field.label}:</label>
                    </div>

                    {field.type === 'textarea' ? (
                      <div className='col-lg-8'>
                        <textarea
                          className=' form-control my-2'
                          name={`${section.title}.${field.name}`}
                          value={field.value}
                          onChange={(e) =>
                            handleChange(
                              sectionIndex,
                              field.name,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ) : (
                      <div className='col-lg-8'>
                        <input
                          className='  form-control my-2 '
                          type={field.type}
                          name={`${section.title}.${field.name}`}
                          value={field.value}
                          onChange={(e) =>
                            handleChange(
                              sectionIndex,
                              field.name,
                              e.target.value
                            )
                          }
                          required={
                            field.name === 'nameOfDeceased' ||
                            field.name === 'nameofBeneficiaryBeneficiaries' ||
                            field.name === 'borowersPPS' ||
                            field.name === 'financeRequired' ||
                            field.name === 'termRequired'
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}

                {section.listOfItems && (
                  <>
                    {section.listOfItems.map((item, itemIndex) => (
                      <div className=' my-2   text-white' key={itemIndex}>
                        {section.fields.map((field, fieldIndex) => (
                          <div
                            key={fieldIndex}
                            className=' bg-info text-dark row mx-3 '
                          >
                            <div className=' col-lg-4 my-auto text-lg-end'>
                              <label className=' form-label'>
                                {field.label}:
                              </label>
                            </div>
                            {field.type === 'textarea' ? (
                              <div className='col-lg-8 my-2'>
                                <textarea
                                  className=' form-control'
                                  name={`${section.title}.${itemIndex}.${field.name}`}
                                  value={item[field.name] || ''}
                                  onChange={(e) =>
                                    handleChange(
                                      sectionIndex,
                                      field.name,
                                      e.target.value,
                                      itemIndex
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              <div className='col-lg-8'>
                                <input
                                  className=' form-control my-2'
                                  type={field.type}
                                  name={`${section.title}.${itemIndex}.${field.name}`}
                                  value={item[field.name] || ''}
                                  onChange={(e) =>
                                    handleChange(
                                      sectionIndex,
                                      field.name,
                                      e.target.value,
                                      itemIndex
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                    <div className='row my-3'>
                      <button
                        type='button'
                        className='btn btn-success col-10 mx-auto'
                        onClick={() => handleAddItem(sectionIndex)}
                      >
                        Add {section.title}
                      </button>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        ))}
        <Row>
          <button type='submit' className='btn btn-success col-6 mx-auto my-2'>
            Submit
          </button>
        </Row>
      </form>
    </Card>
  );
};

export default GenericForm;
