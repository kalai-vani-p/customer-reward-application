import { fetchTransactions } from "../api/transactionsApi";

describe("fetchTransactions", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("returns data successfully", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1 }, { id: 2 }],
    });

    const data = await fetchTransactions();

    expect(data.length).toBe(2);
  });

  test("handles API failure", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Invalid data format" }),
    });

    await expect(fetchTransactions()).rejects.toThrow(
      "Invalid data format"
    );
  });

  test("handles invalid data format", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => null,
    });

    await expect(fetchTransactions()).rejects.toThrow(
      "Invalid data format"
    );
  });

  test("handles empty array", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const data = await fetchTransactions();

    expect(data).toEqual([]);
  });
});