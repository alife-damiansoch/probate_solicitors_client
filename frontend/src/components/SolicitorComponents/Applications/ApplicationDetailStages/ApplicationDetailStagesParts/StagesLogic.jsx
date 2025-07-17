// ApplicationDetailStagesParts/StagesLogic.js

export const getTimelineSteps = ({
  application,
  estates,
  estatesLoading,
  documents,
  requirements,
  requirementStatus,
  documentsLoading,
  getDocumentsAnalysis,
  getEstateItemsCount,
  currency_sign,
  advancement, // Add advancement parameter
}) => {
  const estateValue =
    parseFloat(application.value_of_the_estate_after_expenses) || 0;
  const documentsAnalysis = getDocumentsAnalysis();

  // Helper function to safely convert to number
  const toNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Calculate estate totals and validate advance
  const calculateEstateAndValidateAdvance = () => {
    console.log('=== ESTATE CALCULATION DEBUG ===');
    console.log('Raw estates data:', estates);
    console.log('Estates type:', typeof estates);
    console.log('Estates is array:', Array.isArray(estates));
    console.log('Application amount:', application.amount);

    // Handle different estate data structures
    let estateArray = [];

    if (Array.isArray(estates)) {
      estateArray = estates;
    } else if (estates && typeof estates === 'object') {
      // If estates is an object with categories, flatten it
      estateArray = Object.values(estates).flat();
    }

    console.log('Estate array after processing:', estateArray);
    console.log('Estate array length:', estateArray.length);

    if (!estateArray || estateArray.length === 0) {
      console.log('No estates found, returning default values');
      return {
        totalAssets: 0,
        totalLiabilities: 0,
        totalLendableAssets: 0,
        totalNonLendableAssets: 0,
        netIrishEstate: 0,
        lendableIrishEstate: 0,
        maximumAdvance: 0,
        applicationAmount: toNumber(application.amount),
        requestedAdvance: toNumber(application.amount) / 2,
        isAdvanceExceeded: false,
        advanceExcessAmount: 0,
        advanceUtilization: 0,
      };
    }

    // Filter and log estate types
    const assets = estateArray.filter((estate) => estate.is_asset === true);
    const liabilities = estateArray.filter(
      (estate) => estate.is_asset === false
    );

    console.log('Assets found:', assets.length, assets);
    console.log('Liabilities found:', liabilities.length, liabilities);

    // Categorize assets by lendable property
    const lendableAssets = assets.filter((estate) => estate.lendable === true);
    const nonLendableAssets = assets.filter(
      (estate) => estate.lendable === false
    );

    console.log('Lendable assets:', lendableAssets.length, lendableAssets);
    console.log(
      'Non-lendable assets:',
      nonLendableAssets.length,
      nonLendableAssets
    );

    // Calculate totals with logging
    const totalAssets = assets.reduce((sum, estate) => {
      const value = toNumber(estate.value);
      console.log(`Asset ${estate.id || 'unknown'}: ${value}`);
      return sum + value;
    }, 0);

    const totalLiabilities = liabilities.reduce((sum, estate) => {
      const value = toNumber(estate.value);
      console.log(`Liability ${estate.id || 'unknown'}: ${value}`);
      return sum + value;
    }, 0);

    const totalLendableAssets = lendableAssets.reduce((sum, estate) => {
      const value = toNumber(estate.value);
      console.log(`Lendable asset ${estate.id || 'unknown'}: ${value}`);
      return sum + value;
    }, 0);

    const totalNonLendableAssets = nonLendableAssets.reduce((sum, estate) => {
      const value = toNumber(estate.value);
      console.log(`Non-lendable asset ${estate.id || 'unknown'}: ${value}`);
      return sum + value;
    }, 0);

    const netIrishEstate = totalAssets - totalLiabilities;
    const lendableIrishEstate = totalLendableAssets - totalLiabilities;
    const maximumAdvance = Math.max(0, lendableIrishEstate * 0.5);

    console.log('=== CALCULATION RESULTS ===');
    console.log('Total Assets:', totalAssets);
    console.log('Total Liabilities:', totalLiabilities);
    console.log('Total Lendable Assets:', totalLendableAssets);
    console.log('Net Irish Estate:', netIrishEstate);
    console.log('Lendable Irish Estate:', lendableIrishEstate);
    console.log('Maximum Advance (50%):', maximumAdvance);

    // Get application amount and validate
    const applicationAmount = toNumber(application.amount);
    const requestedAdvance = applicationAmount;
    const isAdvanceExceeded = requestedAdvance > maximumAdvance;
    const advanceExcessAmount = Math.max(0, requestedAdvance - maximumAdvance);

    console.log('=== ADVANCE VALIDATION ===');
    console.log('Application Amount:', applicationAmount);
    console.log('Requested Advance (50%):', requestedAdvance);
    console.log('Maximum Advance:', maximumAdvance);
    console.log('Is Advance Exceeded:', isAdvanceExceeded);
    console.log('Excess Amount:', advanceExcessAmount);
    console.log('=== END DEBUG ===');

    return {
      totalAssets,
      totalLiabilities,
      totalLendableAssets,
      totalNonLendableAssets,
      netIrishEstate,
      lendableIrishEstate,
      maximumAdvance,
      applicationAmount,
      requestedAdvance,
      isAdvanceExceeded,
      advanceExcessAmount,
      advanceUtilization:
        maximumAdvance > 0 ? (requestedAdvance / maximumAdvance) * 100 : 0,
    };
  };

  const estateCalculations = calculateEstateAndValidateAdvance();

  // Check if any estate category has items - updated logic
  const hasEstateItems = (() => {
    if (Array.isArray(estates)) {
      return estates.length > 0;
    } else if (estates && typeof estates === 'object') {
      return Object.values(estates).some(
        (category) => Array.isArray(category) && category.length > 0
      );
    }
    return false;
  })();

  console.log('Has estate items:', hasEstateItems);

  const estateValueComplete = hasEstateItems;
  const solicitorAssigned = application.solicitor !== null;

  // Split Application Submitted into Basic Details and Applicants
  const amountValid = application.amount && parseFloat(application.amount) > 0;
  const deceasedValid =
    application.deceased &&
    application.deceased.first_name &&
    application.deceased.first_name.trim() !== '' &&
    application.deceased.last_name &&
    application.deceased.last_name.trim() !== '';

  const basicDetailsComplete = amountValid && deceasedValid;

  const applicantsValid =
    application.applicants && application.applicants.length > 0;

  const processingStatusComplete =
    application.processing_status?.application_details_completed_confirmed ||
    false;

  // Documents step configuration
  const getDocumentsStepConfig = () => {
    if (documentsLoading) {
      return {
        completed: false,
        actionRequired: false,
        progress: 20,
        description: 'Loading documents and requirements...',
        detailDescription: 'Fetching current status from server',
        issueCount: 0,
        actionText: null,
      };
    }

    console.log('ESTATES: ', estates);

    switch (documentsAnalysis.status) {
      case 'waiting':
        return {
          completed: false,
          actionRequired: false,
          progress: 10,
          description: 'Awaiting document assignment',
          detailDescription:
            'Documents and requirements will be assigned once details are confirmed by your agent',
          issueCount: 0,
          actionText: null,
        };
      case 'requirements_pending':
        return {
          completed: false,
          actionRequired: true,
          progress: 40,
          description: `${documentsAnalysis.missingRequirements} of ${documentsAnalysis.totalRequirements} requirements missing`,
          detailDescription: `Upload required documents: ${documentsAnalysis.uploadedRequirements} completed, ${documentsAnalysis.missingRequirements} remaining`,
          issueCount: documentsAnalysis.missingRequirements,
          actionText: 'Upload Missing Requirements',
        };
      case 'signatures_pending':
        return {
          completed: false,
          actionRequired: true,
          progress: 70,
          description: `${documentsAnalysis.pendingSignatures} documents awaiting signature`,
          detailDescription: `${documentsAnalysis.signedDocuments} documents signed, ${documentsAnalysis.pendingSignatures} pending signature`,
          issueCount: documentsAnalysis.pendingSignatures,
          actionText: 'Sign Pending Documents',
        };
      case 'complete':
        return {
          completed: true,
          actionRequired: false,
          progress: 100,
          description: 'All documents and requirements complete',
          detailDescription: documentsAnalysis.hasRequirements
            ? `${documentsAnalysis.totalRequirements} requirements fulfilled • ${documentsAnalysis.signedDocuments} documents signed`
            : `${documentsAnalysis.totalDocuments} documents processed and signed`,
          issueCount: 0,
          actionText: null,
        };
      default:
        return {
          completed: false,
          actionRequired: false,
          progress: 0,
          description: 'Processing pending',
          detailDescription: 'Waiting for system processing',
          issueCount: 0,
          actionText: null,
        };
    }
  };

  const documentsConfig = getDocumentsStepConfig();

  // Log final estate assessment status
  console.log('=== ESTATE ASSESSMENT STATUS ===');
  console.log('Estate Value Complete:', estateValueComplete);
  console.log('Advance Exceeded:', estateCalculations.isAdvanceExceeded);
  console.log(
    'Should show error:',
    estateValueComplete && estateCalculations.isAdvanceExceeded
  );

  // Create base steps
  const baseSteps = [
    // 1. Application Information Submitted (Basic Details)
    {
      id: 'basic_details',
      title: 'Application Information',
      sectionId: 'basic_details',
      icon: 'document',
      completed: basicDetailsComplete,
      actionRequired: !basicDetailsComplete,
      progress: basicDetailsComplete ? 100 : 40,
      description: basicDetailsComplete
        ? 'Basic application details complete'
        : 'Missing basic application information',
      detailDescription: basicDetailsComplete
        ? `Amount: ${currency_sign}${parseFloat(
            application.amount || 0
          ).toLocaleString()} • Deceased: ${
            application.deceased?.first_name || ''
          } ${application.deceased?.last_name || ''}`
        : 'Complete application amount and deceased person information',
      issueCount: basicDetailsComplete ? 0 : 1,
      actionText: basicDetailsComplete ? null : 'Complete Basic Details',
    },

    // 2. Applicant Registration
    {
      id: 'applicant_registration',
      title: 'Applicant Registration',
      sectionId: 'applicant_registration',
      icon: 'userPlus',
      completed: applicantsValid,
      actionRequired: !applicantsValid && basicDetailsComplete,
      progress: applicantsValid ? 100 : basicDetailsComplete ? 60 : 0,
      description: applicantsValid
        ? `${application.applicants?.length || 0} applicant(s) registered`
        : 'No applicants registered',
      detailDescription: applicantsValid
        ? `Successfully registered ${
            application.applicants?.length || 0
          } applicant(s) with complete information and contact details`
        : 'Register at least one applicant who will be responsible for the probate application process',
      issueCount: applicantsValid ? 0 : basicDetailsComplete ? 1 : 0,
      actionText: applicantsValid ? null : 'Add Applicant Details',
    },

    // 3. Legal Representation Assignment
    {
      id: 'legal_representation',
      title: 'Legal Representation',
      sectionId: 'legal_representation',
      icon: 'user',
      completed: solicitorAssigned,
      actionRequired: !solicitorAssigned && applicantsValid,
      progress: solicitorAssigned ? 100 : applicantsValid ? 60 : 0,
      description: solicitorAssigned
        ? `Assigned to ${application.solicitor?.name || 'Legal Representative'}`
        : 'Awaiting legal representative assignment',
      detailDescription: solicitorAssigned
        ? `Legal representative ${
            application.solicitor?.name || 'assigned successfully'
          }. Case management and client communication can now proceed.`
        : 'Assign a qualified legal representative from the available pool to handle this case and begin processing.',
      issueCount: solicitorAssigned ? 0 : applicantsValid ? 1 : 0,
      actionText: solicitorAssigned ? null : 'Contact Support for Assignment',
    },

    // 4. Estate Valuation & Assessment (Modified with advance validation)
    {
      id: 'estate_assessment',
      title: 'Estate Assessment',
      sectionId: 'estate_assessment',
      icon: 'home',
      completed: estateValueComplete && !estateCalculations.isAdvanceExceeded,
      actionRequired:
        (!estateValueComplete || estateCalculations.isAdvanceExceeded) &&
        solicitorAssigned,
      progress: (() => {
        if (!estateValueComplete) {
          return solicitorAssigned ? 40 : 0;
        }
        if (estateCalculations.isAdvanceExceeded) {
          return 80; // Complete but has error
        }
        return 100; // Complete and valid
      })(),
      description: (() => {
        if (!estateValueComplete) {
          return estatesLoading
            ? 'Loading estate information...'
            : 'Estate valuation required';
        }
        if (estateCalculations.isAdvanceExceeded) {
          return `Advance limit exceeded by ${currency_sign}${estateCalculations.advanceExcessAmount.toLocaleString()}`;
        }
        return `Estate value: ${currency_sign}${
          estateValue > 0 ? estateValue.toLocaleString() : 'Assessed'
        }`;
      })(),
      detailDescription: (() => {
        if (!estateValueComplete) {
          return 'Provide comprehensive estate valuation including all assets, properties, and personal items for accurate processing.';
        }
        if (estateCalculations.isAdvanceExceeded) {
          return `Requested advance (${currency_sign}${estateCalculations.requestedAdvance.toLocaleString()}) exceeds maximum allowable advance (${currency_sign}${estateCalculations.maximumAdvance.toLocaleString()}). Please adjust the estate valuation to include additional lendable assets or reduce the requested amount to proceed.`;
        }
        return `${getEstateItemsCount()} estate items catalogued • Comprehensive valuation complete • Maximum advance available: ${currency_sign}${estateCalculations.maximumAdvance.toLocaleString()}`;
      })(),
      issueCount: (() => {
        if (!estateValueComplete) {
          return solicitorAssigned ? 1 : 0;
        }
        if (estateCalculations.isAdvanceExceeded) {
          return 1;
        }
        return 0;
      })(),
      actionText: (() => {
        if (!estateValueComplete) {
          return 'Complete Estate Valuation';
        }
        if (estateCalculations.isAdvanceExceeded) {
          return 'Adjust Estate Valuation or Application Amount';
        }
        return null;
      })(),
    },

    // 5. Information Verification
    {
      id: 'information_verification',
      title: 'Information Verification',
      sectionId: 'information_verification',
      icon: 'check',
      completed: processingStatusComplete,
      actionRequired:
        !processingStatusComplete &&
        estateValueComplete &&
        !estateCalculations.isAdvanceExceeded,
      progress: processingStatusComplete
        ? 100
        : estateValueComplete && !estateCalculations.isAdvanceExceeded
        ? 70
        : 0,
      description: processingStatusComplete
        ? 'Verified by legal representative'
        : 'Awaiting verification by legal representative',
      detailDescription: processingStatusComplete
        ? 'All application details have been reviewed and verified by your assigned agent. You can now proceed to the next stage.'
        : 'Your assigned agent will review all provided details for accuracy and completeness. Contact your agent to expedite this process.',
      issueCount: processingStatusComplete
        ? 0
        : estateValueComplete && !estateCalculations.isAdvanceExceeded
        ? 1
        : 0,
      actionText: processingStatusComplete
        ? null
        : 'Contact Representative for Review',
    },

    // 6. Documentation & Requirements
    {
      id: 'documentation_requirements',
      title: 'Documentation & Requirements',
      sectionId: 'documentation_requirements',
      icon:
        documentsAnalysis.status === 'complete'
          ? 'checkCircle'
          : documentsAnalysis.status === 'waiting'
          ? 'clock'
          : documentsAnalysis.status === 'requirements_pending'
          ? 'upload'
          : 'signature',
      completed: documentsConfig.completed,
      actionRequired:
        documentsConfig.actionRequired && processingStatusComplete,
      progress: documentsConfig.progress,
      description: documentsConfig.description,
      detailDescription: documentsConfig.detailDescription,
      issueCount: documentsConfig.issueCount,
      actionText: documentsConfig.actionText,
    },

    // 7. Final Review & Approval (Updated with Finance Check Stage)
    {
      id: 'final_review',
      title: 'Final Review & Approval',
      sectionId: 'final_review',
      icon: application.is_rejected
        ? 'x'
        : application.approved
        ? application.loan?.needs_committee_approval
          ? application.loan?.is_committee_approved === true
            ? application.loan?.is_paid_out && application.loan?.paid_out_date
              ? 'checkCircle'
              : application.loan?.is_paid_out &&
                !application.loan?.paid_out_date
              ? 'dollarSign' // Finance team reviewing
              : 'creditCard'
            : application.loan?.is_committee_approved === false
            ? 'x'
            : 'users'
          : application.loan?.is_paid_out && application.loan?.paid_out_date
          ? 'checkCircle'
          : application.loan?.is_paid_out && !application.loan?.paid_out_date
          ? 'dollarSign' // Finance team reviewing
          : 'creditCard'
        : 'search',
      completed: (() => {
        if (application.is_rejected) return true;
        if (!application.approved) return false;
        if (application.loan?.needs_committee_approval) {
          if (
            application.loan?.is_committee_approved === null ||
            application.loan?.is_committee_approved === undefined
          )
            return false;
          if (application.loan?.is_committee_approved === false) return true;
          if (application.loan?.is_committee_approved === true) {
            if (!application.loan?.is_paid_out) return false;
            if (
              application.loan?.is_paid_out &&
              !application.loan?.paid_out_date
            )
              return false; // Finance check pending
            return true; // Actually paid out
          }
        } else {
          if (!application.loan?.is_paid_out) return false;
          if (application.loan?.is_paid_out && !application.loan?.paid_out_date)
            return false; // Finance check pending
          return true; // Actually paid out
        }
        return false;
      })(),
      actionRequired: false,
      progress: (() => {
        if (application.is_rejected) return 100;
        if (!application.approved) return 80;
        if (application.loan?.needs_committee_approval) {
          if (
            application.loan?.is_committee_approved === null ||
            application.loan?.is_committee_approved === undefined
          )
            return 85;
          if (application.loan?.is_committee_approved === false) return 100;
          if (application.loan?.is_committee_approved === true) {
            if (!application.loan?.is_paid_out) return 92;
            if (
              application.loan?.is_paid_out &&
              !application.loan?.paid_out_date
            )
              return 96; // Finance check
            return 100; // Actually paid out
          }
        } else {
          if (!application.loan?.is_paid_out) return 92;
          if (application.loan?.is_paid_out && !application.loan?.paid_out_date)
            return 96; // Finance check
          return 100; // Actually paid out
        }
        return 80;
      })(),
      description: (() => {
        if (application.is_rejected) return 'Application rejected';
        if (!application.approved) return 'Under final review';
        if (application.loan?.needs_committee_approval) {
          if (
            application.loan?.is_committee_approved === null ||
            application.loan?.is_committee_approved === undefined
          )
            return 'Awaiting committee approval';
          if (application.loan?.is_committee_approved === false)
            return 'Committee rejected';
          if (application.loan?.is_committee_approved === true) {
            if (!application.loan?.is_paid_out) return 'Awaiting payment';
            if (
              application.loan?.is_paid_out &&
              !application.loan?.paid_out_date
            )
              return 'Finance team final check';
            return 'Advancement complete';
          }
        } else {
          if (!application.loan?.is_paid_out) return 'Awaiting payment';
          if (application.loan?.is_paid_out && !application.loan?.paid_out_date)
            return 'Finance team final check';
          return 'Advancement complete';
        }
        return 'Under final review';
      })(),
      detailDescription: (() => {
        if (application.is_rejected)
          return 'Your application has been rejected. Contact your agent for details and next steps.';
        if (!application.approved)
          return 'Your application is under final review by our processing team. You will be notified of the decision soon.';
        if (application.loan?.needs_committee_approval) {
          if (
            application.loan?.is_committee_approved === null ||
            application.loan?.is_committee_approved === undefined
          )
            return 'Your application has been approved and is now pending committee review. You will be notified once a decision has been made.';
          if (application.loan?.is_committee_approved === false)
            return 'Your application was not approved by the committee. Please contact your agent for further details.';
          if (application.loan?.is_committee_approved === true) {
            if (!application.loan?.is_paid_out)
              return 'Your application has passed all approvals and is now awaiting payment. Your assigned agent will contact you with further details.';
            if (
              application.loan?.is_paid_out &&
              !application.loan?.paid_out_date
            )
              return 'Your application has been approved for payout and our finance team is conducting a final compliance check to ensure all requirements have been met. Payment will be processed once this review is complete.';
            return 'Your application has been fully processed and payment has been issued. The advancement process is now complete. Once the probate process is finalised, please notify your agent so that settlement arrangements can be made. If you require any documentation or further assistance in the meantime, please contact your agent.';
          }
        } else {
          if (!application.loan?.is_paid_out)
            return 'Your application has been approved and is now awaiting payment. Your assigned agent will contact you with further details.';
          if (application.loan?.is_paid_out && !application.loan?.paid_out_date)
            return 'Your application has been approved for payout and our finance team is conducting a final compliance check to ensure all requirements have been met. Payment will be processed once this review is complete.';
          return 'Your advancement has been fully processed and the application is now complete. If you require any documentation or further support, please contact your agent.';
        }
        return 'Your application is under final review by our processing team. You will be notified of the decision soon.';
      })(),
      issueCount:
        application.is_rejected ||
        (application.loan?.needs_committee_approval &&
          application.loan?.is_committee_approved === false)
          ? 1
          : 0,
      actionText:
        application.is_rejected ||
        (application.loan?.needs_committee_approval &&
          application.loan?.is_committee_approved === false)
          ? 'Contact Legal Representative'
          : null,
    },
  ];

  // Conditionally add Advancement Details step at the beginning if advancement exists
  if (advancement && advancement.id) {
    const advancementStep = {
      id: 'advancement_details',
      title: 'Advancement Details',
      sectionId: 'advancement_details',
      icon: 'money',
      completed: true, // Always completed since advancement exists
      actionRequired: false,
      progress: 100,
      description: advancement.is_settled
        ? `Advancement settled • ID: ${advancement.id}`
        : `Active advancement • ID: ${advancement.id}`,
      detailDescription: advancement.is_settled
        ? `Settlement completed. Total amount: ${currency_sign}${(advancement?.loanbook_data?.total_due).toLocaleString()}`
        : `Advancement approved and active. Current balance: ${currency_sign}${advancement?.loanbook_data?.total_due?.toLocaleString()}`,
      issueCount: 0,
      actionText: null,
    };

    // Insert at the beginning
    return [advancementStep, ...baseSteps];
  }

  return baseSteps;
};
