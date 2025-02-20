
import AnimatedSection from '../../GenericFunctions/AnimatedSection'; // Adjust the import path as needed
import CustomAlert from '../Generic/CustomAlert';

const WhatIsProbate = () => {
  return (
    <div className='whatIsProbate'>
      <div className='card-body mx-0 px-0'>
        <div className='mt-5 '>
          <div className='text-primary-emphasis text text-center'>
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              A probate advancement, also known as an inheritance or estate
              advancement, is a financial product designed to assist
              beneficiaries and executors during the probate process.
            </AnimatedSection>
            <br />
            <AnimatedSection as='p' className='text text-primary-emphasis'>
              They can be arranged quickly, and they’re secured against the
              value of your inheritance – so, you can borrow more than with a
              standard personal loan.
            </AnimatedSection>
            <br />
            <AnimatedSection className='roboto-regular text-center mx-lg-5'>
              <CustomAlert backgroundColor='info-subtle'>
                <p className='text'>
                  Probate advancements can be utilized to solve multiple issues
                  in the administration of complex estates. <br /> <br />
                  Such issues could include:
                </p>
                <ul className='list-group'>
                  <br />
                  <li className='list-group-item bg-info-subtle border-0 border-bottom border-dark-subtle text-dark rounded-top'>
                    The early settlement of bequests to avoid costly litigation
                  </li>
                  <li className='list-group-item bg-info-subtle border-0 border-bottom border-dark-subtle text-dark rounded-top'>
                    Expenditure to enhance the value of realty assets prior to
                    sale
                  </li>
                  <li className='list-group-item bg-info-subtle border-0 border-bottom border-dark-subtle text-dark rounded-top'>
                    The early settlement of a testator/testatrix&#39;s debts to
                    allow for the smooth administration of the estate
                  </li>
                  <li className='list-group-item bg-info-subtle border-0 border-bottom border-dark-subtle text-dark rounded-top'>
                    Funding the wishes of the testator/testatrix according to
                    the instructions under the terms of the will
                  </li>
                </ul>
              </CustomAlert>
            </AnimatedSection>
            <br />
            <AnimatedSection as='p' className='text text-lg-center'>
              As solicitors who deal with administering estates on a daily basis
              are only too aware that the process is complex and time consuming.
            </AnimatedSection>
            <br />
            <AnimatedSection as='p' className='text text-lg-center'>
              Often expert opinions are required from tax experts, senior
              counsel, surveyors, engineers etc. In many cases the estate is
              asset rich, but cash poor, which can bring its own challenges.
            </AnimatedSection>
            <br />
            <AnimatedSection as='p' className='text text-lg-center'>
              This innovative product can be utilized to solve a multitude of
              problems for practitioners, executors and beneficiaries alike.
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIsProbate;

// import React from 'react';
// import CustomAlert from '../Generic/CustomAlert';

// const WhatIsProbate = () => {
//   return (
//     <div className='whatIsProbate'>
//       <div className=' card-body'>
//         <div className='mt-5 roboto-medium'>
//           <div className='text-primary-emphasis text text-center'>
//             <p className=''>
//               A probate advancement, also known as an inheritance or estate
//               advancement, is a financial product designed to assist
//               beneficiaries and executors during the probate process.
//             </p>
//             <br />
//             <p className=''>
//               They can be arranged quickly, and they’re secured against the
//               value of your inheritance – so, you can borrow more than with a
//               standard personal loan.
//             </p>
//             <br />
//             <div className='roboto-regular text-center mx-lg-5'>
//               <CustomAlert backgroundColor='info'>
//                 Probate advancements can be utilized to solve multiple issues in
//                 the administration of complex estates. <br /> <br />
//                 Such issues could include:
//                 <ul className='list-group '>
//                   <br />
//                   <li className='list-group-item bg-info border-light text-dark rounded-top'>
//                     The early settlement of bequests to avoid costly litigation
//                   </li>
//                   <li className='list-group-item bg-info border-light text-dark'>
//                     Expenditure to enhance the value of realty assets prior to
//                     sale
//                   </li>
//                   <li className='list-group-item bg-info border-light text-dark'>
//                     The early settlement of a testator/testatrix's debts to
//                     allow for the smooth administration of the estate
//                   </li>
//                   <li className='list-group-item bg-info border-light text-dark'>
//                     Funding the wishes of the testator/testatrix according to
//                     the instructions under the terms of the will
//                   </li>
//                 </ul>
//               </CustomAlert>
//             </div>
//             <br />
//             <p className=' text-lg-center'>
//               As solicitors who deal with administering estates on a daily basis
//               are only too aware that the process is complex and time consuming.
//             </p>
//             <br />
//             <p className=' text-lg-center'>
//               Often expert opinions are required from tax experts, senior
//               counsel, surveyors, engineers etc. In many cases the estate is
//               asset rich, but cash poor, which can bring its own challenges.
//             </p>
//             <br />
//             <p className=' text-lg-center'>
//               This innovative product can be utilized to solve a multitude of
//               problems for practitioners, executors and beneficiaries alike.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WhatIsProbate;
