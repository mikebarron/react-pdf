/**
 * Checks if we're running in a browser environment.
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Checks whether we're running from a local file system.
 */
export const isLocalFileSystem = isBrowser && window.location.protocol === 'file:';

/**
 * Checks whether we're running on a production build or not.
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Checks whether a variable is defined.
 *
 * @param {*} variable Variable to check
 */
export const isDefined = variable => typeof variable !== 'undefined';

/**
 * Checks whether a variable is defined and not null.
 *
 * @param {*} variable Variable to check
 */
export const isProvided = variable => isDefined(variable) && variable !== null;

/**
 * Checkes whether a variable provided is a string.
 *
 * @param {*} variable Variable to check
 */
export const isString = variable => typeof variable === 'string';

/**
 * Checks whether a variable provided is an ArrayBuffer.
 *
 * @param {*} variable Variable to check
 */
export const isArrayBuffer = variable => variable instanceof ArrayBuffer;

/**
 * Checkes whether a variable provided is a Blob.
 *
 * @param {*} variable Variable to check
 */
export const isBlob = (variable) => {
  if (!isBrowser) {
    throw new Error('Attempted to check if a variable is a Blob on a non-browser environment.');
  }

  return variable instanceof Blob;
};

/**
 * Checkes whether a variable provided is a File.
 *
 * @param {*} variable Variable to check
 */
export const isFile = (variable) => {
  if (!isBrowser) {
    throw new Error('Attempted to check if a variable is a Blob on a non-browser environment.');
  }

  return variable instanceof File;
};

/**
 * Checks whether a string provided is a data URI.
 *
 * @param {String} str String to check
 */
export const isDataURI = str => isString(str) && /^data:/.test(str);

export const isParamObject = file =>
  file instanceof Object && ('data' in file || 'range' in file || 'url' in file);

/**
 * Calls a function, if it's defined, with specified arguments
 * @param {Function} fn
 * @param {Object} args
 */
export const callIfDefined = (fn, args) => {
  if (fn && typeof fn === 'function') {
    fn(args);
  }
};

export const getPixelRatio = () => window.devicePixelRatio || 1;

const consoleOnDev = (method, ...message) => {
  if (!isProduction) {
    // eslint-disable-next-line no-console
    console[method](...message);
  }
};

export const warnOnDev = (...message) => consoleOnDev('warn', ...message);

export const errorOnDev = (...message) => consoleOnDev('error', ...message);

export const displayCORSWarning = () => {
  if (isLocalFileSystem) {
    // eslint-disable-next-line no-console
    warnOnDev('Loading PDF as base64 strings/URLs might not work on protocols other than HTTP/HTTPS. On Google Chrome, you can use --allow-file-access-from-files flag for debugging purposes.');
  }
};

export const makeCancellable = (promise) => {
  let isCancelled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (...args) => (isCancelled ? reject(new Error('cancelled')) : resolve(...args)),
      error => (isCancelled ? reject(new Error('cancelled')) : reject(error)),
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      isCancelled = true;
    },
  };
};
