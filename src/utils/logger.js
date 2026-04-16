const isDev = process.env.NODE_ENV !== "production";
const isTest = process.env.NODE_ENV === "test";

/**
 * Logger utility for consistent logging across the application
 * - Logs are enabled based on environment
 * - Suppresses logs during testing
 */
export const logger = {
  info: (...args) => {
    if (isDev && !isTest) console.log("[INFO]:", ...args);
  },

  warn: (...args) => {
    if (isDev && !isTest) console.warn("[WARN]:", ...args);
  },

  error: (...args) => {
    if (isTest) return;

    const firstArg = args[0];

    let status = "";
    let message = "";

    if (firstArg && typeof firstArg === "object") {
      status =
        firstArg.status ||
        firstArg.response?.status || "";

      message =
        firstArg.message ||
        firstArg.response?.statusText ||
        firstArg.response?.data ||
        "";
    }

    console.error(
      "[ERROR]:",
      status,
      message,
      ...args
    );
  },

  debug: (...args) => {
    if (isDev && !isTest) console.debug("[DEBUG]:", ...args);
  },
};