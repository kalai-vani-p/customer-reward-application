import React from "react";
import { Box, Typography } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import PropTypes from "prop-types";

export default function ErrorDisplay({ message }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        gap: 2,
        color: "error.main",
        px: 2,
      }}
    >
      <ErrorOutlineOutlinedIcon sx={{ fontSize: 80 }} />
      <Typography variant="h5" fontWeight="bold">
        {message || "Something went wrong"}
      </Typography>
    </Box>
  );
}
ErrorDisplay.propTypes = {
  message: PropTypes.string.isRequired,
};