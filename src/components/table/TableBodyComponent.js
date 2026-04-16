import React from "react";
import { TableBody, TableRow, TableCell, Tooltip } from "@mui/material";
import { cellStyle, formatUSD } from "../../utils/tableHelpers";
import dayjs from "dayjs";
import PropTypes from "prop-types";

const FALLBACK = "NA";

const COLORS = {
  textMuted: "#888",
  textPrimary: "#444",
  border: "#eee",
  rowEven: "#ffffff",
  rowOdd: "#f8f9fa",
};

const getPriceState = (value) => {
  const numeric =
    typeof value === "string" && value.trim() === ""
      ? NaN
      : Number(value);

  const isInvalid =
    value === null ||
    value === undefined ||
    isNaN(numeric) ||
    numeric < 0;

  let reason = "";
  if (value === null || value === undefined) {
    reason = "Invalid: null / undefined";
  } else if (isNaN(numeric)) {
    reason = "Invalid: not a number";
  } else if (numeric < 0) {
    reason = "Invalid: negative value";
  }

  return {
    value: isInvalid ? null : numeric,
    isInvalid,
    reason,
  };
};

const TableBodyComponent = ({ data = [], columns = [], type }) => {
  if (!data.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={columns.length}
            align="center"
            sx={{ py: 3, color: COLORS.textMuted }}
          >
            No data
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  const renderCell = (row, c) => {
    const value = row?.[c.field];

    switch (c.field) {
      case "monthYear":
        return row.month && row.year
          ? dayjs(`${row.year}-${row.month}-01`).format("MMM YYYY")
          : FALLBACK;

      case "price": {
        const { value: safeValue, isInvalid, reason } =
          getPriceState(value);

        const cell = (
          <span
            style={{
              color: isInvalid ? "red" : "inherit",
              fontWeight: 500,
            }}
          >
            {isInvalid ? "NA" : formatUSD(safeValue)}
          </span>
        );

        return isInvalid ? (
          <Tooltip
            title={reason}
            slotProps={{
              tooltip: { sx: { fontSize: "14px" } },
            }}
          >
            {cell}
          </Tooltip>
        ) : (
          cell
        );
      }

      case "date":
        return value ? dayjs(value).format("MM/DD/YYYY") : FALLBACK;

      default:
        return value ?? FALLBACK;
    }
  };

  if (type === "monthly") {
    const groupedData = data.reduce((acc, item) => {
      const key = item.customerId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return (
      <TableBody>
        {Object.values(groupedData).map((rows, groupIndex) =>
          rows.map((row, index) => {
            const { value: safeValue, isInvalid, reason } =
              getPriceState(row.price);

            return (
              <TableRow
                key={`${row.customerId}-${index}`}
                sx={{
                  "& td": {
                    textAlign: "center",
                    verticalAlign: "middle",
                    borderRight: `1px solid ${COLORS.border}`,
                    borderBottom: "none",
                    padding: "12px 10px",
                    fontSize: "13px",
                  },
                  "& td:last-of-type": { borderRight: "none" },
                  "&:hover": { backgroundColor: "#f9fafb" },
                  backgroundColor:
                    groupIndex % 2 === 0
                      ? COLORS.rowEven
                      : COLORS.rowOdd,
                }}
              >
                {index === 0 && (
                  <TableCell rowSpan={rows.length} sx={{ fontWeight: 600 }}>
                    {row.customerId}
                  </TableCell>
                )}

                {index === 0 && (
                  <TableCell rowSpan={rows.length} sx={{ fontWeight: 500 }}>
                    {row.customerName}
                  </TableCell>
                )}

                <TableCell>
                  {dayjs(`${row.year}-${row.month}-01`).format("MMM YYYY")}
                </TableCell>

                <TableCell
                  style={{
                    color: isInvalid ? "red" : "inherit",
                    fontWeight: 500,
                  }}
                >
                  {isInvalid ? (
                    <Tooltip
                      title={reason}
                      slotProps={{
                        tooltip: { sx: { fontSize: "14px" } },
                      }}
                    >
                      <span>
                        <span>NA</span>
                      </span>
                    </Tooltip>
                  ) : (
                    formatUSD(safeValue)
                  )}
                </TableCell>

                <TableCell>{row.points ?? 0}</TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    );
  }

  return (
    <TableBody>
      {data.map((row, i) => (
        <TableRow
          key={row.id || i}
          hover
          sx={{
            backgroundColor:
              i % 2 === 0 ? COLORS.rowEven : COLORS.rowOdd,
          }}
        >
          {columns.map((c) => (
            <TableCell
              key={c.field}
              align="center"
              sx={cellStyle(c.hideOnMobile)}
            >
              {renderCell(row, c)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

TableBodyComponent.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
};

export default TableBodyComponent;