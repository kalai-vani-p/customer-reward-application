import dayjs from "dayjs";

/**
 * Convert any value to a safe non-negative number
 * @param {*} value
 * @returns {number}
 */
const toSafeNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : 0;
};

/**
 * Calculate reward points based on amount
 * @param {number|string} amount
 * @returns {number}
 */
export const calculatePoints = (amount) => {
  const value = toSafeNumber(amount);

  if (value <= 50) return 0;
  if (value > 100) return Math.floor((value - 100) * 2 + 50);

  return Math.floor(value - 50);
};

/**
 * Extract month and year from date
 * @param {string|Date} dateValue
 * @returns {{month: string, year: number} | null}
 */
const getMonthYear = (dateValue) => {
  const date = dayjs(dateValue);
  if (!date.isValid()) return null;

  return {
    month: date.format("MM"),
    year: date.year(),
  };
};

/**
 * Group transactions by customer + month
 * @param {Array} data
 * @returns {Array}
 */
export const groupByMonths = (data = []) => {
  const map = {};

  data.reduce((acc, item) => {
    const info = getMonthYear(item.date);
    if (!info) return acc;

    const key = `${item.customerId}-${info.year}-${info.month}`;

    const safePrice = toSafeNumber(item.price);

    if (!acc[key]) {
      acc[key] = {
        customerId: item.customerId,
        customerName: item.customerName,
        month: info.month,
        year: info.year,
        price: 0,
        points: 0,
      };
    }

    acc[key].price += safePrice;
    acc[key].points += toSafeNumber(item.points);

    return acc;
  }, map);

  return Object.values(map);
};

/**
 * Group transactions by customer (total)
 * @param {Array} data
 * @returns {Array}
 */
export const groupByTotal = (data = []) => {
  const map = {};

  data.reduce((acc, item) => {
    if (!acc[item.customerId]) {
      acc[item.customerId] = {
        customerId: item.customerId,
        customerName: item.customerName,
        price: 0,
        points: 0,
      };
    }

    acc[item.customerId].price += toSafeNumber(item.price);
    acc[item.customerId].points += toSafeNumber(item.points);

    return acc;
  }, map);

  return Object.values(map);
};