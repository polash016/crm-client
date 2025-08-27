import React from "react";
import { Box, Typography, Chip, Tooltip, IconButton } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import SecurePhone from "@/components/Shared/SecurePhone";
import { getOutcomeColor, getTimeAgo } from "./utils";

export const buildColumns = ({
  handleCallLog,
  handleOpenCallHistory,
  handleOpenAddFollowUpModal,
  handleOpenDetailsModal,
}) => [
  {
    id: "leadInfo",
    label: "Lead Information",
    render: (row) => (
      <Box sx={{ minWidth: 200 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {row?.name || "No Name"}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5 }}
        >
          {row?.phone || "No Phone"}
        </Typography>
        {row?.address && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block" }}
          >
            📍{" "}
            {row.address.length > 50
              ? `${row.address.substring(0, 50)}...`
              : row.address}
          </Typography>
        )}
      </Box>
    ),
  },
  {
    id: "status",
    label: "Status & Priority",
    render: (row) => {
      let status = "New";
      let statusColor = "default";
      let priority = "Normal";
      let priorityColor = "default";

      if (row?.leadFollowUp && row.leadFollowUp.length > 0) {
        const lastFollowUp = row.leadFollowUp[row.leadFollowUp.length - 1];
        if (lastFollowUp.outcome === "COMPLETED") {
          status = "Followed Up";
          statusColor = "success";
        } else if (
          lastFollowUp.outcome === "NO_ANSWER" ||
          lastFollowUp.outcome === "BUSY"
        ) {
          status = "Contact Attempted";
          statusColor = "warning";
        }
      }

      if (row?.nextFollowUpAt) {
        const followUpDate = new Date(row.nextFollowUpAt);
        const now = new Date();
        const daysDiff = Math.ceil(
          (followUpDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
        );
        if (daysDiff < 0) {
          priority = "Urgent";
          priorityColor = "error";
        } else if (daysDiff === 0) {
          priority = "High";
          priorityColor = "warning";
        } else if (daysDiff <= 2) {
          priority = "Medium";
          priorityColor = "info";
        }
      }

      return (
        <Box sx={{ textAlign: "center" }}>
          <Chip
            label={status}
            size="small"
            color={statusColor}
            sx={{ mb: 1, fontSize: "0.7rem" }}
          />
          <Chip
            label={priority}
            size="small"
            color={priorityColor}
            variant="outlined"
            sx={{ fontSize: "0.7rem" }}
          />
        </Box>
      );
    },
  },
  {
    id: "followUpStatus",
    label: "Follow Up Status",
    render: (row) => {
      if (!row?.nextFollowUpAt) {
        return (
          <Box sx={{ textAlign: "center" }}>
            <Chip
              label="No Follow Up"
              size="small"
              color="default"
              variant="outlined"
              sx={{ fontSize: "0.7rem" }}
            />
          </Box>
        );
      }
      const followUpDate = new Date(row.nextFollowUpAt);
      const now = new Date();
      const daysDiff = Math.ceil(
        (followUpDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
      );
      let statusText = "";
      let statusColor = "";
      let urgencyIcon = "";
      if (daysDiff < 0) {
        statusText = `${Math.abs(daysDiff)} days overdue`;
        statusColor = "#dc2626";
        urgencyIcon = "🚨";
      } else if (daysDiff === 0) {
        statusText = "Due today";
        statusColor = "#ea580c";
        urgencyIcon = "⚠️";
      } else if (daysDiff === 1) {
        statusText = "Due tomorrow";
        statusColor = "#ca8a04";
        urgencyIcon = "📅";
      } else {
        statusText = `${daysDiff} days left`;
        statusColor = "#059669";
        urgencyIcon = "📋";
      }
      return (
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: statusColor,
              mb: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            {urgencyIcon} {statusText}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.7rem" }}
          >
            {followUpDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
        </Box>
      );
    },
  },
  {
    id: "lastActivity",
    label: "Last Activity",
    render: (row) => {
      let lastActivity = null;
      let activityType = "";
      let activityDate = null;
      if (row?.leadFollowUp && row.leadFollowUp.length > 0) {
        const lastFollowUp = row.leadFollowUp[row.leadFollowUp.length - 1];
        if (lastFollowUp.attemptedAt) {
          lastActivity = lastFollowUp;
          activityType = "Follow-up";
          activityDate = new Date(lastFollowUp.attemptedAt);
        }
      }
      if (row?.callLog && row.callLog.length > 0) {
        const lastCall = row.callLog[row.callLog.length - 1];
        if (lastCall.createdAt) {
          const callDate = new Date(lastCall.createdAt);
          if (!activityDate || callDate > activityDate) {
            lastActivity = lastCall;
            activityType = "Call";
            activityDate = callDate;
          }
        }
      }
      if (!lastActivity) {
        return (
          <Typography variant="body2" color="text.secondary">
            No activity
          </Typography>
        );
      }
      const timeAgo = getTimeAgo(activityDate);
      return (
        <Box sx={{ minWidth: 150 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
            {activityType}: {lastActivity.reason || "No reason"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {timeAgo}
          </Typography>
          {lastActivity.outcome && (
            <Chip
              label={lastActivity.outcome}
              size="small"
              color={getOutcomeColor(lastActivity.outcome)}
              sx={{ mt: 0.5, fontSize: "0.6rem", height: "20px" }}
            />
          )}
        </Box>
      );
    },
  },
  {
    id: "nextAction",
    label: "Next Action Needed",
    render: (row) => {
      let actionText = "";
      let actionColor = "";
      let actionIcon = "";
      if (!row?.nextFollowUpAt) {
        actionText = "Schedule follow-up";
        actionColor = "warning";
        actionIcon = "📅";
      } else {
        const followUpDate = new Date(row.nextFollowUpAt);
        const daysDiff = Math.ceil(
          (followUpDate.getTime() - Date.now()) / (1000 * 3600 * 24)
        );
        if (daysDiff < 0) {
          actionText = "Immediate follow-up needed";
          actionColor = "error";
          actionIcon = "🚨";
        } else if (daysDiff === 0) {
          actionText = "Follow up today";
          actionColor = "warning";
          actionIcon = "⚠️";
        } else if (daysDiff <= 2) {
          actionText = "Prepare for follow-up";
          actionColor = "info";
          actionIcon = "📋";
        } else {
          actionText = "Monitor progress";
          actionColor = "success";
          actionIcon = "✅";
        }
      }
      return (
        <Box sx={{ textAlign: "center", minWidth: 120 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: `${actionColor}.main`,
              mb: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            {actionIcon} {actionText}
          </Typography>
          {row?.nextActionType && (
            <Chip
              label={row.nextActionType.replace(/_/g, " ")}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.6rem", height: "20px" }}
            />
          )}
        </Box>
      );
    },
  },
  {
    id: "assignedTo",
    label: "Assigned To",
    render: (row) => {
      if (row?.user && row.user.profile) {
        const firstName = row.user.profile.firstName || "";
        const lastName = row.user.profile.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();
        if (fullName) {
          return (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                {fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.user.userType}
              </Typography>
            </Box>
          );
        }
      }
      if (row?.assignedToId) {
        return (
          <Box sx={{ textAlign: "center" }}>
            <Chip
              label="Assigned"
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontSize: "0.7rem" }}
            />
          </Box>
        );
      }
      return (
        <Chip
          label="Unassigned"
          size="small"
          color="warning"
          variant="outlined"
          sx={{ fontSize: "0.7rem" }}
        />
      );
    },
  },
  {
    id: "actions",
    label: "Actions",
    render: (row) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <SecurePhone
          phoneNumber={row?.phone}
          onCall={(callData) => handleCallLog(row, callData)}
          variant="compact"
          userRole="employee"
          phoneId={`lead-${row?.id || row?._id}-phone`}
          row={row}
        />
        <Tooltip title="View call history">
          <IconButton
            size="small"
            onClick={() => handleOpenCallHistory(row)}
            sx={{
              p: 0.5,
              color: "info.main",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <HistoryIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Follow Up">
          <IconButton
            size="small"
            onClick={() => handleOpenAddFollowUpModal(row)}
            sx={{
              background: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              "&:hover": {
                background: "rgba(16, 185, 129, 0.2)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="View lead details">
          <IconButton
            size="small"
            onClick={() => handleOpenDetailsModal(row)}
            sx={{
              background: "rgba(59, 130, 246, 0.1)",
              color: "#3b82f6",
              "&:hover": {
                background: "rgba(59, 130, 246, 0.2)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];
