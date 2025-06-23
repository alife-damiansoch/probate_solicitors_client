import Cookies from 'js-cookie';
import 'react';
import { UAParser } from 'ua-parser-js';
import { fetchData } from './AxiosGenericFunctions';

const renderErrors = (errors) => {
  const errorElements = [];

  const processError = (key, error) => {
    if (Array.isArray(error)) {
      error.forEach((message, index) => {
        if (typeof message === 'object' && message !== null) {
          processError(`${key}[${index}]`, message);
        } else {
          errorElements.push(
            <p key={`${key}-${index}`} className='mt-3'>
              {` ${message}`}
            </p>
          );
        }
      });
    } else if (typeof error === 'object' && error !== null) {
      Object.keys(error).forEach((subKey) => {
        processError(`${key}.${subKey}`, error[subKey]);
      });
    } else {
      errorElements.push(
        <p key={key} className=' mt-3'>
          {`${error}`}
        </p>
      );
    }
  };

  if (errors && typeof errors === 'object') {
    Object.keys(errors).forEach((key) => {
      processError(key, errors[key]);
    });
  }

  return errorElements;
};

export default renderErrors;

export const formatDate = (dateString) => {
  if (!dateString || dateString === null) {
    return 'Pending...';
  }

  const date = new Date(dateString);

  // Check if the date is invalid or is the Unix epoch (01/01/1970)
  if (isNaN(date.getTime()) || date.getTime() === 0) {
    return <span className=' text-warning'>'Pending...'</span>;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const getPublicIp = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching public IP address:', error);
    return null; // Return null if the IP fetching fails
  }
};

export const getDeviceInfo = () => {
  const parser = new UAParser();
  const deviceInfo = parser.getResult();
  const deviceDetails = parser.getDevice();
  console.log(deviceInfo);
  console.log(deviceDetails);

  return {
    user_agent: deviceInfo.ua, // Complete User-Agent string
    browser_name: deviceInfo.browser.name || 'Unknown',
    browser_version: deviceInfo.browser.version || 'Unknown',
    device_model: deviceInfo.device.model || 'Unknown',
    device_type: deviceInfo.device.type || 'Unknown', // Can be 'mobile', 'tablet', 'desktop'
    device_vendor: deviceInfo.device.vendor || 'Unknown',
    os_name: deviceInfo.os.name || 'Unknown',
    os_version: deviceInfo.os.version || 'Unknown',
    cpu_architecture: deviceInfo.cpu.architecture || 'Unknown',
    screen_resolution: `${window.screen.width}x${window.screen.height}`, // Capture screen resolution
  };
};

/**
 * Helper function to format category names for display
 * @param {string} category - The category name to format
 * @returns {string} - Formatted category name
 */
