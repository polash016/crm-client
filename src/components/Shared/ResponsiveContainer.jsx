import React from "react";
import { Box } from "@mui/material";

const ResponsiveContainer = ({ children, sx = {} }) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer;
