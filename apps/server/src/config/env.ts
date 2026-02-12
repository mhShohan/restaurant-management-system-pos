/**
 * Get environment variable value
 * @param key - Environment variable key
 * @param defaultValue - Default value if environment variable is not set
 * @returns Environment variable value
 */
const env = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

export default env;
