/**
 * Utility Functions
 */

/**
 * Validate if a string is a valid dataset ID
 * @param {string} id 
 * @returns {boolean}
 */
export function isValidDatasetId(id) {
  return typeof id === 'string' && /^[a-z0-9-]+$/.test(id);
}

/**
 * Format API response
 * @param {boolean} success 
 * @param {*} data 
 * @param {string} message 
 * @param {string} error 
 * @returns {Object}
 */
export function formatResponse(success, data = null, message = null, error = null) {
  const response = { success };
  
  if (data !== null) response.data = data;
  if (message) response.message = message;
  if (error) response.error = error;
  
  return response;
}

/**
 * Sleep function for delays
 * @param {number} ms 
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn 
 * @param {number} retries 
 * @param {number} delay 
 * @returns {Promise}
 */
export async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(delay * Math.pow(2, i)); // Exponential backoff
    }
  }
}

/**
 * Deep clone an object
 * @param {*} obj 
 * @returns {*}
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 * @param {Object} obj 
 * @returns {boolean}
 */
export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Generate a unique ID
 * @returns {string}
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
