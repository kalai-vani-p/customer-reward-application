import { render, screen } from "@testing-library/react";
import App from "../App";

jest.mock("../pages/TransactionsPage", () => () => (
  <div>Transactions Page</div>
));

describe("App", () => {
  test("renders TransactionsPage", () => {
    render(<App />);
    expect(screen.getByText("Transactions Page")).toBeInTheDocument();
  });
});