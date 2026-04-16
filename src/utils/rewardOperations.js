import dayjs from "dayjs";

export const calculatePoints = (amount) => {
  const value = Number(amount);

  if (
    amount === null ||
    amount === undefined ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return null;
  }

  if (value <= 50) return 0;

  if (value > 100) return Math.floor((value - 100) * 2 + 50);

  return Math.floor(value - 50);
};


const getMonthYear = (dateValue) => {
  const date = dayjs(dateValue);
  if (!date.isValid()) return null;

  return {
    month: date.format("MM"),
    year: date.year(),
  };
};

export const groupByMonths = (data = []) => {
  const map = {};

  data.reduce((acc, item) => {
    const info = getMonthYear(item.date);
    if (!info) return acc;

    const key = `${item.customerId}-${info.year}-${info.month}`;

    const numeric = Number(item.price);
    const isInvalid =
      item.price === null ||
      item.price === undefined ||
      isNaN(numeric) ||
      numeric < 0;

    if (!acc[key]) {
      acc[key] = {
        customerId: item.customerId,
        customerName: item.customerName,
        month: info.month,
        year: info.year,
        price: isInvalid ? null : numeric,
        points: 0,
      };
    } else {
      if (isInvalid) {
        acc[key].price = null;
      } else if (acc[key].price !== null) {
        acc[key].price += numeric;
      }
    }

    acc[key].points += item.points || 0;

    return acc;
  }, map);

  return Object.values(map);
};
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

    acc[item.customerId].points += item.points || 0;
    acc[item.customerId].price += Number(item.price) || 0;
    return acc;
  }, map);

  return Object.values(map);
};