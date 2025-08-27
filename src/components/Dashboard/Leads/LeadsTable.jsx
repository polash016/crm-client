"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  useBulkDeleteLeadsMutation,
  useGetLeadsQuery,
} from "@/redux/api/leadsApi";
import {
  useAssignLeadMutation,
  useBulkAssignLeadsMutation,
} from "@/redux/api/leadsApi";
import { useDebounced } from "@/redux/hooks";
import ModernTable from "@/components/Shared/ModernTable";
import { getOutcomeColor, getRowStyling, getTimeAgo } from "./LeadTable/utils";
import ResponsiveContainer from "@/components/Shared/ResponsiveContainer";
import DSPagination from "@/components/Dashboard/pagination/DSPagination";
import SecurePhone from "@/components/Shared/SecurePhone";
import CallHistory from "@/components/Shared/CallHistory";
import AssignmentModal from "./AssignmentModal";
import NewLeadModal from "./NewLeadModal";
import LeadDetailsModal from "./LeadDetailsModal";
import AddFollowUpModal from "./AddFollowUpModal";
import { PhoneVisibilityProvider } from "@/contexts/PhoneVisibilityContext";
import { toast } from "sonner";
import SummaryStats from "./LeadTable/SummaryStats";
import { useAuth } from "@/hooks/useAuth";

