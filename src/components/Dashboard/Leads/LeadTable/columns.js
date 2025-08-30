import React from "react";
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Avatar,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import SecurePhone from "@/components/Shared/SecurePhone";
import { getOutcomeColor, getTimeAgo } from "./utils";
import { useAuth } from "@/hooks/useAuth";

// Define conditional columns that can be added based on permissions
// This system allows for dynamic column visibility based on user roles and permissions
const conditionalColumns = {
  createdBy: {
    id: "createdBy",
    label: "Created By",
    render: (row) => {
      if (row?.createdBy && row.createdBy.profile) {
        const firstName = row.createdBy.profile.firstName || "";
        const lastName = row.createdBy.profile.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();
        const profileImg = row.createdBy.profile.profileImg;

        if (fullName) {
          // Get initials for fallback avatar
          const initials = `${firstName.charAt(0)}${lastName.charAt(
            0
          )}`.toUpperCase();

          return (
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                minWidth: 80,
              }}
            >
              <Tooltip title={fullName} placement="top" arrow>
                <Avatar
                  src={profileImg}
                  alt={fullName}
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    bgcolor: profileImg ? "transparent" : "primary.main",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.1)",
                      transition: "transform 0.2s ease-in-out",
                    },
                  }}
                >
                  {!profileImg && initials}
                </Avatar>
              </Tooltip>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.65rem", fontWeight: 500 }}
              >
                {row.createdBy.userType}
              </Typography>
            </Box>
          );
        }
      }

      return (
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.75rem" }}
          >
            System
          </Typography>
        </Box>
      );
    },
  },

  // Future conditional columns can be added here
  // Example: Admin-only columns, role-specific columns, etc.
  // lastLogin: { ... },
  // revenue: { ... },
  // performance: { ... },
};

