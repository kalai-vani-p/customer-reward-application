/**
 * Standard TableCell styles
 * @param {boolean} hideOnMobile
 */
export const cellStyle = (hideOnMobile) => ({
  fontSize: { xs: 12, sm: 13 },
  color: "#444",
  borderBottom: "1px solid #eee",
  py: { xs: 1, sm: 2 },
  px: { xs: 1, sm: 2 },
  display: hideOnMobile ? { xs: "none", sm: "table-cell" } : "table-cell",
});

/**
 * Checks if a price is valid (number >= 0)
 * @param {*} price
 */
export const isValidPrice = (price) =>
  typeof price === "number" && !isNaN(price) && price >= 0;

/**
 * Formats a number as USD currency
 * @param {number} value
 */
export const formatUSD = (value) => {
  if (typeof value !== "number" || isNaN(value)) return value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const getCellAlignment = (field) =>
  ["price", "points"].includes(field) ? "right" : "left";

/**
 * Deeply freezes an object, including all nested objects and arrays.
 *
 * @param {Object} obj - The object to be deeply frozen
 * @returns {Object} The fully frozen object
 */
export const deepFreeze = (obj) => {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      obj[prop] !== null &&
      (typeof obj[prop] === "object" || typeof obj[prop] === "function") &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
};