import { renderHook, waitFor } from "@testing-library/react";
import useDataFetcher from "../hooks/useDataFetcher";
import * as api from "../api/transactionsApi";

describe("useDataFetcher", () => {
  test("success flow", async () => {
    jest.spyOn(api, "fetchTransactions").mockResolvedValue([
      { price: 120, customerId: "1", date: "2024-01-01" },
    ]);

    const { result } = renderHook(() => useDataFetcher());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data.length).toBe(1);
    expect(result.current.data[0]).toHaveProperty("points");
  });

  test("failure flow", async () => {
    jest.spyOn(api, "fetchTransactions").mockRejectedValue("error");

    const { result } = renderHook(() => useDataFetcher());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Failed to load data");
  });
});