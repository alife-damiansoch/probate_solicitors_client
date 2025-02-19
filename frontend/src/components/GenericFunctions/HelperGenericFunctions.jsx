import 'react';
import { UAParser } from "ua-parser-js";

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


