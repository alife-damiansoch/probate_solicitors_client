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
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // Get the day and add leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-based) and add leading zero
  const year = date.getFullYear(); // Get the full year

  return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
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
