import { fetchTransactions } from "../api/transactionsApi";

describe("fetchTransactions", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("returns data successfully", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1 }, { id: 2 }],
    });

    const data = await fetchTransactions();

    expect(data.length).toBe(2);
  });

  test("handles API failure", async () => {
    fetch.mockResolvedValue({
      ok: false,
    });

    await expect(fetchTransactions()).rejects.toThrow(
      "Failed to fetch transactions"
    );
  });

  test("handles invalid data format", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => null,
    });

    await expect(fetchTransactions()).rejects.toThrow(
      "Invalid data format"
    );
  });

  test("handles empty array", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const data = await fetchTransactions();

    expect(data).toEqual([]);
  });
});