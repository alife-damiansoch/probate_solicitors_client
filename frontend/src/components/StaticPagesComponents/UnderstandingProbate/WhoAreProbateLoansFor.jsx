import React from 'react';
import AnimatedSection from '../../GenericFunctions/AnimatedSection'; // Adjust the import path as needed
import CustomAlert from '../Generic/CustomAlert';

const WhoAreProbateLoansFor = () => {
  return (
    <div className='whatIsProbate'>
      <div className='card-body mx-0 px-0'>
        <div className='mt-5  text-black-emphasis'>
          <div className='text'>
            <AnimatedSection className='roboto-regular text-center mx-lg-5'>
              <CustomAlert backgroundColor='info-subtle'>
                Probate advancements are for beneficiaries or executors of an
                estate.
              </CustomAlert>
            </AnimatedSection>
            <br />
            <AnimatedSection as='p' className='text-lg-start me-lg-5'>
              As the probate process unfolds, beneficiaries and executors often
              find themselves facing considerable financial pressure.
              <br />
              <br />
              For instance:
            </AnimatedSection>
            <div className='roboto-tregular text-center mx-lg-5'>
              <AnimatedSection>
                <CustomAlert backgroundColor='white'>
                  <div className='list-group'>
                    <div className='list-group-item bg-white fancy-list-group-item text-primary border-light'>
                      There may be immediate funeral costs to cover
                    </div>
                    <hr />
                    <div className='list-group-item bg-white fancy-list-group-item text-primary border-light'>
                      Or ongoing expenses like property maintenance for the
                      deceased's home
                    </div>
                    <hr />
                    <div className='list-group-item bg-white fancy-list-group-item text-primary border-light'>
                      Or an executor may need to settle outstanding debts
                    </div>
                    <hr />
                    <div className='list-group-item bg-white fancy-list-group-item text-primary border-light'>
                      Or there might be inheritance taxes tied to the estate.
                    </div>
                  </div>
                </CustomAlert>
              </AnimatedSection>
            </div>
            <br />
            <AnimatedSection as='p' className='text-lg-start me-lg-5'>
              These expenses can be significant, and are{' '}
              <span className='text-warning roboto-regular-italic'>
                usually required to be paid before the inheritance is paid out
                to the beneficiaries.
              </span>
              <br />
              <br />
              So, you might find yourself in a tight financial spot, needing
              funds that are effectively locked away in the probate process.
            </AnimatedSection>
            <br />
            <AnimatedSection as='p' className='text-lg-end ms-lg-5'>
              This is where probate advancements can prove to be a lifeline.
            </AnimatedSection>
            <br />
            <AnimatedSection className='text-center mx-lg-5 '>
              <CustomAlert backgroundColor='warning-subtle'>
                By effectively providing access to the inheritance before the
                probate process concludes, these advancements can alleviate the
                financial strain and allow for necessary expenses to be covered.
              </CustomAlert>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoAreProbateLoansFor;

// import React from 'react';
// import CustomAlert from '../Generic/CustomAlert';

// const WhoAreProbateLoansFor = () => {
//   return (
//     <div className='whatIsProbate'>
//       <div className='card-body'>
//         <div className='mt-5 roboto-medium text-primary-emphasis'>
//           <div className='text'>
//             <div className='roboto-regular text-center mx-lg-5'>
//               <CustomAlert backgroundColor='info'>
//                 Probate advancements are for beneficiaries or executors of an
//                 estate.
//               </CustomAlert>
//             </div>
//             <br />
//             <p className='text-lg-start me-lg-5'>
//               As the probate process unfolds, beneficiaries and executors often
//               find themselves facing considerable financial pressure.
//               <br />
//               <br />
//               For instance:
//             </p>
//             <div className='roboto-tregular text-center mx-lg-5'>
//               <CustomAlert backgroundColor='white'>
//                 <div className='list-group'>
//                   <div className='list-group-item bg-white fancy-list-group-item text-primary border-light'>
//                     There may be immediate funeral costs to cover
//                   </div>
//                   <hr />
//                   <div className='list-group-item bg-white fancy-list-group-item text-primary border-light'>
//                     Or ongoing expenses like property maintenance for the
//                     deceased's home
//                   </div>
//                   <hr />
//                   <div className='list-group-item bg-white fancy-list-group-item text-primary border-light'>
//                     Or an executor may need to settle outstanding debts
//                   </div>
//                   <hr />
//                   <div className='list-group-item bg-white fancy-list-group-item text-primary border-light'>
//                     Or there might be inheritance taxes tied to the estate.
//                   </div>
//                 </div>
//               </CustomAlert>
//             </div>
//             <br />
//             <p className='text-lg-start me-lg-5'>
//               These expenses can be significant, and are{' '}
//               <span className='text-warning roboto-regular-italic'>
//                 usually required to be paid before the inheritance is paid out
//                 to the beneficiaries.
//               </span>
//               <br />
//               So, you might find yourself in a tight financial spot, needing
//               funds that are effectively locked away in the probate process.
//             </p>
//             <br />
//             <p className='text-lg-end ms-lg-5'>
//               This is where probate advancements can prove to be a lifeline.
//             </p>
//             <br />
//             <div className='text-center mx-lg-5'>
//               <CustomAlert backgroundColor='warning'>
//                 By effectively providing access to the inheritance before the
//                 probate process concludes, these advancements can alleviate the
//                 financial strain and allow for necessary expenses to be covered.
//               </CustomAlert>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WhoAreProbateLoansFor;
