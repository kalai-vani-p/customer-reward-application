import React from "react";
import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const TableDateFilter = ({
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    onClear,
    onApply
}) => {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mb: 1,
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >

                <DatePicker
                    label="From"
                    format="MM/DD/YYYY"
                    value={fromDate ? dayjs(fromDate, "MM/DD/YYYY") : null}
                    onChange={(newValue) =>
                        onFromDateChange(
                            newValue ? newValue.format("MM/DD/YYYY") : ""
                        )
                    }
                    disableFuture
                    slotProps={{
                        textField: {
                            size: "small",
                            sx: { minWidth: 160 },
                            error: false,
                        },
                    }}
                />

                <DatePicker
                    label="To"
                    format="MM/DD/YYYY"
                    value={toDate ? dayjs(toDate, "MM/DD/YYYY") : null}
                    onChange={(newValue) =>
                        onToDateChange(
                            newValue ? newValue.format("MM/DD/YYYY") : ""
                        )
                    }
                    disableFuture
                    slotProps={{
                        textField: {
                            size: "small",
                            sx: { minWidth: 160 },
                            error: false,
                        },
                    }}
                />

                <Button
                    variant="contained"
                    size="small"
                    onClick={onApply}
                    disabled={!fromDate && !toDate}
                >
                    Apply
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={onClear}
                    disabled={!fromDate && !toDate}
                >
                    Clear
                </Button>

            </Box>
        </LocalizationProvider>
    );
};

TableDateFilter.propTypes = {
    fromDate: PropTypes.string,
    toDate: PropTypes.string,
    onFromDateChange: PropTypes.func.isRequired,
    onToDateChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
};

export default React.memo(TableDateFilter);