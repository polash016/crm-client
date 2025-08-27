import React from "react";
import { Box, Typography } from "@mui/material";
import {
  countUrgent,
  countDueToday,
  countNoFollowUp,
  countRecentActivity,
} from "./utils";

const SummaryStats = ({ rows }) => {
  if (!rows || rows.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          p: 2,
          backgroundColor: "background.paper",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ textAlign: "center", minWidth: 100 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
            {rows.length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Leads
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", minWidth: 100 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "error.main" }}
          >
            {countUrgent(rows)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Urgent Follow-ups
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", minWidth: 100 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "warning.main" }}
          >
            {countDueToday(rows)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Due Today
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", minWidth: 100 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "info.main" }}>
            {countNoFollowUp(rows)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            No Follow-up
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", minWidth: 100 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "success.main" }}
          >
            {countRecentActivity(rows)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Recent Activity
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SummaryStats;
