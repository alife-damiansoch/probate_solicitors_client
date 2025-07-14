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

  // Check if any estate category has items
  const hasEstateItems =
    estates && typeof estates === 'object'
      ? Object.values(estates).some(
          (category) => Array.isArray(category) && category.length > 0
        )
      : false;

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

    console.log('ADVANCEMENT: ', advancement);

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

    // 4. Estate Valuation & Assessment
    {
      id: 'estate_assessment',
      title: 'Estate Assessment',
      sectionId: 'estate_assessment',
      icon: 'home',
      completed: estateValueComplete,
      actionRequired: !estateValueComplete && solicitorAssigned,
      progress: estateValueComplete ? 100 : solicitorAssigned ? 40 : 0,
      description: estateValueComplete
        ? `Estate value: ${currency_sign}${
            estateValue > 0 ? estateValue.toLocaleString() : 'Assessed'
          }`
        : estatesLoading
        ? 'Loading estate information...'
        : 'Estate valuation required',
      detailDescription: estateValueComplete
        ? `${getEstateItemsCount()} estate items catalogued • Comprehensive valuation complete`
        : 'Provide comprehensive estate valuation including all assets, properties, and personal items for accurate processing.',
      issueCount: estateValueComplete ? 0 : solicitorAssigned ? 1 : 0,
      actionText: estateValueComplete ? null : 'Complete Estate Valuation',
    },

    // 5. Information Verification
    {
      id: 'information_verification',
      title: 'Information Verification',
      sectionId: 'information_verification',
      icon: 'check',
      completed: processingStatusComplete,
      actionRequired: !processingStatusComplete && estateValueComplete,
      progress: processingStatusComplete ? 100 : estateValueComplete ? 70 : 0,
      description: processingStatusComplete
        ? 'Verified by legal representative'
        : 'Awaiting verification by legal representative',
      detailDescription: processingStatusComplete
        ? 'All application details have been reviewed and verified by your assigned agent. You can now proceed to the next stage.'
        : 'Your assigned agent will review all provided details for accuracy and completeness. Contact your agent to expedite this process.',
      issueCount: processingStatusComplete ? 0 : estateValueComplete ? 1 : 0,
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
