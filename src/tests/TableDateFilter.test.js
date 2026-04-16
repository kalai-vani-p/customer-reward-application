import { render, screen, fireEvent } from "@testing-library/react";
import TableDateFilter from "../components/table/TableDateFilter";

test("triggers apply and clear actions", () => {
  const onFromDateChange = jest.fn();
  const onToDateChange = jest.fn();
  const onApply = jest.fn();
  const onClear = jest.fn();

  render(
    <TableDateFilter
      fromDate="01-01-2026"
      toDate="10-01-2026"
      onFromDateChange={onFromDateChange}
      onToDateChange={onToDateChange}
      onApply={onApply}
      onClear={onClear}
    />
  );

  const applyBtn = screen.getByText("Apply");
  const clearBtn = screen.getByText("Clear");

  // ensure enabled
  expect(applyBtn).not.toBeDisabled();
  expect(clearBtn).not.toBeDisabled();

  fireEvent.click(applyBtn);
  fireEvent.click(clearBtn);

  expect(onApply).toHaveBeenCalledTimes(1);
  expect(onClear).toHaveBeenCalledTimes(1);
});