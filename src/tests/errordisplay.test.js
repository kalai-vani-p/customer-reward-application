import { render, screen } from "@testing-library/react";
import ErrorDisplay from "../components/ErrorDisplay";

test("renders default message", () => {
  render(<ErrorDisplay />);
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});

test("renders custom message", () => {
  render(<ErrorDisplay message="Custom error" />);
  expect(screen.getByText("Custom error")).toBeInTheDocument();
});