// Custom hook to build columns with permission checks
export const useColumns = ({
  handleCallLog,
  handleOpenCallHistory,
  handleOpenAddFollowUpModal,
  handleOpenDetailsModal,
}) => {
  const { canCreate } = useAuth();

  const columns = [
    {
      id: "leadInfo",
      label: "Information",
      render: (row) => (
        <Box sx={{ minWidth: 160 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {row?.name || "No Name"}
          </Typography>
          {/* <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5 }}
        >
          {row?.phone || "No Phone"}
        </Typography> */}
          {/* {row?.address && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block" }}
          >
            📍{" "}
            {row.address.length > 50
              ? `${row.address.substring(0, 25)}...`
              : row.address}
          </Typography>
        )} */}
        </Box>
      ),
    },
    {
      id: "status",
      label: "Priority",
      render: (row) => {
        // Determine lead status based on follow-up data
        let status = "New";
        let statusColor = "default";
        let statusTextColor = "default";
        let priority = "Normal";
        let priorityColor = "default";

        if (row?.leadFollowUp && row.leadFollowUp.length > 0) {
          const lastFollowUp = row.leadFollowUp[row.leadFollowUp.length - 1];
          if (lastFollowUp.outcome === "COMPLETED") {
            status = "Followed Up";
            statusColor = "success";
            statusTextColor = "white";
          } else if (
            lastFollowUp.outcome === "NO_ANSWER" ||
            lastFollowUp.outcome === "BUSY"
          ) {
            status = "Contact Attempted";
            statusColor = "warning";
          }
        }

        // Determine priority based on nextFollowUpAt
        if (row?.nextFollowUpAt) {
          const followUpDate = new Date(row.nextFollowUpAt);
          const now = new Date();
          const timeDiff = followUpDate.getTime() - now.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            <Chip
              label={status}
              size="small"
              color={statusColor}
              sx={{ fontSize: "0.7rem", color: statusTextColor }}
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
      label: "Status",
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
        const timeDiff = followUpDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

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
      label: "Activity",
      render: (row) => {
        // Get the most recent activity (follow-up or call)
        let lastActivity = null;
        let activityType = "";
        let activityDate = null;

        // Check for last follow-up
        if (row?.leadFollowUp && row.leadFollowUp.length > 0) {
          const lastFollowUp = row.leadFollowUp[row.leadFollowUp.length - 1];
          if (lastFollowUp.attemptedAt) {
            lastActivity = lastFollowUp;
            activityType = "Follow-up";
            activityDate = new Date(lastFollowUp.attemptedAt);
          }
        }

        // Check for last call (if more recent)
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
            {/* Line 1: Type + Reason + TimeAgo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {activityType}:{" "}
                {row?.callLog[0]?.reason.slice(0, 15) || "No reason"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {timeAgo}
              </Typography>
            </Box>

            {/* Line 2: Outcome + Note (truncated) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                overflow: "hidden",
              }}
            >
              {row?.leadFollowUp[0]?.note && (
                <Tooltip
                  title={row.leadFollowUp[0].note}
                  placement="top"
                  arrow
                  slotProps={{
                    tooltip: {
                      sx: {
                        fontSize: ".9rem",
                      },
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    // sx={{ flex: 1, minWidth: 0 }}
                  >
                    Note: {row.leadFollowUp[0].note.slice(0, 20)}
                  </Typography>
                </Tooltip>
              )}

              {lastActivity.outcome && (
                <Chip
                  label={lastActivity.outcome}
                  size="small"
                  color={getOutcomeColor(lastActivity.outcome)}
                  sx={{ fontSize: "0.6rem", height: "20px", color: "white" }}
                />
              )}
            </Box>
          </Box>
        );
      },
    },
    // {
    //   id: "nextAction",
    //   label: "Next Action",
    //   render: (row) => {
    //     let actionText = "";
    //     let actionColor = "";
    //     let actionIcon = "";

    //     if (!row?.nextFollowUpAt) {
    //       actionText = "Schedule follow-up";
    //       actionColor = "warning";
    //       actionIcon = "📅";
    //     } else {
    //       const followUpDate = new Date(row.nextFollowUpAt);
    //       const now = new Date();
    //       const timeDiff = followUpDate.getTime() - now.getTime();
    //       const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    //       if (daysDiff < 0) {
    //         actionText = "Immediate follow-up";
    //         actionColor = "error";
    //         actionIcon = "🚨";
    //       } else if (daysDiff === 0) {
    //         actionText = "Follow up today";
    //         actionColor = "warning";
    //         actionIcon = "⚠️";
    //       } else if (daysDiff <= 2) {
    //         actionText = "Prepare for follow-up";
    //         actionColor = "info";
    //         actionIcon = "📋";
    //       } else {
    //         actionText = "Monitor progress";
    //         actionColor = "success";
    //         actionIcon = "✅";
    //       }
    //     }

    //     return (
    //       <Box sx={{ textAlign: "center", minWidth: 120 }}>
    //         <Typography
    //           variant="body2"
    //           sx={{
    //             fontWeight: 500,
    //             color: `${actionColor}.main`,
    //             mb: 0.5,
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "center",
    //             gap: 0,
    //             fontSize: "0.8rem",
    //           }}
    //         >
    //           {actionIcon} {actionText}
    //         </Typography>
    //         {row?.nextActionType && (
    //           <Chip
    //             label={row.nextActionType.replace(/_/g, " ")}
    //             size="small"
    //             color="primary"
    //             variant="outlined"
    //             sx={{ fontSize: "0.6rem", height: "20px" }}
    //           />
    //         )}
    //       </Box>
    //     );
    //   },
    // },
    {
      id: "healthCondition",
      label: "Health",
      render: (row) => {
        // Get latest health condition from follow-ups
        let healthCondition = "No data";
        let bp = null;
        let weight = null;
        let medicineEfficacy = null;
        let customMetricsText = null;

        if (row?.leadFollowUp && row.leadFollowUp.length > 0) {
          const latestFollowUp = row.leadFollowUp[0]; // Most recent first
          if (
            latestFollowUp.healthSnapshot &&
            latestFollowUp.healthSnapshot.length > 0
          ) {
            const latestSnapshot = latestFollowUp.healthSnapshot[0];
            healthCondition = latestSnapshot.condition || "No condition";
            bp = latestSnapshot.bp;
            weight = latestSnapshot.weight;

            // Get custom metrics if available
            if (
              latestSnapshot.metrics &&
              typeof latestSnapshot.metrics === "object"
            ) {
              const customMetrics = Object.entries(latestSnapshot.metrics);
              if (customMetrics.length > 0) {
                // Show first 2 custom metrics
                customMetricsText = customMetrics
                  .slice(0, 2)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ");
                if (customMetrics.length > 2) {
                  customMetricsText += "...";
                }
              }
            }
          }
          medicineEfficacy = latestFollowUp.medicineEfficacy;
        }

        return (
          <Box sx={{ minWidth: 140 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, mb: 0.5, fontSize: "0.75rem" }}
            >
              {healthCondition.length > 12
                ? `${healthCondition.substring(0, 10)}...`
                : healthCondition}
            </Typography>

            {/* Health vitals */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {bp && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.65rem" }}
                >
                  BP: {bp}
                </Typography>
              )}
              {weight && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.65rem" }}
                >
                  {weight}kg
                </Typography>
              )}
            </Box>

            {/* Custom metrics */}
            {customMetricsText && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.6rem", fontStyle: "italic" }}
              >
                {customMetricsText}
              </Typography>
            )}

            {/* Medicine efficacy */}
            {medicineEfficacy && (
              <Chip
                label={medicineEfficacy.replace(/_/g, " ").toLowerCase()}
                size="small"
                color={
                  medicineEfficacy === "EXCELLENT"
                    ? "success"
                    : medicineEfficacy === "GOOD"
                    ? "primary"
                    : medicineEfficacy === "MODERATE"
                    ? "warning"
                    : medicineEfficacy === "POOR"
                    ? "error"
                    : "default"
                }
                variant="outlined"
                sx={{ fontSize: "0.6rem", height: "18px", mt: 0.5 }}
              />
            )}
          </Box>
        );
      },
    },
    {
      id: "lastOutcome",
      label: "Last Call",
      render: (row) => {
        if (!row?.leadFollowUp || row.leadFollowUp.length === 0) {
          return (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.75rem" }}
            >
              No calls
            </Typography>
          );
        }

        const latestFollowUp = row.leadFollowUp[0];
        const outcome = latestFollowUp.outcome;
        const attemptedAt = new Date(latestFollowUp.attemptedAt);
        const timeAgo = getTimeAgo(attemptedAt);

        return (
          <Box sx={{ minWidth: 100 }}>
            <Chip
              label={outcome.replace(/_/g, " ").toLowerCase()}
              size="small"
              color={getOutcomeColor(outcome)}
              sx={{ fontSize: "0.6rem", height: "18px", mb: 0.5 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.65rem", display: "block" }}
            >
              {timeAgo}
            </Typography>
          </Box>
        );
      },
    },

    {
      id: "assignedTo",
      label: "Assigned To",
      render: (row) => {
        console.log({ row });
        if (row?.user && row.user.profile) {
          const firstName = row.user.profile.firstName || "";
          const lastName = row.user.profile.lastName || "";
          const fullName = `${firstName} ${lastName}`.trim();
          const profileImg = row.user.profile.profileImg;

          if (fullName) {
            // Get initials for fallback avatar
            const initials = `${firstName.charAt(0)}${lastName.charAt(
              0
            )}`.toUpperCase();

            return (
              <Box
                sx={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Tooltip title={fullName} placement="top" arrow>
                  <Avatar
                    src={profileImg}
                    alt={fullName}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      bgcolor: profileImg ? "transparent" : "primary.main",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.1)",
                        transition: "transform 0.2s ease-in-out",
                      },
                    }}
                  >
                    {!profileImg && initials}
                  </Avatar>
                </Tooltip>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.65rem", fontWeight: 500 }}
                >
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
          <Box sx={{ textAlign: "center" }}>
            <Chip
              label="Unassigned"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontSize: "0.7rem" }}
            />
          </Box>
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
            gap: 0.5,
            flexWrap: "wrap",
          }}
        >
          {/* Call Button */}
          <SecurePhone
            phoneNumber={row?.phone}
            onCall={(callData) => handleCallLog(row, callData)}
            variant="compact"
            userRole="employee"
            phoneId={`lead-${row?.id || row?._id}-phone`}
            row={row}
          />

          {/* Call History */}
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

          {/* Add Follow Up */}
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

          {/* View Details */}
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
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Dynamically add conditional columns based on permissions
  // To add a new conditional column:
  // 1. Add it to conditionalColumns object above
  // 2. Add the column key to conditionalColumnOrder array
  // 3. Add the permission check in the forEach loop
  const conditionalColumnOrder = ["createdBy"]; // Define order of conditional columns

  conditionalColumnOrder.forEach((columnKey) => {
    if (columnKey === "createdBy" && canCreate("csv")) {
      // Insert column before Actions column (second to last position)
      columns.splice(-1, 0, conditionalColumns[columnKey]);
    }
    // Add future permission checks here
    // Example: if (columnKey === 'revenue' && canCreate('revenue')) { ... }
  });

  return columns;
};
