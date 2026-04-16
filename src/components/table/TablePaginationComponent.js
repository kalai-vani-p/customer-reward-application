import { TablePagination } from "@mui/material";
import PropTypes from "prop-types";
/**
 * Table pagination component
 * @param {number} count - total records
 * @param {number} page - current page
 * @param {number} rowsPerPage - rows per page
 * @param {Function} onPageChange - page change handler
 * @param {Function} onRowsPerPageChange - rows change handler
 */
const TablePaginationComponent = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};

TablePaginationComponent.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
};

export default TablePaginationComponent;