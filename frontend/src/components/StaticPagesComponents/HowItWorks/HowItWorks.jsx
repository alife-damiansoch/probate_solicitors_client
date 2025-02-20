
import { MdOutlineRealEstateAgent } from 'react-icons/md';
import { RiMoneyEuroCircleLine } from 'react-icons/ri';
import { GiTakeMyMoney } from 'react-icons/gi';
import CustomCard from '../Generic/CustomCard';
import CustomAlert from '../Generic/CustomAlert';
import AnimatedSection from '../../GenericFunctions/AnimatedSection'; // Adjust the import path as needed

const HowItWorks = () => {
  return (
    <div className='card bg-white border-0 text-center'>
      <div className='card-header bg-light border-0'>
        <AnimatedSection as='h5' className='card-title title  text-black'>
          Probate Advancement Process
        </AnimatedSection>
      </div>
      <div className='card-body text border-0 mx-0 px-0'>
        <AnimatedSection className='text-center mx-lg-5'>
          <CustomAlert backgroundColor='info-emphasis'>
            <strong>
              Probate advancements are slightly different from traditional
              loans.
            </strong>
            <br />
            <br />
            While conventional loans are often secured against an existing
            property and require credit checks, income proof, and monthly
            repayments, probate advancements work uniquely within the probate
            process.
          </CustomAlert>
        </AnimatedSection>

        <div className='list-group'>
          <AnimatedSection
            as='div'
            className='list-group-item bg-white border-0'
          >
            <div className='ms-2'>
              <AnimatedSection
                as='h5'
                className='mt-4 title  text-primary-emphasis'
              >
                Estate Valuation
              </AnimatedSection>
              <MdOutlineRealEstateAgent
                color='#17191B'
                size={80}
                className='icon'
              />
              <div className='mt-3  text-primary-emphasis text-start'>
                <AnimatedSection as='p'>
                  This is the first step in the process.
                </AnimatedSection>
                <br />
                <AnimatedSection as='p'>
                  A valuation is conducted that includes all the assets of the
                  deceased, including:
                </AnimatedSection>
                <div className='d-flex align-items-center justify-content-evenly flex-wrap'>
                  <AnimatedSection>
                    <CustomCard
                      backgroundColor='info-subtle'
                      shape='circle'
                      width={150}
                      height={100}
                    >
                      Property
                    </CustomCard>
                  </AnimatedSection>
                  <AnimatedSection>
                    <CustomCard
                      backgroundColor='info-subtle'
                      shape='circle'
                      width={150}
                      height={100}
                    >
                      Cash
                    </CustomCard>
                  </AnimatedSection>
                  <AnimatedSection>
                    <CustomCard
                      backgroundColor='info-subtle'
                      shape='circle'
                      width={150}
                      height={100}
                    >
                      Investments
                    </CustomCard>
                  </AnimatedSection>
                  <AnimatedSection>
                    <CustomCard
                      backgroundColor='info-subtle'
                      shape='circle'
                      width={150}
                      height={100}
                    >
                      Savings
                    </CustomCard>
                  </AnimatedSection>
                </div>
                <AnimatedSection as='p' className='text-center'>
                  And any other possessions of value like jewellery and cars
                </AnimatedSection>
                <br />
                <AnimatedSection as='p' className='text-center'>
                  The valuation of the estate is usually conducted by a
                  professional valuation expert to ensure an accurate and fair
                  market value of all assets in the estate.
                </AnimatedSection>
                <br />
                <AnimatedSection as='p' className='text-center'>
                  These assets are listed and itemized in the Revenue Affidavit
                  (CA 24) which is submitted to Revenue as part of the probate
                  process.
                </AnimatedSection>
                <br />
                <AnimatedSection as='p' className='text-center'>
                  This form CA 24 is uploaded by the applicant&#39;s solicitor to
                  our platform to determine the amount that can be advanced
                  against the value of the estate.
                </AnimatedSection>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection
            as='div'
            className='list-group-item bg-white border-0 border-top'
          >
            <div className='ms-2 me-auto'>
              <AnimatedSection
                as='h5'
                className='mt-3 title  text-primary-emphasis'
              >
                Advancement Amounts: How much could we advance?
              </AnimatedSection>
              <RiMoneyEuroCircleLine
                className='icon'
                color='#17191B'
                size={80}
              />
              <div className='mt-3 text text-center  text-primary-emphasis'>
                <AnimatedSection as='p'>
                  We can typically advance up to 60% of the value of your
                  inheritance.
                </AnimatedSection>
                <br />
                <AnimatedSection as='p'>
                  There is generally no maximum amount you can advance as long
                  as your inheritance will cover it within the range above.
                </AnimatedSection>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection
            as='div'
            className='list-group-item bg-white border-0 border-top'
          >
            <div className='ms-2 me-auto'>
              <AnimatedSection
                as='h5'
                className='mt-3 title  text-primary-emphasis'
              >
                Repayment Process Explained
              </AnimatedSection>
              <GiTakeMyMoney className='icon' color='#17191B' size={80} />
              <div className='mt-3 text text-center  text-primary-emphasis'>
                <AnimatedSection as='p'>
                  Probate advancements are unique in that the lender assumes a
                  significant amount of risk, but it’s backed up by the estate
                  value.
                </AnimatedSection>
                <br />
                <AnimatedSection as='p'>
                  Once your advancement is issued, the repayment comes directly
                  from the estate, meaning your lender is dependent on the
                  successful conclusion.
                </AnimatedSection>
                <br />
                <AnimatedSection as='p'>
                  So when we are considering your advance, we will take into
                  account the types of assets: their market value, the potential
                  for depreciation, and the estimated duration of the probate
                  process among other things.
                </AnimatedSection>
                <br />
                <AnimatedSection className='text-center mx-lg-5'>
                  <CustomAlert backgroundColor='info-subtle'>
                    Also, probate advancements don’t require you to have a
                    certain credit score or a particular level of income, and
                    there are no monthly repayments.
                  </CustomAlert>
                </AnimatedSection>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

// import React from 'react';
// import { MdOutlineRealEstateAgent } from 'react-icons/md';
// import { RiMoneyEuroCircleLine } from 'react-icons/ri';
// import { GiTakeMyMoney } from 'react-icons/gi';
// import CustomCard from '../Generic/CustomCard';
// import CustomAlert from '../Generic/CustomAlert';

// const HowItWorks = () => {
//   return (
//     <div className='card bg-white border-0 text-center'>
//       <div className='card-header bg-light border-0'>
//         <h5 className='card-title title roboto-medium text-black'>
//           Probate Advancement Process
//         </h5>
//       </div>
//       <div className='card-body text border-0'>
//         <div className='text-center mx-lg-5'>
//           <CustomAlert backgroundColor='info'>
//             <strong>
//               Probate advancements are slightly different from traditional
//               loans.
//             </strong>
//             <br />
//             While conventional loans are often secured against an existing
//             property and require credit checks, income proof, and monthly
//             repayments, probate advancements work uniquely within the probate
//             process.
//           </CustomAlert>
//         </div>
//         <div className='list-group'>
//           <div className='list-group-item bg-white border-0'>
//             <div className='ms-2'>
//               <h5 className='mt-4 title roboto-medium text-primary-emphasis'>
//                 Estate Valuation
//               </h5>
//               <MdOutlineRealEstateAgent
//                 color='#17191B'
//                 size={80}
//                 className='icon'
//               />
//               <div className='mt-3 roboto-medium text-primary-emphasis text-start'>
//                 <p>This is the first step in the process.</p>
//                 <br />
//                 <p>
//                   A valuation is conducted that includes all the assets of the
//                   deceased, including:
//                 </p>
//                 <div className='d-flex align-items-center justify-content-evenly flex-wrap'>
//                   <CustomCard
//                     backgroundColor='success'
//                     shape='circle'
//                     width={150}
//                     height={150}
//                   >
//                     Property
//                   </CustomCard>
//                   <CustomCard
//                     backgroundColor='success'
//                     shape='circle'
//                     width={150}
//                     height={150}
//                   >
//                     Cash
//                   </CustomCard>
//                   <CustomCard
//                     backgroundColor='success'
//                     shape='circle'
//                     width={150}
//                     height={150}
//                   >
//                     Investments
//                   </CustomCard>
//                   <CustomCard
//                     backgroundColor='success'
//                     shape='circle'
//                     width={150}
//                     height={150}
//                   >
//                     Savings
//                   </CustomCard>
//                 </div>
//                 <p className='text-center'>
//                   And any other possessions of value like jewellery and cars
//                 </p>
//                 <br />
//                 <p className='text-center'>
//                   The valuation of the estate is usually conducted by a
//                   professional valuation expert to ensure an accurate and fair
//                   market value of all assets in the estate.
//                 </p>
//                 <br />
//                 <p className='text-center'>
//                   These assets are listed and itemized in the Revenue Affidavit
//                   (CA 24) which is submitted to Revenue as part of the probate
//                   process.
//                 </p>
//                 <br />
//                 <p className='text-center'>
//                   This form CA 24 is uploaded by the applicant's solicitor to
//                   our platform to determine the amount that can be advanced
//                   against the value of the estate.
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className='list-group-item bg-white border-0 border-top'>
//             <div className='ms-2 me-auto'>
//               <h5 className='mt-3 title roboto-medium text-primary-emphasis'>
//                 Advancement Amounts: How much could we advance?
//               </h5>
//               <RiMoneyEuroCircleLine
//                 className='icon'
//                 color='#17191B'
//                 size={80}
//               />
//               <div className='mt-3 text text-center roboto-medium text-primary-emphasis'>
//                 <p>
//                   We can typically advance up to 60% of the value of your
//                   inheritance.
//                 </p>
//                 <br />
//                 <p>
//                   There is generally no maximum amount you can advance as long
//                   as your inheritance will cover it within the range above.
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className='list-group-item bg-white border-0 border-top'>
//             <div className='ms-2 me-auto'>
//               <h5 className='mt-3 title roboto-medium text-primary-emphasis'>
//                 Repayment Process Explained
//               </h5>
//               <GiTakeMyMoney className='icon' color='#17191B' size={80} />
//               <div className='mt-3 text text-center roboto-medium text-primary-emphasis'>
//                 <p>
//                   Probate advancements are unique in that the lender assumes a
//                   significant amount of risk, but it’s backed up by the estate
//                   value.
//                 </p>
//                 <br />
//                 <p>
//                   Once your advancement is issued, the repayment comes directly
//                   from the estate, meaning your lender is dependent on the
//                   successful conclusion.
//                 </p>
//                 <br />
//                 <p>
//                   So when we are considering your advance, we will take into
//                   account the types of assets: their market value, the potential
//                   for depreciation, and the estimated duration of the probate
//                   process among other things.
//                 </p>
//                 <br />
//                 <div className='text-center mx-lg-5'>
//                   <CustomAlert backgroundColor='info'>
//                     Also, probate advancements don’t require you to have a
//                     certain credit score or a particular level of income, and
//                     there are no monthly repayments.
//                   </CustomAlert>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HowItWorks;
