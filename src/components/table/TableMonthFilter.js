import React, { useMemo } from "react";
import { Box, Select, MenuItem, Button, InputLabel, FormControl } from "@mui/material";
import PropTypes from "prop-types";
import dayjs from "dayjs";

const TableMonthFilter = ({
    value,
    handleMonthChange,
    handleClear,
}) => {

    const last3Months = useMemo(() => {
        return [
            dayjs().subtract(2, "month"),
            dayjs().subtract(1, "month"),
            dayjs(),
        ].map((d) => ({
            label: d.format("MMMM YYYY"),
            value: d.format("YYYY-MM"),
        }));
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                mb: 1,
                flexWrap: "wrap",
                alignItems: "center",
            }}
        >
            <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Month</InputLabel>
                <Select
                    value={value || ""}
                    label="Month"
                    onChange={(e) => handleMonthChange(e.target.value)}
                >
                    {last3Months.map((m) => (
                        <MenuItem key={m.value} value={m.value}>
                            {m.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                variant="outlined"
                size="small"
                onClick={handleClear}
                disabled={!value}
            >
                Clear
            </Button>
        </Box>
    );
};

TableMonthFilter.propTypes = {
    value: PropTypes.string,
    handleMonthChange: PropTypes.func.isRequired,
    handleClear: PropTypes.func.isRequired,
};

export default React.memo(TableMonthFilter);