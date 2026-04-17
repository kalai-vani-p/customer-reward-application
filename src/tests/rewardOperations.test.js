import {
  calculatePoints,
  groupByMonths,
  groupByTotal,
} from "../utils/rewardOperations";

describe("calculatePoints", () => {
  test("normal case above 100", () => {
    expect(calculatePoints(120)).toBe(90);
  });

  test("between 50 and 100", () => {
    expect(calculatePoints(75)).toBe(25);
  });

  test("exact 50", () => {
    expect(calculatePoints(50)).toBe(0);
  });

  test("exact 100", () => {
    expect(calculatePoints(100)).toBe(50);
  });

  test("zero", () => {
    expect(calculatePoints(0)).toBe(0);
  });

  test("negative", () => {
    expect(calculatePoints(-100)).toBe(0);
  });

  test("null", () => {
    expect(calculatePoints(null)).toBe(0);
  });

  test("string input", () => {
    expect(calculatePoints("abc")).toBe(0);
  });

  test("decimal value", () => {
    expect(calculatePoints(120.5)).toBe(91);
  });

  test("very large number", () => {
    expect(calculatePoints(1000)).toBe(1850);
  });
});

describe("groupByMonths", () => {
  test("groups correctly single month single customer", () => {
    const data = [
      { customerId: "1", date: "2024-01-01", points: 10, price: null },
    ];

    expect(groupByMonths(data)).toEqual([
      {
        customerId: "1",
        customerName: undefined,
        month: "01",
        year: 2024,
        points: 10,
        price: 0, 
      },
    ]);
  });

  test("multiple months same customer", () => {
    const data = [
      { customerId: "1", date: "2024-01-01", points: 10, price: null },
      { customerId: "1", date: "2024-02-01", points: 20, price: null },
    ];

    expect(groupByMonths(data)).toEqual([
      {
        customerId: "1",
        customerName: undefined,
        month: "01",
        year: 2024,
        points: 10,
        price: 0,   
      },
      {
        customerId: "1",
        customerName: undefined,
        month: "02",
        year: 2024,
        points: 20,
        price: 0, 
      },
    ]);
  });

  test("multiple customers same month", () => {
    const data = [
      { customerId: "1", date: "2024-01-01", points: 10, price: null },
      { customerId: "2", date: "2024-01-15", points: 20, price: null },
    ];

    expect(groupByMonths(data)).toEqual([
      {
        customerId: "1",
        customerName: undefined,
        month: "01",
        year: 2024,
        points: 10,
        price: 0,  
      },
      {
        customerId: "2",
        customerName: undefined,
        month: "01",
        year: 2024,
        points: 20,
        price: 0,  
      },
    ]);
  });

  test("handles invalid date", () => {
    const data = [{ customerId: "1", date: "invalid", points: 10 }];
    expect(groupByMonths(data).length).toBe(0);
  });

  test("handles empty array", () => {
    expect(groupByMonths([])).toEqual([]);
  });
});

describe("groupByTotal", () => {
  test("groups total single customer", () => {
    const data = [
      { customerId: "1", points: 10, price: null },
      { customerId: "1", points: 20, price: null },
    ];

    expect(groupByTotal(data)).toEqual([
      {
        customerId: "1",
        customerName: undefined,
        points: 30,
        price: 0,
      },
    ]);
  });

  test("groups total multiple customers", () => {
    const data = [
      { customerId: "1", points: 10, price: null },
      { customerId: "2", points: 5, price: null },
      { customerId: "1", points: 20, price: null },
    ];

    expect(groupByTotal(data)).toEqual([
      {
        customerId: "1",
        customerName: undefined,
        points: 30,
        price: 0,
      },
      {
        customerId: "2",
        customerName: undefined,
        points: 5,
        price: 0,
      },
    ]);
  });

  test("handles zero points", () => {
    const data = [
      { customerId: "1", points: 0, price: null },
      { customerId: "2", points: 0, price: null },
    ];

    expect(groupByTotal(data)).toEqual([
      {
        customerId: "1",
        customerName: undefined,
        points: 0,
        price: 0,
      },
      {
        customerId: "2",
        customerName: undefined,
        points: 0,
        price: 0,
      },
    ]);
  });

  test("handles empty array", () => {
    expect(groupByTotal([])).toEqual([]);
  });
});