import { TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PropTypes from "prop-types";

const TableSearch = ({ value, onChange, label }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        mb: 1,
        flexWrap: "wrap",
      }}
    >
      <TextField
        size="small"
        placeholder={`Search ${label}`}
        value={value}
        onChange={onChange}
        sx={{ width: { xs: "100%", sm: 250 }, py: 1 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
};

TableSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default TableSearch;