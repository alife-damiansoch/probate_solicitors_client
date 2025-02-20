
import {
  TbPentagonNumber1,
  TbPentagonNumber2,
  TbPentagonNumber3,
} from 'react-icons/tb';
import CustomCard from '../Generic/CustomCard';
import AnimatedSection from '../../GenericFunctions/AnimatedSection'; // Adjust the import path as needed

const Benefits = () => {
  return (
    <div className='card whatIsProbate bg-white border-0'>
      <div className='card-header bg-light border-0 text-center'>
        <AnimatedSection
          as='h5'
          className='card-title title text-black roboto-medium'
        >
          The Benefits of Probate Advancements
        </AnimatedSection>
      </div>
      <div className='card-body mx-0 px-0'>
        <div className='d-flex flex-column align-items-center justify-content-evenly'>
          <AnimatedSection>
            <TbPentagonNumber1
              color='#D1EBF5'
              size={100}
              style={{ filter: 'drop-shadow(3px 3px 4px rgb(0, 0, 0))' }}
            />
          </AnimatedSection>
          <AnimatedSection
            as='h6'
            className='card-subtitle title text-primary-emphasis text-center'
          >
            No Proof of Income Required
          </AnimatedSection>
          <AnimatedSection
            as='p'
            className='card-text text text-primary-emphasis'
          >
            Most loans are based on your financial history and income, which
            isn’t always favourable for everyone. <br />
            <br />
            But as you&#39;re taking an advance against the estate there is no need
            to look at your income to gauge if you&#39;d be able to afford
            repayments.
          </AnimatedSection>
        </div>
        <hr />
        <div className='d-flex flex-column align-items-center justify-content-evenly'>
          <AnimatedSection>
            <TbPentagonNumber2
              color='#D1EBF5'
              size={100}
              style={{ filter: 'drop-shadow(3px 3px 4px rgb(0, 0, 0))' }}
            />
          </AnimatedSection>
          <AnimatedSection
            as='h6'
            className='card-subtitle title text-primary-emphasis text-center'
          >
            No Monthly Repayments
          </AnimatedSection>
          <AnimatedSection
            as='p'
            className='card-text text text-primary-emphasis'
          >
            Traditional loans also typically require regular payments to repay
            the borrowed sum and interest, which can be a strain on your
            finances. <br />
            <br /> With probate advancements, there are no monthly repayments.
            It&#39;s all repaid directly from the estate once the probate process
            concludes.
          </AnimatedSection>
        </div>
        <hr />
        <div className='d-flex flex-column align-items-center justify-content-evenly'>
          <AnimatedSection>
            <TbPentagonNumber3
              color='#D1EBF5'
              size={100}
              style={{ filter: 'drop-shadow(3px 3px 4px rgb(0, 0, 0))' }}
            />
          </AnimatedSection>
          <AnimatedSection
            as='h6'
            className='card-subtitle title text-primary-emphasis text-center'
          >
            Repayment Made Directly from the Estate
          </AnimatedSection>
          <AnimatedSection className='card-text text text-primary-emphasis'>
            <strong>This method of repayment provides two key benefits:</strong>
            <div className='row text-center '>
              <AnimatedSection
                as='div'
                className='col-12 col-md-6  mx-auto my-auto'
              >
                <CustomCard
                  backgroundColor='info-subtle'
                  shape='rectangle'
                  width='100%'
                  height='100%'
                >
                  It eliminates personal liability for the advance, meaning if
                  the estate&#39;s value falls short you aren&#39;t personally
                  responsible for repaying the difference.
                </CustomCard>
              </AnimatedSection>

              <AnimatedSection
                as='div'
                className='col-12 col-md-6  mx-auto my-auto'
              >
                <CustomCard
                  backgroundColor='info-subtle'
                  shape='rectangle'
                  width='100%'
                  height='100%'
                >
                  It ensures the advance doesn&#39;t impact your personal finance or
                  credit score in any way - it&#39;s linked solely to the estate.
                </CustomCard>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Benefits;

// import React from 'react';
// import {
//   TbPentagonNumber1,
//   TbPentagonNumber2,
//   TbPentagonNumber3,
// } from 'react-icons/tb';
// import CustomCard from '../Generic/CustomCard';

// const Benefits = () => {
//   return (
//     <div className='card whatIsProbate bg-white border-0'>
//       <div className='card-header bg-light border-0 text-center'>
//         <h5 className='card-title title text-black roboto-medium'>
//           The Benefits of Probate Advancements
//         </h5>
//       </div>
//       <div className='card-body'>
//         <div className='d-flex flex-column align-items-center justify-content-evenly'>
//           <TbPentagonNumber1
//             color='#62C462'
//             size={100}
//             style={{ filter: 'drop-shadow(3px 3px 4px rgb(0, 0, 0))' }}
//           />
//           <h6 className='card-subtitle title text-primary-emphasis text-center'>
//             No Proof of Income Required
//           </h6>
//           <p className='card-text text text-primary-emphasis'>
//             Most loans are based on your financial history and income, which
//             isn’t always favourable for everyone. <br />
//             <br />
//             But as you're taking an advance against the estate there is no need
//             to look at your income to gauge if you'd be able to afford
//             repayments.
//           </p>
//         </div>
//         <hr />
//         <div className='d-flex flex-column align-items-center justify-content-evenly'>
//           <TbPentagonNumber2
//             color='#62C462'
//             size={100}
//             style={{ filter: 'drop-shadow(3px 3px 4px rgb(0, 0, 0))' }}
//           />
//           <h6 className='card-subtitle title text-primary-emphasis  text-center'>
//             No Monthly Repayments
//           </h6>
//           <p className='card-text text text-primary-emphasis'>
//             Traditional loans also typically require regular payments to repay
//             the borrowed sum and interest, which can be a strain on your
//             finances. <br />
//             <br /> With probate advancements, there are no monthly repayments.
//             It's all repaid directly from the estate once the probate process
//             concludes.
//           </p>
//         </div>
//         <hr />
//         <div className='d-flex flex-column align-items-center justify-content-evenly'>
//           <TbPentagonNumber3
//             color='#62C462'
//             size={100}
//             style={{ filter: 'drop-shadow(3px 3px 4px rgb(0, 0, 0))' }}
//           />
//           <h6 className='card-subtitle title text-primary-emphasis  text-center'>
//             Repayment Made Directly from the Estate
//           </h6>
//           <div className='card-text text text-primary-emphasis'>
//             <strong>This method of repayment provides two key benefits:</strong>{' '}
//             <div className='row d-flex align-items-center justify-content-evenly'>
//               <div className='col-lg-5 my-2'>
//                 <CustomCard
//                   backgroundColor='success'
//                   shape='rectangle'
//                   width='100%'
//                   height='100%'
//                 >
//                   It eliminates personal liability for the advance, meaning if
//                   the estate's value falls short you aren't personally
//                   responsible for repaying the difference.
//                 </CustomCard>
//               </div>
//               <div className='col-lg-5 my-2'>
//                 <CustomCard
//                   backgroundColor='success'
//                   shape='rectangle'
//                   width='100%'
//                   height='100%'
//                 >
//                   It ensures the advance doesn't impact your personal finance or
//                   credit score in any way - it's linked solely to the estate.
//                 </CustomCard>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Benefits;
