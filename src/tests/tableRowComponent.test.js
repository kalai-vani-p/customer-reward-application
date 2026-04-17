import React from "react";
import { render, screen } from "@testing-library/react";
import TableRowComponent from "../components/table/TableRowComponent";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});
describe("TableRowComponent", () => {
  const columns = [
    { field: "customerId" },
    { field: "price" },
    { field: "date" },
  ];

  test("renders full row correctly", () => {
    const row = {
      customerId: "C1",
      price: 100,
      date: "2024-01-01",
    };

    render(
      <table>
        <tbody>
          <TableRowComponent row={row} columns={columns} index={0} />
        </tbody>
      </table>
    );

    expect(screen.getByText("C1")).toBeInTheDocument();
  });

  test("renders price correctly when valid", () => {
    const row = {
      price: 120,
    };

    render(
      <table>
        <tbody>
          <TableRowComponent row={row} columns={[{ field: "price" }]} index={0} />
        </tbody>
      </table>
    );

    expect(screen.getByText("$120.00")).toBeInTheDocument();
  });

  test("renders price as NA when invalid", () => {
    const row = {
      price: -10,
    };

    render(
      <table>
        <tbody>
          <TableRowComponent row={row} columns={[{ field: "price" }]} index={0} />
        </tbody>
      </table>
    );

    expect(screen.getByText("NA")).toBeInTheDocument();
  });

  test("renders date formatted correctly", () => {
    const row = {
      date: "2024-01-01",
    };

    render(
      <table>
        <tbody>
          <TableRowComponent row={row} columns={[{ field: "date" }]} index={0} />
        </tbody>
      </table>
    );

    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
  });

  test("renders monthYear correctly (monthly mode)", () => {
    const row = {
      month: "01",
      year: "2024",
    };

    render(
      <table>
        <tbody>
          <TableRowComponent
            row={row}
            column={{ field: "monthYear" }}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText("Jan 2024")).toBeInTheDocument();
  });

  test("handles empty columns safely", () => {
    const row = { customerId: "C1" };

    render(
      <table>
        <tbody>
          <TableRowComponent row={row} columns={[]} index={0} />
        </tbody>
      </table>
    );

    expect(screen.getByRole("row")).toBeInTheDocument();
  });
});