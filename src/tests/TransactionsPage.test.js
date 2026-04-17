import { render, screen } from "@testing-library/react";
import TransactionsPage from "../pages/TransactionsPage";
import * as hook from "../hooks/useFetchTransaction";

jest.mock("../components/CommonTable", () => () => (
  <div>CommonTable</div>
));

describe("TransactionsPage", () => {
  test("shows loader", () => {
    jest.spyOn(hook, "default").mockReturnValue({
      loading: true,
    });

    render(<TransactionsPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("shows error", () => {
    jest.spyOn(hook, "default").mockReturnValue({
      loading: false,
      error: new Error("Error"),
    });

    render(<TransactionsPage />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  test("renders table", () => {
    jest.spyOn(hook, "default").mockReturnValue({
      loading: false,
      error: null,
      data: [],
      monthlyData: [],
      totalData: [],
    });

    render(<TransactionsPage />);
    expect(screen.getByText("CommonTable")).toBeInTheDocument();
  });
});