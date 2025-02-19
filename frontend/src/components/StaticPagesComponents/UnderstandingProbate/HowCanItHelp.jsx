import React from 'react';
import AnimatedSection from '../../GenericFunctions/AnimatedSection'; // Adjust the import path as needed
import CustomCard from '../Generic/CustomCard';

const YourComponent = () => {
  return (
    <div className='howCanItHelp d-flex flex-column'>
      <div className='card-body flex-grow-1 text-primary-emphasis mx-0 px-0'>
        <AnimatedSection
          as='h5'
          className='title roboto-bold-italic text-center'
        >
          How can a probate advancement help?
        </AnimatedSection>

        <div className='row mt-5 '>
          {/* Image on top for mobile, left for larger screens */}
          <div className='col-lg-6 order-lg-2 d-flex align-items-center justify-content-center'>
            <img
              alt='Helping hand'
              src='/img/cost.jpg'
              className='img-fluid shadow'
            />
          </div>
          {/* Text on top for mobile, right for larger screens */}
          <div className='col-lg-6 order-lg-1 my-auto'>
            <AnimatedSection as='p' className='text'>
              This is an efficient and easy to follow process, which will
              immediately unlock the value of an estate.
            </AnimatedSection>
            <AnimatedSection as='p' className='text'>
              The advancement is against the value of the estate, as set out in
              the Revenue Affidavit (CA 24).
            </AnimatedSection>
            <AnimatedSection as='p' className='text'>
              A certificate of title from the appointed solicitor confirms that
              there is good marketable title to all realty assets, and the
              solicitors undertaking ensures that all advancements and fees are
              paid in priority to any disbursements.
            </AnimatedSection>
          </div>
        </div>

        {/* Custom cards */}
        <br />
        <br />
        <AnimatedSection>
          <div className='row roboto-light'>
            <strong className='text'>
              Therefore unlike conventional lending there are:
            </strong>
            <div className='col-12 mt-4 d-flex flex-wrap justify-content-evenly align-items-center'>
              <CustomCard backgroundColor='info-subtle' shape='circle'>
                No credit checks
              </CustomCard>
              <CustomCard backgroundColor='info-subtle' shape='circle'>
                No personal liability
              </CustomCard>
              <CustomCard backgroundColor='info-subtle' shape='circle'>
                No monthly repayments
              </CustomCard>
            </div>
          </div>
        </AnimatedSection>

        {/* Remaining paragraphs */}
        <div className='row '>
          <div className='col-12 mt-4'>
            <AnimatedSection as='p' className='text'>
              Potentially a huge relief for those navigating the probate
              process.
            </AnimatedSection>
            <AnimatedSection as='p' className='text'>
              And the repayment is taken directly from the estate, so you don’t
              need to worry about keeping up with monthly repayments.
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourComponent;

// import React from 'react';
// import CustomCard from '../Generic/CustomCard';

// const YourComponent = () => {
//   return (
//     <div className='howCanItHelp d-flex flex-column'>
//       <div className='card-body flex-grow-1 text-primary-emphasis'>
//         <h5 className='title roboto-bold-italic text-center'>
//           How can a probate advancement help?
//         </h5>
//         <div className='row mt-5 roboto-medium'>
//           {/* Image on top for mobile, left for larger screens */}
//           <div className='col-lg-6 order-lg-2 d-flex align-items-center justify-content-center'>
//             <img
//               alt='Helping hand'
//               src='/img/cost.jpg'
//               className='img-fluid shadow'
//             />
//           </div>
//           {/* Text on top for mobile, right for larger screens */}
//           <div className='col-lg-6 order-lg-1 my-auto'>
//             <p className='text'>
//               This is an efficient and easy to follow process, which will
//               immediately unlock the value of an estate.
//             </p>
//             <p className='text'>
//               The advancement is against the value of the estate, as set out in
//               the Revenue Affidavit (CA 24).
//             </p>
//             <p className='text'>
//               A certificate of title from the appointed solicitor confirms that
//               there is good marketable title to all realty assets, and the
//               solicitors undertaking ensures that all advancements and fees are
//               paid in priority to any disbursements.
//             </p>
//           </div>
//         </div>
//         {/* Custom cards */}
//         <br />
//         <br />
//         <div className='row roboto-medium'>
//           <strong className='text'>
//             Therefore unlike conventional lending there are:
//           </strong>
//           <div className='col-12 mt-4 d-flex flex-wrap justify-content-evenly align-items-center'>
//             <CustomCard backgroundColor='success' shape='circle'>
//               No credit checks
//             </CustomCard>
//             <CustomCard backgroundColor='success' shape='circle'>
//               <p>No personal liability</p>
//             </CustomCard>
//             <CustomCard backgroundColor='success' shape='circle'>
//               <p>no monthly repayments</p>
//             </CustomCard>
//           </div>
//         </div>

//         {/* Remaining paragraphs */}
//         <div className='row roboto-medium'>
//           <div className='col-12 mt-4'>
//             <p className='text'>
//               Potentially a huge relief for those navigating the probate
//               process.
//             </p>
//             <p className='text'>
//               And the repayment is taken directly from the estate, so you don’t
//               need to worry about keeping up with monthly repayments.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default YourComponent;
