import React from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@mui/material";
import PropTypes from "prop-types";
import { getCellAlignment } from "../../utils/tableHelpers";

const TableHeader = ({ columns, order, orderBy, onSort }) => {
  return (
    <TableHead>
      <TableRow
        sx={{
          fontWeight: 700,
          fontSize: { xs: 12, sm: 14 },
          color: "#333",
          borderBottom: "2px solid #d6dbe3",
          backgroundColor: "#f5f7fb",
          textAlign: "center",
        }}
      >
        {columns.map((c) => (
          <TableCell
            key={c.field}
            align={getCellAlignment(c.field)}
            sx={{
              fontWeight: 700,
              fontSize: "13px",
              backgroundColor: "#f3f4f6",
              borderBottom: "2px solid #d1d5db",
              textAlign: "center",
              padding: "12px 10px",
            }}
          >
            <TableSortLabel
              active={orderBy === c.field}
              direction={orderBy === c.field ? order : "asc"}
              onClick={() => onSort(c.field)}
            >
              {c.header}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      hideOnMobile: PropTypes.bool,
    })
  ).isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
};

export default React.memo(TableHeader);