const LeadsTable = () => {
  const { canCreate, canDelete, hasAnyPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [selectedRows, setSelectedRows] = useState([]);
  const [callHistoryOpen, setCallHistoryOpen] = useState(false);
  const [selectedLeadForHistory, setSelectedLeadForHistory] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [assignmentFilter, setAssignmentFilter] = useState("all"); // all, assigned, unassigned
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive, etc.
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedLeadForAssignment, setSelectedLeadForAssignment] =
    useState(null);
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState(null);
  const [addFollowUpModalOpen, setAddFollowUpModalOpen] = useState(false);
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState(null);

  // API mutations for assignment
  const [assignLead] = useAssignLeadMutation();
  const [bulkAssignLeads] = useBulkAssignLeadsMutation();
  const [bulkDeleteLeads] = useBulkDeleteLeadsMutation();

  const query = {};

  // Debounced search
  const debouncedTerm = useDebounced({ searchQuery: searchTerm, delay: 500 });

  // Keyboard shortcut for ESC key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && selectedRows.length > 0) {
        handleClearSelection();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedRows.length]);

  // helpers moved to LeadTable/utils

  // Build query object like ProductTable

  if (!!debouncedTerm) {
    query["searchTerm"] = searchTerm;
  }

  // Add filters to query
  if (assignmentFilter !== "all") {
    query["assignmentFilter"] = assignmentFilter;
  }

  if (statusFilter !== "all") {
    query["statusFilter"] = statusFilter;
  }

  query["page"] = page;
  query["limit"] = limit;

  const {
    data: leadsData,
    isLoading: leadsLoading,
    error,
    refetch,
  } = useGetLeadsQuery({ ...query });

  const rows = leadsData?.data || [];
  const canUseCsvMulti = hasAnyPermission([
    "manage_csvs",
    "create_csv",
    "delete_csv",
  ]);
  const totalPages = Math.ceil((leadsData?.meta?.total || 0) / limit);
  const totalItems = leadsData?.meta?.total || 0;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Clear selection when page changes
    setSelectedRows([]);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
    // Clear selection when limit changes
    setSelectedRows([]);
  };

  // Selection handlers
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleSelectAll = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleClearSelection = () => {
    setSelectedRows([]);
  };

  // Bulk action handlers
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;

    const res = bulkDeleteLeads(selectedRows).unwrap();
    toast.promise(Promise.resolve(res), {
      loading: "Deleting...",
      success: (res) => {
        setSelectedRows([]);
        return res?.message || "Leads deleted successfully";
      },
      error: (error) => error?.message || "Something went wrong",
    });
  };

  const handleBulkExport = () => {
    if (selectedRows.length === 0) return;

    const exportPromise = (async () => {
      // TODO: Implement actual bulk export API call

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
    })();

    toast.promise(exportPromise, {
      loading: `Exporting ${selectedRows.length} leads...`,
      success: `Exported ${selectedRows.length} leads successfully!`,
      error: "Failed to export leads. Please try again.",
    });
  };

  const handleFilteredExport = () => {
    const exportPromise = (async () => {
      // TODO: Implement actual filtered export API call

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    })();

    toast.promise(exportPromise, {
      loading: "Exporting filtered leads...",
      success: "Filtered leads exported successfully!",
      error: "Failed to export filtered leads. Please try again.",
    });
  };

  // Call logging function
  const handleCallLog = (lead, callData) => {
    // TODO: Send call log to backend API
    const callLog = {
      leadId: lead.id || lead._id,
      leadName: lead.name,
      phoneNumber: lead.phone,
      callData: {
        ...callData,
        employeeId: "current-user-id", // TODO: Get from auth context
        employeeName: "Current User", // TODO: Get from auth context
        timestamp: new Date().toISOString(),
      },
      status: "initiated",
    };

    // Here you would typically send this to your backend
    // await logCall(callLog);

    // Show success feedback
    toast.success(`Call initiated to ${lead.name} at ${lead.phone}`);
  };

  // Call history handlers
  const handleOpenCallHistory = (lead) => {
    setSelectedLeadForHistory(lead?.callLog);
    setCallHistoryOpen(true);
  };

  const handleCloseCallHistory = () => {
    setCallHistoryOpen(false);
    setSelectedLeadForHistory(null);
  };

  // Details modal handlers
  const handleOpenDetailsModal = (lead) => {
    setSelectedLeadForDetails(lead);
    setDetailsModalOpen(true);
  };

  // const handleCloseDetailsModal = () => {
  //   setDetailsModalOpen(false);
  //   setSelectedLeadForDetails(null);
  // };

  // Add Follow Up modal handlers
  const handleOpenAddFollowUpModal = (lead) => {
    setSelectedLeadForFollowUp(lead);
    setAddFollowUpModalOpen(true);
  };

  // const handleCloseAddFollowUpModal = () => {
  //   setAddFollowUpModalOpen(false);
  //   setSelectedLeadForFollowUp(null);
  // };

  const handleNewCallFromHistory = (callData) => {
    // This will trigger a new call from the call history
    // You could implement additional logic here
  };

  // Assignment handlers
  // const handleOpenAssignmentModal = (lead) => {
  //   setSelectedLeadForAssignment(lead);
  //   setAssignmentModalOpen(true);
  // };

  const handleCloseAssignmentModal = () => {
    setAssignmentModalOpen(false);
    setSelectedLeadForAssignment(null);
  };

  // Handle individual lead assignment
  const handleAssignLead = async (leadId, userId) => {
    try {
      const res = await assignLead({ leadId, assignedToId: userId }).unwrap();
      toast.promise(Promise.resolve(res), {
        loading: "Creating...",
        success: (res) => {
          if (res?.data?.id) {
            handleCloseAssignmentModal();
            return res?.message || "Lead assigned successfully";
          }
          return res?.message || "Lead assigned";
        },
        error: (error) => error?.message || "Something went wrong",
      });
    } catch (error) {
      toast.error(error?.message || "Failed to assign lead");
    }
  };

  // Handle bulk assignment
  const handleBulkAssignment = async (leadIds, userId) => {
    try {
      const res = await bulkAssignLeads({
        leadIds,
        assignedToId: userId,
      }).unwrap();
      toast.promise(Promise.resolve(res), {
        loading: "Creating...",
        success: (res) => {
          if (res?.data?.id) {
            handleCloseAssignmentModal();
            return res?.message || "Leads assigned successfully";
          }
          return res?.message || "Leads assigned";
        },
        error: (error) => error?.message || "Something went wrong",
      });
    } catch (error) {
      toast.error(error?.message || "Failed to assign leads");
    }

    const bulkAssignmentPromise = (async () => {
      // Call the real API

      // Clear selection after successful assignment
      setSelectedRows([]);

      // Close modal
      handleCloseAssignmentModal();

      // Refresh the leads data
      refetch();
    })();

    toast.promise(bulkAssignmentPromise, {
      loading: `Assigning ${leadIds.length} leads...`,
      success: `${leadIds.length} leads assigned successfully!`,
      error: "Failed to assign leads. Please try again.",
    });
  };

  // Unified assignment handler for the modal
  const handleAssignment = async (assignmentData) => {
    if (assignmentData.type === "bulk") {
      // Bulk assignment
      // selectedRows already contains the ID strings directly
      const leadIds = selectedRows.filter(
        (id) => id && id !== null && id !== undefined
      );

      // Safety check: ensure we have valid IDs
      if (leadIds.length === 0) {
        toast.error("No valid leads selected for assignment");
        return;
      }

      await handleBulkAssignment(leadIds, assignmentData.userId);
    } else if (assignmentData.type === "single") {
      // Individual assignment
      await handleAssignLead(assignmentData.leadId, assignmentData.userId);
    }
  };

  // Bulk assignment handler
  const handleBulkAssign = () => {
    if (selectedRows.length === 0) return;

    // For bulk assignment, we'll open the modal with a special flag
    // indicating it's for bulk assignment
    setSelectedLeadForAssignment({
      id: "bulk",
      name: `${selectedRows.length} selected leads`,
      phone: "Multiple leads",
      status: "bulk",
    });
    setAssignmentModalOpen(true);
  };

  // Filter handlers
  // const handleFilterClick = (event) => {
  //   setFilterAnchorEl(event.currentTarget);
  // };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleAssignmentFilterChange = (value) => {
    setAssignmentFilter(value);
    setPage(1); // Reset to first page when filter changes
    setSelectedRows([]); // Clear selection when filter changes
    handleFilterClose();
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page when filter changes
    setSelectedRows([]); // Clear selection when filter changes
    handleFilterClose();
  };

  const handleClearFilters = () => {
    // If there are active filters, ask for confirmation
    if (hasActiveFilters) {
      const confirmed = window.confirm(
        `Are you sure you want to clear all filters? This will show all ${
          leadsData?.meta?.total || 0
        } leads.`
      );
      if (!confirmed) return;
    }

    setAssignmentFilter("all");
    setStatusFilter("all");
    setPage(1); // Reset to first page when filters are cleared
    setSelectedRows([]); // Clear selection when filters are cleared

    // Show feedback
    toast.success("All filters cleared successfully!");
  };

  const hasActiveFilters = assignmentFilter !== "all" || statusFilter !== "all";

  const handleBulkEdit = () => {
    if (selectedRows.length === 0) return;

    toast.info("Bulk edit functionality coming soon!");
  };

  // New Lead handlers
  const handleOpenNewLeadModal = () => {
    setNewLeadModalOpen(true);
  };

  const handleCloseNewLeadModal = () => {
    setNewLeadModalOpen(false);
  };

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
          {row?.address && (
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
          )}
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
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  // sx={{ flex: 1, minWidth: 0 }}
                >
                  Note: {row.leadFollowUp[0].note}
                </Typography>
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
    {
      id: "nextAction",
      label: "Next Action",
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
          const now = new Date();
          const timeDiff = followUpDate.getTime() - now.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

          if (daysDiff < 0) {
            actionText = "Immediate follow-up";
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
                fontWeight: 500,
                color: `${actionColor}.main`,
                mb: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0,
                fontSize: "0.8rem",
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
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, mb: 0.5, fontSize: "0.8rem" }}
                >
                  {fullName}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.7rem" }}
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
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (error) {
    return (
      <ResponsiveContainer>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="error">
            Error loading leads data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error?.data?.message || "Something went wrong"}
          </Typography>
        </Box>
      </ResponsiveContainer>
    );
  }

  return (
    <PhoneVisibilityProvider>
      <ResponsiveContainer>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}
              >
                Leads
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Manage your leads and customer information
              </Typography>
            </Box>

            {/* Summary Statistics for Employees */}
            {rows.length > 0 && <SummaryStats rows={rows} />}

            {/* Search and New Lead Container */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                minWidth: { xs: "100%", md: "auto" },
              }}
            >
              {/* Search Field */}
              <Box sx={{ minWidth: { xs: "100%", md: "300px" } }}>
                <TextField
                  size="small"
                  placeholder="Search leads by name, phone, address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.paper",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                      },
                    },
                  }}
                />
              </Box>

              {/* New Lead Button */}
              {canCreate("csv") && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenNewLeadModal}
                  sx={{
                    backgroundColor: "success.main",
                    "&:hover": {
                      backgroundColor: "success.dark",
                    },
                    minWidth: "auto",
                    px: 2,
                    py: 1,
                    height: "40px", // Match TextField height
                    whiteSpace: "nowrap",
                  }}
                >
                  New Lead
                </Button>
              )}
            </Box>

            {/* Filter Button */}
          </Box>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                background: "rgba(59, 130, 246, 0.05)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: 500 }}
                >
                  Active Filters:
                </Typography>

                {assignmentFilter !== "all" && (
                  <Chip
                    label={`Assignment: ${
                      assignmentFilter === "assigned"
                        ? "Assigned"
                        : "Unassigned"
                    }`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    onDelete={() => handleAssignmentFilterChange("all")}
                  />
                )}

                {statusFilter !== "all" && (
                  <Chip
                    label={`Status: ${
                      statusFilter.charAt(0).toUpperCase() +
                      statusFilter.slice(1)
                    }`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    onDelete={() => handleStatusFilterChange("all")}
                  />
                )}
              </Box>

              <Button
                size="small"
                variant="text"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                sx={{ color: "primary.main" }}
              >
                Clear All
              </Button>
            </Box>
          )}

          {/* Quick Filter Buttons */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Quick Filters:
            </Typography>

            <Button
              size="small"
              variant={
                assignmentFilter === "unassigned" ? "contained" : "outlined"
              }
              onClick={() => handleAssignmentFilterChange("unassigned")}
              sx={{ minWidth: "auto" }}
            >
              Unassigned
            </Button>

            <Button
              size="small"
              variant={
                assignmentFilter === "assigned" ? "contained" : "outlined"
              }
              onClick={() => handleAssignmentFilterChange("assigned")}
              sx={{ minWidth: "auto" }}
            >
              Assigned
            </Button>

            <Button
              size="small"
              variant={statusFilter === "new" ? "contained" : "outlined"}
              onClick={() => handleStatusFilterChange("new")}
              sx={{ minWidth: "auto" }}
            >
              New Leads
            </Button>

            {/* Filtered Export Button */}
            {hasActiveFilters && (
              <Button
                size="small"
                variant="outlined"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={handleFilteredExport}
                sx={{ minWidth: "auto" }}
              >
                Export Filtered
              </Button>
            )}
          </Box>

          {/* Bulk Actions Bar */}
          {canUseCsvMulti && selectedRows.length > 0 && (
            <Box
              sx={{
                background: "rgba(59, 130, 246, 0.05)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: 2,
                p: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={`${selectedRows.length} selected`}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Bulk actions available
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={handleClearSelection}
                  sx={{
                    minWidth: "auto",
                    color: "text.secondary",
                    "&:hover": {
                      color: "text.primary",
                    },
                  }}
                >
                  Clear
                </Button>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {canCreate("csv") && (
                  <Tooltip title="Assign selected leads">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleBulkAssign}
                      sx={{ minWidth: "auto" }}
                    >
                      Assign
                    </Button>
                  </Tooltip>
                )}

                {/* <Tooltip title="Export selected leads">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleBulkExport}
                  sx={{ minWidth: "auto" }}
                >
                  Export
                </Button>
              </Tooltip> */}

                {canDelete("csv") && (
                  <Tooltip title="Delete selected leads">
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleBulkDelete}
                      sx={{ minWidth: "auto" }}
                    >
                      Delete
                    </Button>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          )}

          {/* Selection Info */}
          {canUseCsvMulti && selectedRows.length > 0 && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                background: "rgba(16, 185, 129, 0.05)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                color="success.main"
                sx={{ fontWeight: 500 }}
              >
                ✓ {selectedRows.length} lead
                {selectedRows.length !== 1 ? "s" : ""} selected
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Use bulk actions above or press ESC to clear selection
              </Typography>
            </Box>
          )}

          {/* No Selection Info */}
          {canUseCsvMulti && selectedRows.length === 0 && rows.length > 0 && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                background: "rgba(148, 163, 184, 0.05)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                💡 Select leads using the checkboxes to perform bulk actions
              </Typography>
            </Box>
          )}

          <ModernTable
            title="Leads Data"
            subtitle={
              hasActiveFilters
                ? `${totalItems} leads found (filtered) • ${
                    assignmentFilter !== "all"
                      ? `${
                          assignmentFilter === "assigned"
                            ? "Assigned"
                            : "Unassigned"
                        } leads`
                      : ""
                  } ${
                    statusFilter !== "all"
                      ? `• ${
                          statusFilter.charAt(0).toUpperCase() +
                          statusFilter.slice(1)
                        } status`
                      : ""
                  }`
                : `${totalItems} total leads`
            }
            columns={columns}
            data={rows}
            loading={leadsLoading}
            showActions={false}
            emptyMessage={
              hasActiveFilters
                ? "No leads match the current filters. Try adjusting your filter criteria."
                : "No leads found"
            }
            // Selection props
            selectable={canUseCsvMulti}
            selectedRows={selectedRows}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
            // Custom actions
            customActions={true}
            // renderActions={(row) => (
            //   <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
            //     <Tooltip title="Assign lead">
            //       <IconButton
            //         size="small"
            //         onClick={() => handleOpenAssignmentModal(row)}
            //         sx={{
            //           background: "rgba(16, 185, 129, 0.1)",
            //           color: "#10b981",
            //           "&:hover": {
            //             background: "rgba(16, 185, 129, 0.2)",
            //             transform: "scale(1.1)",
            //           },
            //           transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            //         }}
            //       >
            //         <EditIcon fontSize="small" />
            //       </IconButton>
            //     </Tooltip>
            //   </Box>
            // )}
            // Custom row styling
            getRowProps={(row) => getRowStyling(row)}
          />

          {!leadsLoading && (
            <DSPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              limit={limit}
              onLimitChange={handleLimitChange}
              total={totalItems}
            />
          )}

          {/* Call History Dialog */}
          {selectedLeadForHistory && (
            <CallHistory
              open={callHistoryOpen}
              onClose={handleCloseCallHistory}
              leadId={selectedLeadForHistory.id || selectedLeadForHistory._id}
              leadName={selectedLeadForHistory.name}
              phoneNumber={selectedLeadForHistory.phone}
              callHistory={selectedLeadForHistory}
              onNewCall={handleNewCallFromHistory}
            />
          )}

          {/* Assignment Modal */}
          {selectedLeadForAssignment && (
            <AssignmentModal
              open={assignmentModalOpen}
              setOpen={setAssignmentModalOpen}
              lead={selectedLeadForAssignment}
              onAssign={handleAssignment}
            />
          )}

          {/* New Lead Modal */}
          <NewLeadModal open={newLeadModalOpen} setOpen={setNewLeadModalOpen} />

          {/* Lead Details Modal */}
          <LeadDetailsModal
            open={detailsModalOpen}
            setOpen={setDetailsModalOpen}
            lead={selectedLeadForDetails}
          />

          {/* Add Follow Up Modal */}
          <AddFollowUpModal
            open={addFollowUpModalOpen}
            setOpen={setAddFollowUpModalOpen}
            lead={selectedLeadForFollowUp}
          />
        </Box>
      </ResponsiveContainer>
    </PhoneVisibilityProvider>
  );
};

export default LeadsTable;
