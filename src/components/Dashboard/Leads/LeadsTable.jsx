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
} from "@mui/icons-material";
import { useGetLeadsQuery } from "@/redux/api/leadsApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import {
  useAssignLeadMutation,
  useBulkAssignLeadsMutation,
} from "@/redux/api/leadsApi";
import { useDebounced } from "@/redux/hooks";
import ModernTable from "@/components/Shared/ModernTable";
import ResponsiveContainer from "@/components/Shared/ResponsiveContainer";
import DSPagination from "@/components/Dashboard/pagination/DSPagination";
import SecurePhone from "@/components/Shared/SecurePhone";
import CallHistory from "@/components/Shared/CallHistory";
import AssignmentModal from "./AssignmentModal";
import NewLeadModal from "./NewLeadModal";
import { toast } from "sonner";

const LeadsTable = () => {
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

  // API mutations for assignment
  const [assignLead] = useAssignLeadMutation();
  const [bulkAssignLeads] = useBulkAssignLeadsMutation();

  // Debounced search
  const debouncedSearchTerm = useDebounced(searchTerm, 500);

  // Load filters from localStorage on component mount
  useEffect(() => {
    const savedAssignmentFilter = localStorage.getItem("leadsAssignmentFilter");
    const savedStatusFilter = localStorage.getItem("leadsStatusFilter");

    if (savedAssignmentFilter) {
      setAssignmentFilter(savedAssignmentFilter);
    }
    if (savedStatusFilter) {
      setStatusFilter(savedStatusFilter);
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("leadsAssignmentFilter", assignmentFilter);
  }, [assignmentFilter]);

  useEffect(() => {
    localStorage.setItem("leadsStatusFilter", statusFilter);
  }, [statusFilter]);

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

  // Build query object like ProductTable
  const query = {};

  if (!!debouncedSearchTerm) {
    query["searchTerm"] = debouncedSearchTerm;
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

  console.log("query", query);

  const {
    data: leadsData,
    isLoading: leadsLoading,
    error,
    refetch,
  } = useGetLeadsQuery({ ...query });

  const rows = leadsData?.data || [];
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
    console.log("handleSelectionChange called with:", newSelection);
    setSelectedRows(newSelection);
  };

  const handleSelectAll = (newSelection) => {
    console.log("handleSelectAll called with:", newSelection);
    setSelectedRows(newSelection);
  };

  const handleClearSelection = () => {
    console.log("handleClearSelection called");
    setSelectedRows([]);
  };

  // Bulk action handlers
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;

    const deletePromise = (async () => {
      // TODO: Implement actual bulk delete API call
      console.log("Bulk deleting leads:", selectedRows);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear selection after successful deletion
      setSelectedRows([]);
    })();

    toast.promise(deletePromise, {
      loading: `Deleting ${selectedRows.length} leads...`,
      success: `${selectedRows.length} leads deleted successfully!`,
      error: "Failed to delete leads. Please try again.",
    });
  };

  const handleBulkExport = () => {
    if (selectedRows.length === 0) return;

    const exportPromise = (async () => {
      // TODO: Implement actual bulk export API call
      console.log("Bulk exporting leads:", selectedRows);

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
      console.log("Exporting filtered leads with filters:", {
        assignmentFilter,
        statusFilter,
        searchTerm,
      });

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

    console.log("Call log:", callLog);

    // Here you would typically send this to your backend
    // await logCall(callLog);

    // Show success feedback
    toast.success(`Call initiated to ${lead.name} at ${lead.phone}`);
  };

  // Call history handlers
  const handleOpenCallHistory = (lead) => {
    setSelectedLeadForHistory(lead);
    setCallHistoryOpen(true);
  };

  const handleCloseCallHistory = () => {
    setCallHistoryOpen(false);
    setSelectedLeadForHistory(null);
  };

  const handleNewCallFromHistory = (callData) => {
    // This will trigger a new call from the call history
    console.log("New call from history:", callData);
    // You could implement additional logic here
  };

  // Assignment handlers
  const handleOpenAssignmentModal = (lead) => {
    setSelectedLeadForAssignment(lead);
    setAssignmentModalOpen(true);
  };

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
    console.log("leadIds", leadIds);
    console.log("userId", userId);

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
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

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

    // TODO: Implement bulk edit functionality
    console.log("Bulk edit for:", selectedRows);
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
      id: "name",
      label: "Name",
      render: (row) => row?.name || "-",
    },
    {
      id: "phone",
      label: "Phone",
      render: (row) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            gap: 1,
          }}
        >
          <SecurePhone
            phoneNumber={row?.phone}
            onCall={(callData) => handleCallLog(row, callData)}
            variant="compact"
            userRole="employee"
          />
          {/* Security indicator */}
          {/* <Tooltip title="Phone number is masked for security">
            <SecurityIcon
              fontSize="small"
              color="action"
              sx={{ opacity: 0.6 }}
            />
          </Tooltip> */}
          {/* Call History Button */}
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
        </Box>
      ),
    },
    {
      id: "address",
      label: "Address",
      render: (row) => `${row?.address?.slice(0, 20)}...` || "-",
    },
    {
      id: "assignedtoId",
      label: "Assigned To",
      render: (row) => {
        // Check if we have the assignedTo user data with profile
        if (row?.user && row.user.profile) {
          const firstName = row.user.profile.firstName || "";
          const lastName = row.user.profile.lastName || "";
          const fullName = `${firstName} ${lastName}`.trim();

          if (fullName) {
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.user.email}
                </Typography>
              </Box>
            );
          }
        }

        // Check if we have assignedToId but no user data
        if (row?.assignedToId) {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label="Assigned"
                size="small"
                color="success"
                variant="outlined"
                sx={{ fontSize: "0.75rem" }}
              />
              <Tooltip title="User details not available">
                <Typography variant="caption" color="text.secondary">
                  {row?.user?.profile?.firstName
                    ? `${row?.user?.profile?.firstName} ${row?.user?.profile?.lastName}`
                    : "ID: " + row.assignedToId}
                </Typography>
              </Tooltip>
            </Box>
          );
        }

        return (
          <Chip
            label="Unassigned"
            size="small"
            color="warning"
            variant="outlined"
            sx={{ fontSize: "0.75rem" }}
          />
        );
      },
    },
    {
      id: "source",
      label: "Source",
      render: (row) => row?.source || "-",
    },
    {
      id: "status",
      label: "Status",
      render: (row) => {
        const status = row?.status || "new";
        const getStatusColor = (status) => {
          switch (status.toLowerCase()) {
            case "new":
              return { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" };
            case "contacted":
              return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
            case "qualified":
              return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
            case "unqualified":
              return { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" };
            case "converted":
              return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
            case "lost":
              return { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" };
            default:
              return { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" };
          }
        };

        const statusConfig = getStatusColor(status);

        return (
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              border: `1px solid ${statusConfig.border}`,
              fontWeight: 600,
              fontSize: "0.75rem",
              height: "24px",
            }}
          />
        );
      },
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
                    assignmentFilter === "assigned" ? "Assigned" : "Unassigned"
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
                    statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
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
            variant={assignmentFilter === "assigned" ? "contained" : "outlined"}
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
        {selectedRows.length > 0 && (
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
            </Stack>
          </Box>
        )}

        {/* Selection Info */}
        {selectedRows.length > 0 && (
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
              ✓ {selectedRows.length} lead{selectedRows.length !== 1 ? "s" : ""}{" "}
              selected
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Use bulk actions above or press ESC to clear selection
            </Typography>
          </Box>
        )}

        {/* No Selection Info */}
        {selectedRows.length === 0 && rows.length > 0 && (
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
          showActions={true}
          emptyMessage={
            hasActiveFilters
              ? "No leads match the current filters. Try adjusting your filter criteria."
              : "No leads found"
          }
          // Selection props
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={handleSelectionChange}
          onSelectAll={handleSelectAll}
          // Custom actions
          customActions={true}
          renderActions={(row) => (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
              <Tooltip title="Assign lead">
                <IconButton
                  size="small"
                  onClick={() => handleOpenAssignmentModal(row)}
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
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
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
            callHistory={[
              // Mock call history data - replace with actual API call
              {
                id: 1,
                status: "completed",
                timestamp: new Date(
                  Date.now() - 24 * 60 * 60 * 1000
                ).toISOString(),
                duration: 180,
                employeeName: "John Doe",
                reason: "Follow up call",
                notes: "Customer was interested in our services",
              },
              {
                id: 2,
                status: "missed",
                timestamp: new Date(
                  Date.now() - 2 * 24 * 60 * 60 * 1000
                ).toISOString(),
                duration: 0,
                employeeName: "Jane Smith",
                reason: "Initial contact",
                notes: "No answer, left voicemail",
              },
            ]}
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
      </Box>
    </ResponsiveContainer>
  );
};

export default LeadsTable;

// {/* <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//             <Tooltip title="Filter leads">
//               <IconButton
//                 onClick={handleFilterClick}
//                 sx={{
//                   backgroundColor: hasActiveFilters
//                     ? "primary.main"
//                     : "background.paper",
//                   color: hasActiveFilters ? "white" : "text.primary",
//                   border: "1px solid",
//                   borderColor: hasActiveFilters ? "primary.main" : "divider",
//                   "&:hover": {
//                     backgroundColor: hasActiveFilters
//                       ? "primary.dark"
//                       : "action.hover",
//                   },
//                 }}
//               >
//                 <FilterIcon />
//               </IconButton>
//             </Tooltip>

//             {/* Filter Menu */}
//             <Menu
//               anchorEl={filterAnchorEl}
//               open={Boolean(filterAnchorEl)}
//               onClose={handleFilterClose}
//               PaperProps={{
//                 sx: {
//                   minWidth: 250,
//                   mt: 1,
//                   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
//                   border: "1px solid rgba(148, 163, 184, 0.2)",
//                 },
//               }}
//             >
//               <Box
//                 sx={{
//                   p: 2,
//                   borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
//                 }}
//               >
//                 <Typography
//                   variant="subtitle2"
//                   fontWeight={600}
//                   color="text.primary"
//                 >
//                   Filter Leads
//                 </Typography>
//               </Box>

//               <Box sx={{ p: 2 }}>
//                 {/* Assignment Filter */}
//                 <FormControl fullWidth size="small" sx={{ mb: 2 }}>
//                   <InputLabel>Assignment Status</InputLabel>
//                   <Select
//                     value={assignmentFilter}
//                     label="Assignment Status"
//                     onChange={(e) =>
//                       handleAssignmentFilterChange(e.target.value)
//                     }
//                   >
//                     <MenuItem value="all">All Leads</MenuItem>
//                     <MenuItem value="assigned">Assigned Leads</MenuItem>
//                     <MenuItem value="unassigned">Unassigned Leads</MenuItem>
//                   </Select>
//                 </FormControl>

//                 {/* Status Filter */}
//                 <FormControl fullWidth size="small" sx={{ mb: 2 }}>
//                   <InputLabel>Lead Status</InputLabel>
//                   <Select
//                     value={statusFilter}
//                     label="Lead Status"
//                     onChange={(e) => handleStatusFilterChange(e.target.value)}
//                   >
//                     <MenuItem value="all">All Statuses</MenuItem>
//                     <MenuItem value="new">New Leads</MenuItem>
//                     <MenuItem value="contacted">Contacted</MenuItem>
//                     <MenuItem value="unqualified">Unqualified</MenuItem>
//                     <MenuItem value="converted">Converted</MenuItem>
//                     <MenuItem value="lost">Lost</MenuItem>
//                   </Select>
//                 </FormControl>

//                 {/* Clear Filters Button */}
//                 {hasActiveFilters && (
//                   <Button
//                     fullWidth
//                     variant="outlined"
//                     startIcon={<ClearIcon />}
//                     onClick={handleClearFilters}
//                     sx={{ mt: 1 }}
//                   >
//                     Clear All Filters
//                   </Button>
//                 )}
//               </Box>
//             </Menu>
//           </Box> */}
