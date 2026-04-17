import React from "react";
import { TableBody, TableRow, TableCell } from "@mui/material";
import PropTypes from "prop-types";
import TableRowComponent from "./TableRowComponent";

const FALLBACK = "NA";

const TableBodyComponent = ({ data = [], columns = [], type }) => {
  // Empty state
  if (!data.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
            No data
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  // Monthly Table (grouped rows with rowspan)
  if (type === "monthly") {
    return (
      <TableBody>
        {data.map((rows, groupIndex) =>
          rows.map((row, index) => (
            <TableRow
              key={`${row.customerId}-${row.year}-${row.month}`}
              sx={{
                backgroundColor:
                  groupIndex % 2 === 0 ? "#ffffff" : "#f8f9fa",
              }}
            >
              {/* Rowspan cells */}
              {index === 0 && (
                <TableCell rowSpan={rows.length} align="center">
                  {row.customerId || FALLBACK}
                </TableCell>
              )}

              {index === 0 && (
                <TableCell rowSpan={rows.length} align="center">
                  {row.customerName || FALLBACK}
                </TableCell>
              )}

              {/* Remaining cells via reusable component */}
              {columns
                .filter(
                  (c) =>
                    c.field !== "customerId" &&
                    c.field !== "customerName"
                )
                .map((c) => (
                  <TableRowComponent
                    key={`${row.customerId}-${row.year}-${row.month}-${c.field}`}
                    row={row}
                    column={c}
                  />
                ))}
            </TableRow>
          ))
        )}
      </TableBody>
    );
  }

  // Normal Table
  return (
    <TableBody>
      {data.map((row, index) => (
        <TableRowComponent
          key={row.transactionId || row.customerId || index}
          row={row}
          columns={columns}
          index={index}
        />
      ))}
    </TableBody>
  );
};

TableBodyComponent.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  type: PropTypes.string,
};

export default TableBodyComponent;