export const formatCategoryName = (category) => {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Helper function to format field names for display
 * @param {string} fieldName - The field name to format
 * @returns {string} - Formatted field name
 */
export const formatFieldName = (fieldName) => {
  return fieldName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Fetches and processes estates data for an application
 * @param {Object} application - The application object containing estate_summary URL
 * @returns {Promise<Array>} - Promise that resolves to an array of flattened estates
 */
export const getEstates = async (application) => {
  if (!application.estate_summary) {
    console.log('No estate_summary URL provided');
    return [];
  }

  console.log(
    `Fetching estates for application ${application.id} from ${application.estate_summary}`
  );

  try {
    const token = Cookies.get('auth_token')?.access;

    // Use fetchData helper (adjust if yours expects full auth object)
    const response = await fetchData(token, application.estate_summary, true); // true = absolute url

    console.log('Estates response:', response);

    // Flatten all estate categories into a single array
    const estatesData = response.data;
    const allEstates = [];

    // Extract estates from all categories and add category labels
    Object.entries(estatesData).forEach(([category, categoryEstates]) => {
      if (Array.isArray(categoryEstates) && categoryEstates.length > 0) {
        categoryEstates.forEach((estate) => {
          // Add category information to each estate
          const isLiability = category === 'irish_debt';
          allEstates.push({
            ...estate,
            category: category,
            group_label: formatCategoryName(category),
            is_asset: isLiability ? false : estate.is_asset, // Mark irish_debt as liability
          });
        });
      }
    });

    console.log('Flattened estates:', allEstates);
    return allEstates;
  } catch (error) {
    console.error('Error fetching estates:', error);
    throw error; // Re-throw to let the calling component handle the error
  }
};

export function formatMoney(amount, currency = '') {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return `${currency}0.00`;
  }

  const formatted = numAmount.toLocaleString('en-IE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currency}${formatted}`;
}

//VALIDATING PPS NUMBER
export const validatePPS = (pps) => {
  pps = pps.toUpperCase().trim();

  // Must match: 7 digits + 1 or 2 uppercase letters
  if (!/^\d{7}[A-Z]{1,2}$/.test(pps)) return false;

  const digits = pps.slice(0, 7).split('').map(Number);
  const checkLetter = pps[7];
  const serialLetter = pps[8] || null;

  const weights = [8, 7, 6, 5, 4, 3, 2];
  let sum = digits.reduce((total, digit, i) => total + digit * weights[i], 0);

  if (serialLetter) {
    const serialValue = serialLetter.charCodeAt(0) - 64; // A = 1 ... Z = 26
    if (serialValue < 1 || serialValue > 26) return false;
    sum += serialValue * 9;
  }

  const remainder = sum % 23;
  const expectedLetter =
    remainder === 0 ? 'W' : String.fromCharCode(64 + remainder);

  return checkLetter === expectedLetter;
};

/**
 * Formats phone numbers to international format for IE and UK
 * @param {string} phoneNumber - The phone number to format
 * @param {string} country - Country code ('IE' or 'UK')
 * @returns {Object} - { success: boolean, formattedNumber: string, error?: string }
 */
function formatPhoneToInternational(phoneNumber, country) {
  // Input validation
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return {
      success: false,
      formattedNumber: '',
      error: 'Phone number must be a non-empty string',
    };
  }

  if (!country || !['IE', 'UK'].includes(country.toUpperCase())) {
    return {
      success: false,
      formattedNumber: '',
      error: 'Country must be either "IE" or "UK"',
    };
  }

  // Clean the input - remove spaces, dashes, parentheses, dots
  let cleanNumber = phoneNumber.replace(/[\s\-\(\)\.\+]/g, '');

  // Validate that we only have digits left
  if (!/^\d+$/.test(cleanNumber)) {
    return {
      success: false,
      formattedNumber: '',
      error: 'Phone number contains invalid characters',
    };
  }

  const countryCode = country.toUpperCase();

  try {
    if (countryCode === 'IE') {
      return formatIrishNumber(cleanNumber);
    } else if (countryCode === 'UK') {
      return formatUKNumber(cleanNumber);
    }
  } catch (error) {
    return {
      success: false,
      formattedNumber: '',
      error: `Formatting error: ${error.message}`,
    };
  }
}

/**
 * Format Irish phone numbers
 * @param {string} number - Clean numeric string
 * @returns {Object} - Formatting result
 */
function formatIrishNumber(number) {
  let workingNumber = number;

  // Remove leading 00353 if present
  if (workingNumber.startsWith('00353')) {
    workingNumber = workingNumber.substring(5);
  }
  // Remove leading 353 if present
  else if (workingNumber.startsWith('353')) {
    workingNumber = workingNumber.substring(3);
  }
  // Remove leading 0 if present (national format)
  else if (workingNumber.startsWith('0')) {
    workingNumber = workingNumber.substring(1);
  }

  // Validate length (Irish mobile: 9 digits, landline: 7-9 digits after removing area code prefix)
  if (workingNumber.length < 7 || workingNumber.length > 9) {
    return {
      success: false,
      formattedNumber: '',
      error: 'Invalid Irish phone number length',
    };
  }

  // Validate Irish number patterns
  const irishMobilePattern = /^[8-9]\d{8}$/; // Mobile numbers start with 8 or 9, total 9 digits
  const irishLandlinePattern = /^[1-7]\d{6,8}$/; // Landline numbers start with 1-7, 7-9 digits total

  if (
    !irishMobilePattern.test(workingNumber) &&
    !irishLandlinePattern.test(workingNumber)
  ) {
    return {
      success: false,
      formattedNumber: '',
      error: 'Invalid Irish phone number format',
    };
  }

  return {
    success: true,
    formattedNumber: `+353 ${workingNumber}`,
    error: null,
  };
}

/**
 * Format UK phone numbers
 * @param {string} number - Clean numeric string
 * @returns {Object} - Formatting result
 */
function formatUKNumber(number) {
  let workingNumber = number;

  // Remove leading 0044 if present
  if (workingNumber.startsWith('0044')) {
    workingNumber = workingNumber.substring(4);
  }
  // Remove leading 44 if present
  else if (workingNumber.startsWith('44')) {
    workingNumber = workingNumber.substring(2);
  }
  // Remove leading 0 if present (national format)
  else if (workingNumber.startsWith('0')) {
    workingNumber = workingNumber.substring(1);
  }

  // Validate length (UK numbers are typically 10 digits after removing the leading 0)
  if (workingNumber.length !== 10) {
    return {
      success: false,
      formattedNumber: '',
      error: 'Invalid UK phone number length',
    };
  }

  // Validate UK number patterns
  const ukMobilePattern = /^7[0-9]\d{8}$/; // Mobile numbers start with 7, total 10 digits
  const ukLandlinePattern = /^[1-6,8-9]\d{9}$/; // Landline numbers, 10 digits total, not starting with 7

  if (
    !ukMobilePattern.test(workingNumber) &&
    !ukLandlinePattern.test(workingNumber)
  ) {
    return {
      success: false,
      formattedNumber: '',
      error: 'Invalid UK phone number format',
    };
  }

  return {
    success: true,
    formattedNumber: `+44 ${workingNumber}`,
    error: null,
  };
}

// Export the main function
export { formatPhoneToInternational };
