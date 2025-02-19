export const submittedInfo = {
  header: 'Application Submitted',
  message: `
      <p>Your application has been successfully uploaded. <br /><br /><span style="color:green; font-size: 1.2em;">Thank you for your submission!</span></p>
      <p>Please ensure that all sections of the application are completed as follows:</p>
      <ol style="padding-left: 20px;">
        <li><span style="font-weight: bold; color:red">Basic Details Section</span> – All fields must be filled in, except for the "Dispute" field, which is optional.</li><br />
        <li><span style="font-weight: bold; color:red">Applicants Section</span> – At least one applicant must be added.</li><br />
        <li><span style="font-weight: bold; color:red">Estates Section</span> – At least one estate under the probate process must be included.</li><br />
      </ol>
      <p>Once these sections are completed, you can proceed with the next steps.<br /> For further assistance, please review the next steps in your application dashboard or contact our office.</p>
      <p style="font-weight: bold; color: #007bff;"> Click here 👆 to highlight and scroll to the <strong>Basic Details Section</strong>.</p>
    `,
};

export const documentsInfo = {
  header: 'Uploading Documents',
  message: `
      <p>There are two types of document uploads:</p>
      <p>For all general documents, please click the <span style="font-weight: bold; color:red">Add Documents</span> button in the <span style="font-weight: bold; color:red">Uploaded Documents </span> section.</p>
      <p>To upload a signed:<br /> 
         <strong>UNDERTAKING</strong> or<br /> 
         <strong>ADVANCEMENT AGREEMENT</strong>,<br /> 
         hover over the relevant section above for further instructions.</p>
      <p style="font-weight: bold; color: #007bff;">
          Click here 👆 to highlight and scroll to the <strong>Uploaded Documents Section</strong>.
      </p>`,
};

export const solicitorInfo = {
  header: 'Solicitor Assignment Required',
  message: `
      <p>A solicitor must be assigned to the application.</p>
      <p>If the solicitor is already added to the firm, they can be selected from the list in the <span style="font-weight: bold; color:red">Assigned Solicitors</span> section.</p>
      <p>If this is a new solicitor, click the <span style="font-weight: bold; color:red">Add or Edit Solicitors</span> button in the same section and add the solicitor there.</p>
      <p style="font-weight: bold; color: #007bff;"> Click here 👆 to highlight and scroll to the <strong>Assigned Solicitor Section</strong>.</p>
    `,
};

export const advancementAgreementsInfo = {
  header: 'Uploading Advancement Agreements',
  message: `
    <p>Uploading advancement agreements is a two-stage process:</p>
    <ol>
       <li>Click the <span style="font-weight: bold; color:red">Generate Required Documents</span> button in the <span  style="font-weight: bold; color:red">Uploaded Documents</span> section and select <span style="font-weight: bold; color:red">Generate Advancement Agreement</span>. 
        <br />The document will be generated automatically with no additional details needed.</li><br />
      <br /><br />If there is more than one applicant, multiple documents will be generated and downloaded as a ZIP file. Please extract the ZIP file, and upload and sign each document for each applicant.</li><br />
      <li>To upload an Advancement Agreement, click the <br /><span style="font-weight: bold; color:red">Add and Sign Documents</span><br /> button in the <span style="font-weight: bold; color:red">Uploaded Documents</span> Section, select <br /><span style="font-weight: bold; color:red">Advancement Agreement</span>,<br /> and follow the on-screen instructions.</li>
    </ol>
    <p style="font-weight: bold; color: #007bff;">Click here 👆 to highlight and scroll to the <strong>Uploaded Documents Section</strong>.</p>
  `,
};

export const undertakingAgreementsInfo = {
  header: 'Uploading Solicitor Undertaking',
  message: `
        
      <p>Uploading solicitor undertaking is a two-stage process:</p>
      <ol>
        <li>Click the <span style="font-weight: bold; color:red">Generate Required Documents</span> button in the <span  style="font-weight: bold; color:red">Uploaded Documents</span> section and select <span style="font-weight: bold; color:red">Generate Undertaking Document</span>. 
        <br />The document will be generated automatically with no additional details needed.</li><br />
        <li>After this, click the <span style="font-weight: bold; color:red">Add and Sign Documents</span> button, select <span style="font-weight: bold; color:red">Solicitor Undertaking</span>, and follow the on-screen instructions.</li>
      </ol>
       <p style="font-weight: bold; color: #007bff;">Click here 👆 to highlight and scroll to the <strong>Uploaded Documents Section</strong>.</p>
    `,
};

export const awaitingDecissionInfo = {
  header: 'Application Approval Process',
  message: `
      <p>Please ensure that all the steps outlined above are completed.</p>
      <p>Once they are, a decision regarding the application's approval will be made, and our agent will contact you as soon as possible.</p>
    `,
};

export const awaitingCommitteeDecisionInfo = {
  header: 'Application Approval Process',
  message: `
      <p>Due to the application amount exceeding the approval threshold, this application must be reviewed and approved by the committee.</p>
      <p>Once all requirements are met, a decision regarding the application's approval will be made, and our agent will contact you as soon as possible.</p>
    `,
};

export const rejectedInfo = {
  header: 'Application Rejection Notice',
  message: `
      <p>The application has been rejected.<br /><br /> For more information, please contact our office.</p>
    `,
};

export const rejectedByCommitteeInfo = {
  header: 'Application Rejection Notice',
  message: `
        <p>The application has been rejected.<br /><br /> For more information, please contact our office.</p>
      `,
};

export const approvedInfo = {
  header: 'Application Approved',
  message: `
      <p>Your application has been approved.</p>
      <p>Our agent will contact you shortly with the next steps.</p>
    `,
};

export const approvedByCommitteeInfo = {
  header: 'Application Approved by Committee',
  message: `
      <p>Your application has been reviewed and approved by the committee.</p>
      <p>Our agent will contact you shortly with further details and next steps.</p>
    `,
};
