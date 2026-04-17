import { TablePagination } from "@mui/material";
import PropTypes from "prop-types";

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
      rowsPerPageOptions={[]}
      labelRowsPerPage=""
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