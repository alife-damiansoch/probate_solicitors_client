// Home.js


import AnimatedSection from '../../GenericFunctions/AnimatedSection';
import CustomCard from '../Generic/CustomCard';
import CustomAlert from '../Generic/CustomAlert';
import TaxCard from '../Generic/TaxCard';
import HowMuch from './HowMuch';

const Home = () => {
  const listStyle = {
    backgroundColor: 'white',
    color: 'black',
    padding: '10px',
    border: '1px solid #ddd',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    margin: '20px',
    listStyleType: 'none',
  };

  const ListItem = ({ text }) => (
    <li className='mb-3 list-unstyled'>
      <div
        className='p-3 text-center roboto-regular-italic'
        style={{ backgroundColor: '#f8f9fa', borderRadius: '5px' }}
      >
        {text}
      </div>
    </li>
  );

  return (
    <>
      <HowMuch />
      <div className='card bg-white border-0'>
        <div className='card-body'>
          <div className='d-flex flex-column align-items-center justify-content-evenly'>
            {/* Use AnimatedSection for each paragraph */}
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              Dealing with the estate of a deceased loved one can be very
              stressful for family members at a time of grief.
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              This stress can be further exacerbated by financial pressure.
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              The administration of the estate is usually a long cumbersome
              process, fraught with complications.
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              Our probate advancement allows an executor to release value to
              solve problems that arise every day in the administration of
              estates which include:
            </AnimatedSection>

            {/* Keep the list as a single animated section */}
            <AnimatedSection>
              <div className='' style={listStyle}>
                <ul className='p-0 m-0'>
                  <ListItem text='Financial pressure placed on a family when the deceased is the main earner' />
                  <ListItem text='Beneficiary friction where some beneficiaries want or indeed need an early payout from the estate' />
                  <ListItem text='Advance on a bequest required to upgrade a property to prepare for sale in order to maximise the selling price' />
                  <ListItem text='Early settlement of disputes between beneficiaries by payment from a probate advance can save an estate the cost of protracted litigation' />
                  <ListItem text='Where there are business assets or farming assets involved in an application for a grant of probate, a probate advancement can release much needed capital to enable the business to continue as a going concern' />
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <h5 className='title text-primary-emphasis mt-5 text-center text-decoration-underline'>
                How does <br />
                the process work?
              </h5>
              <CustomCard
                backgroundColor='info-subtle'
                shape='circle'
                width='auto'
                height='auto'
              >
                Simple!
              </CustomCard>
            </AnimatedSection>

            {/* More animated sections for each paragraph */}
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              Your solicitor effectively manages the process.
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              The executor instructs the solicitor handling the matter to upload
              the value of the estate, the certificate of title relating to any
              real estate element of the estate, and an undertaking to discharge
              the sums advanced along with our fees once the grant probate
              issues.
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              Once all the relevant information has been uploaded, our
              underwriting team will revert within 24 hours with a term sheet
              for the probate advancement.
            </AnimatedSection>

            <AnimatedSection>
              <CustomAlert backgroundColor='info-subtle'>
                <p className='text'>
                  It is important to note that this is an advancement to
                  beneficiaries of a will, which is utilised to give effect to a
                  testator / testatrix&#39;s wishes in the will.
                </p>
                <p className='text'>
                  In circumstances where the applicant is an executor who is not
                  benefitting from the probate advancement, the fees charged for
                  the advancement can be set off against a beneficiary&#39;s CAT
                  liability.
                </p>
              </CustomAlert>
            </AnimatedSection>

            {/* Continue animating each paragraph individually */}
            <AnimatedSection
              as='h5'
              className='title text-primary-emphasis mt-5 text-center text-decoration-underline'
            >
              Example
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              John Murphy died testate with an estate (consisting mainly of a
              farm) valued at €3,000,000.
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              In his will he left the farm to his son Sean and instructed that
              Sean is to pay his two sisters Kate and Sarah €500,000 each from
              the estate.
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              Sean is appointed the executor.
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              Sean receives an advance on the estate of €1,150,000, which is
              sent to his Solicitor, who in turn on the execution of the loan
              documentation and on the instruction of Sean pays the annual
              arrangement fee of €150,000 to AIL.
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              The balance of €1,000,000 is used to pay the sisters as per the
              wishes of the Testator.
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              The estate takes 2 years to obtain a grant of probate.
            </AnimatedSection>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              The total fees payable are €300,000.
            </AnimatedSection>

            <AnimatedSection>
              <TaxCard />
            </AnimatedSection>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

// import React from 'react';
// import CustomCard from '../Generic/CustomCard';
// import CustomAlert from '../Generic/CustomAlert';
// import TaxCard from '../Generic/TaxCard';
// import HowMuch from './HowMuch';

// const Home = () => {
//   const listStyle = {
//     backgroundColor: 'white',
//     color: 'black',
//     padding: '20px',
//     border: '1px solid #ddd',
//     boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
//     borderRadius: '10px',
//     margin: '20px',
//     listStyleType: 'none',
//   };

//   const ListItem = ({ text }) => (
//     <li className='mb-3 list-unstyled'>
//       <div
//         className='p-3 text-center roboto-regular-italic'
//         style={{ backgroundColor: '#f8f9fa', borderRadius: '5px' }}
//       >
//         {text}
//       </div>
//     </li>
//   );

//   return (
//     <>
//       <HowMuch />
//       <div className='card bg-white border-0'>
//         <div className='card-body'>
//           <div className='d-flex flex-column align-items-center justify-content-evenly'>
//             <p className='text text-primary-emphasis'>
//               Dealing with the estate of a deceased loved one can be very
//               stressful for family members at a time of grief.
//             </p>
//             <p className='text text-primary-emphasis'>
//               This stress can be further exacerbated by financial pressure.
//             </p>
//             <p className='text text-primary-emphasis'>
//               The administration of the estate is usually a long cumbersome
//               process, fraught with complications.
//             </p>
//             <p className='text text-primary-emphasis'>
//               Our probate advancement allows an executor to release value to
//               solve problems that arise every day in the administration of
//               estates which include:
//             </p>
//             <div className='container'>
//               <div className='card' style={listStyle}>
//                 <ul className='p-0'>
//                   <ListItem text='Financial pressure placed on a family when the deceased is the main earner' />
//                   <ListItem text='Beneficiary friction where some beneficiaries want or indeed need an early payout from the estate' />
//                   <ListItem text='Advance on a bequest required to upgrade a property to prepare for sale in order to maximise the selling price' />
//                   <ListItem text='Early settlement of disputes between beneficiaries by payment from a probate advance can save an estate the cost of protracted litigation' />
//                   <ListItem text='Where there are business assets or farming assets involved in an application for a grant of probate, a probate advancement can release much needed capital to enable the business to continue as a going concern' />
//                 </ul>
//               </div>
//             </div>

//             <h5 className='title text-primary-emphasis mt-5 text-center text-decoration-underline'>
//               How does <br />
//               the process work?
//             </h5>
//             <CustomCard
//               backgroundColor='warning'
//               shape='circle'
//               width='auto'
//               height='auto'
//             >
//               Simple!
//             </CustomCard>
//             <p className='text text-primary-emphasis'>
//               Your solicitor effectively manages the process.
//             </p>
//             <p className='text text-primary-emphasis'>
//               The executor instructs the solicitor handling the matter to upload
//               the value of the estate, the certificate of title relating to any
//               real estate element of the estate, and an undertaking to discharge
//               the sums advanced along with our fees once the grant probate
//               issues.
//             </p>
//             <p className='text text-primary-emphasis'>
//               Once all the relevant information has been uploaded, our
//               underwriting team will revert within 24 hours with a term sheet
//               for the probate advancement.
//             </p>
//             <CustomAlert backgroundColor='success'>
//               <p className='text'>
//                 It is important to note that this is an advancement to
//                 beneficiaries of a will, which is utilised to give effect to a
//                 testator / testatrix's wishes in the will.
//               </p>
//               <p className='text'>
//                 In circumstances where the applicant is an executor who is not
//                 benefitting from the probate advancement, the fees charged for
//                 the advancement can be set off against a beneficiary's CAT
//                 liability.
//               </p>
//             </CustomAlert>
//             <h5 className='title text-primary-emphasis mt-5 text-center text-decoration-underline'>
//               Example
//             </h5>
//             <p className='text text-primary-emphasis'>
//               John Murphy died testate with an estate (consisting mainly of a
//               farm) valued at €3,000,000.
//             </p>
//             <p className='text text-primary-emphasis'>
//               In his will he left the farm to his son Sean and instructed that
//               Sean is to pay his two sisters Kate and Sarah €500,000 each from
//               the estate.
//             </p>
//             <p className='text text-primary-emphasis'>
//               Sean is appointed the executor.
//             </p>
//             <p className='text text-primary-emphasis'>
//               Sean receives an advance on the estate of €1,150,000, which is
//               sent to his Solicitor, who in turn on the execution of the loan
//               documentation and on the instruction of Sean pays the annual
//               arrangement fee of €150,000 to AIL.
//             </p>
//             <p className='text text-primary-emphasis'>
//               The balance of €1,000,000 is used to pay the sisters as per the
//               wishes of the Testator.
//             </p>
//             <p className='text text-primary-emphasis'>
//               The estate takes 2 years to obtain a grant of probate.
//             </p>
//             <p className='text text-primary-emphasis'>
//               The total fees payable are €300,000.
//             </p>

//             <TaxCard />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;
