import React from "react";
import { Box, Typography } from "@mui/material";

const ColorLegend = () => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
      📊 Table Legend:
    </Typography>
    <Box
      sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            borderLeft: "3px solid #dc2626",
          }}
        />
        <Typography variant="caption">Overdue Follow-ups</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            backgroundColor: "rgba(251, 146, 60, 0.2)",
            borderLeft: "3px solid #ea580c",
          }}
        />
        <Typography variant="caption">Due Today</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            backgroundColor: "rgba(251, 191, 36, 0.2)",
            borderLeft: "3px solid #ca8a04",
          }}
        />
        <Typography variant="caption">Due Soon (1-2 days)</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 16, height: 16, backgroundColor: "transparent" }} />
        <Typography variant="caption">Normal Priority</Typography>
      </Box>
    </Box>
  </Box>
);

export default ColorLegend;
