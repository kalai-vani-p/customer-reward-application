import { render, screen } from "@testing-library/react";
import TableBodyComponent from "../components/table/TableBodyComponent";

const columns = [{ field: "price" }];

test("formats price", () => {
  render(
    <table>
      <TableBodyComponent
        data={[{ price: 100 }]}
        columns={columns}
      />
    </table>
  );

  expect(screen.getByText(/\$/)).toBeInTheDocument();
});

test("handles undefined values", () => {
  render(
    <table>
      <TableBodyComponent
        data={[{}]}
        columns={[{ field: "name" }]}
      />
    </table>
  );

  expect(screen.getByText("NA")).toBeInTheDocument();
});