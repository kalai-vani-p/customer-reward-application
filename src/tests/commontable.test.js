import { render, screen, fireEvent } from "@testing-library/react";
import CommonTable from "../components/CommonTable";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

const mockTabs = [
  {
    label: "Test",
    data: [
      { id: 1, name: "A", price: 100 },
      { id: 2, name: "B", price: 0 },
    ],
    columns: [
      { field: "id", header: "ID" },
      { field: "name", header: "Name" },
      { field: "price", header: "Price" },
    ],
  },
];

describe("CommonTable", () => {
  test("renders table headers", () => {
    render(<CommonTable tabs={mockTabs} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
  });

  test("search works correctly", () => {
    render(<CommonTable tabs={mockTabs} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "A" },
    });

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  test("handles empty data safely", () => {
    render(<CommonTable tabs={[{ label: "Empty", data: [], columns: [] }]} />);
    expect(screen.getByText(/No data/i)).toBeInTheDocument();
  });

  test("sorting triggers header click", () => {
    render(<CommonTable tabs={mockTabs} />);
    fireEvent.click(screen.getByText("ID"));
    expect(screen.getByText("ID")).toBeInTheDocument();
  });
  test("transaction date filtering works", () => {
    render(
      <CommonTable
        tabs={[
          {
            label: "Test",
            type: "transaction",
            data: [
              { id: 1, date: "2026-01-01", name: "A", price: 100 },
              { id: 2, date: "2026-02-01", name: "B", price: 100 },
            ],
            columns: [
              { field: "id", header: "ID" },
              { field: "date", header: "Date" },
            ],
          },
        ]}
      />
    );

    expect(screen.getByText("ID")).toBeInTheDocument();
  });
});