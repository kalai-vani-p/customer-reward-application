import { useEffect, useMemo, useState } from "react";
import { fetchTransactions } from "../api/transactionsApi";
import {
  calculatePoints,
  groupByMonths,
  groupByTotal,
} from "../utils/rewardOperations";
import { logger } from "../utils/logger";
import dayjs from "dayjs";
/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Fetch transactions + reward data
 * @returns {Object} data, loading, error, monthlyData, totalData
*/
const useDataFetcher = ({
  fetchFn = fetchTransactions,
  transformFn = (data) => data,
  addPoints = true,
} = {}) => {
  const [state, setState] = useState({
    data: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, loading: true }));
    fetchFn()
      .then((res) => {
        let enriched = res;

        if (addPoints) {
          enriched = enriched.map((t) => ({
            ...t,
            points: calculatePoints(t.price),
          }));
        }

        enriched = transformFn(enriched);

        setState({ data: enriched, loading: false, error: null });
      })
      .catch((error) => {
        logger.error("Error in useDataFetcher:", error);
        setState({
          data: [],
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load data",
        });
      });
  }, []);

  const getLast3CalendarMonths = () => {
    return [
      dayjs().subtract(2, "month"),
      dayjs().subtract(1, "month"),
      dayjs(),
    ].map((d) => ({
      month: d.format("MM"),
      year: String(d.year()),
    }));
  };
  const monthlyData = useMemo(() => {
    const grouped = groupByMonths(state.data);
    const last3 = getLast3CalendarMonths();

    return grouped.filter((item) =>
      last3.some(
        (m) => m.month === item.month && m.year === String(item.year)
      )
    );
  }, [state.data]);

  const totalData = useMemo(() => {
    const grouped = groupByMonths(state.data);
    const last3 = getLast3CalendarMonths();

    const filtered = grouped.filter((item) =>
      last3.some(
        (m) => m.month === item.month && m.year === String(item.year)
      )
    );

    return groupByTotal(filtered);
  }, [state.data]);
  return { ...state, monthlyData, totalData };
};



export default useDataFetcher;

