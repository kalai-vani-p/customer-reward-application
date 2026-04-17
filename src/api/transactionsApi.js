import { logger } from "../utils/logger";
import { API_URL } from "../config/constants";

export const fetchTransactions = async (signal) => {
  try {
    const response = await fetch(API_URL, { signal });

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    logger.info("Transactions fetched", { count: data.length });

    return data;
  } catch (error) {
    logger.error("Error fetching transactions", error);
    throw new Error(error?.message || "Failed to fetch transactions");
  }
};