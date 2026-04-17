import React from "react";
import { TableRow, TableCell, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { cellStyle, formatUSD } from "../../utils/tableHelpers";
import PropTypes from "prop-types";

const FALLBACK = "NA";

// Price validation helper
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

// Cell renderer
const renderCell = (row, column) => {
    const value = row?.[column.field];

    switch (column.field) {
        case "monthYear":
            return row.month && row.year
                ? dayjs(`${row.year}-${row.month}-01`).format("MMM YYYY")
                : FALLBACK;

        case "price": {
            const { value: safeValue, isInvalid, reason } =
                getPriceState(value);

            return isInvalid ? (
                <Tooltip title={reason}>
                    <span style={{ color: "red", fontWeight: 500 }}>NA</span>
                </Tooltip>
            ) : (
                <span style={{ fontWeight: 500 }}>
                    {formatUSD(safeValue)}
                </span>
            );
        }

        case "date":
            return value ? dayjs(value).format("MM/DD/YYYY") : FALLBACK;

        default:
            return value ?? FALLBACK;
    }
};

const TableRowComponent = ({ row, columns, column, index }) => {
    // Monthly (single cell)
    if (column) {
        return (
            <TableCell align="center" sx={cellStyle(column.hideOnMobile)}>
                {renderCell(row, column)}
            </TableCell>
        );
    }

    // Safety check
    const safeColumns = Array.isArray(columns) ? columns : [];

    // Normal (full row)
    return (
        <TableRow
            hover
            sx={{
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
            }}
        >
            {safeColumns.map((col) => (
                <TableCell
                    key={col.field}
                    align="center"
                    sx={cellStyle(col.hideOnMobile)}
                >
                    {renderCell(row, col)}
                </TableCell>
            ))}
        </TableRow>
    );
};

TableRowComponent.propTypes = {
    row: PropTypes.object.isRequired,
    columns: PropTypes.array,
    column: PropTypes.object,
    index: PropTypes.number,
};

export default TableRowComponent;