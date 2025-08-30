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
} from "@mui/material";
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Clear as ClearIcon,
  Add as AddIcon,
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
import { getRowStyling } from "./LeadTable/utils";
import { useColumns } from "./LeadTable/columns";
import ResponsiveContainer from "@/components/Shared/ResponsiveContainer";
import DSPagination from "@/components/Dashboard/pagination/DSPagination";
import CallHistory from "@/components/Shared/CallHistory";
import AssignmentModal from "./AssignmentModal";
import NewLeadModal from "./NewLeadModal";
import CreateLeadModal from "./CreateLeadModal";
import LeadDetailsModal from "./LeadDetailsModal";
import AddFollowUpModal from "./AddFollowUpModal";
import LeadFilters from "./LeadFilters";
import { PhoneVisibilityProvider } from "@/contexts/PhoneVisibilityContext";
import { toast } from "sonner";
import SummaryStats from "./LeadTable/SummaryStats";
import { useAuth } from "@/hooks/useAuth";

const LeadsTable = () => {
  const { canCreate, canDelete, hasAnyPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);
  const [callHistoryOpen, setCallHistoryOpen] = useState(false);
  const [selectedLeadForHistory, setSelectedLeadForHistory] = useState(null);
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("");
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedLeadForAssignment, setSelectedLeadForAssignment] =
    useState(null);
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [createLeadModalOpen, setCreateLeadModalOpen] = useState(false);
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

  if (userFilter) {
    query["userFilter"] = userFilter;
  }

  console.log({ userFilter });

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

  // const handleBulkExport = () => {
  //   if (selectedRows.length === 0) return;

  //   const exportPromise = (async () => {
  //     // TODO: Implement actual bulk export API call

  //     // Simulate API call delay
  //     await new Promise((resolve) => setTimeout(resolve, 800));
  //   })();

  //   toast.promise(exportPromise, {
  //     loading: `Exporting ${selectedRows.length} leads...`,
  //     success: `Exported ${selectedRows.length} leads successfully!`,
  //     error: "Failed to export leads. Please try again.",
  //   });
  // };

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

  // Add Follow Up modal handlers
  const handleOpenAddFollowUpModal = (lead) => {
    setSelectedLeadForFollowUp(lead);
    setAddFollowUpModalOpen(true);
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

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleAssignmentFilterChange = (value) => {
    setAssignmentFilter(value);
    setPage(1); // Reset to first page when filter changes
    setSelectedRows([]); // Clear selection when filter changes
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page when filter changes
    setSelectedRows([]); // Clear selection when filter changes
  };

  const handleUserFilterChange = (value) => {
    setUserFilter(value);
    setPage(1); // Reset to first page when filter changes
    setSelectedRows([]); // Clear selection when filter changes
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
    setUserFilter("");
    setPage(1); // Reset to first page when filters are cleared
    setSelectedRows([]); // Clear selection when filters are cleared

    // Show feedback
    toast.success("All filters cleared successfully!");
  };

  const hasActiveFilters =
    assignmentFilter !== "all" || statusFilter !== "all" || !!userFilter;

  // New Lead handlers
  const handleOpenNewLeadModal = () => {
    setNewLeadModalOpen(true);
  };

  const handleOpenCreateLeadModal = () => {
    setCreateLeadModalOpen(true);
  };

  const columns = useColumns({
    handleCallLog,
    handleOpenCallHistory,
    handleOpenAddFollowUpModal,
    handleOpenDetailsModal,
  });

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
              alignItems: { xs: "flex-start", sm: "center", md: "center" },
              flexDirection: { xs: "column", sm: "column", md: "row" },
              gap: { xs: 3, sm: 2, md: 2 },
              mb: { xs: 3, sm: 3, md: 3 },
            }}
          >
            <Box
              sx={{
                textAlign: { xs: "center", sm: "left", md: "left" },
                mb: { xs: 1, sm: 0, md: 0 },
                width: { xs: "100%", sm: "auto", md: "auto" },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "#1e293b",
                  mb: 0.5,
                  fontSize: { xs: "1.5rem", sm: "1.25rem", md: "1.5rem" },
                }}
              >
                Leads
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontSize: { xs: "0.9rem", sm: "0.875rem", md: "0.875rem" },
                }}
              >
                Manage your leads
              </Typography>
            </Box>

            {/* Summary Statistics for Employees */}
            {rows.length > 0 && (
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "auto" },
                  order: { xs: -1, sm: -1, md: 0 },
                  mb: { xs: 2, sm: 1, md: 0 },
                  textAlign: { xs: "center", sm: "left", md: "left" },
                }}
              >
                <SummaryStats rows={rows} />
              </Box>
            )}

            {/* Search and New Lead Container */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "column", md: "row" },
                alignItems: { xs: "stretch", sm: "stretch", md: "center" },
                gap: { xs: 2, sm: 2, md: 2 },
                width: { xs: "100%", sm: "100%", md: "auto" },
              }}
            >
              {/* Search Field */}
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "auto" },
                  minWidth: { xs: "100%", sm: "100%", md: "300px" },
                  maxWidth: { xs: "100%", sm: "100%", md: "400px" },
                }}
              >
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

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row", md: "row" },
                  gap: { xs: 1.5, sm: 2, md: 2 },
                  width: { xs: "100%", sm: "100%", md: "auto" },
                  "& > *": {
                    flex: { xs: 1, sm: "none", md: "none" },
                  },
                }}
              >
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
                      px: { xs: 3, sm: 2, md: 2 },
                      py: 1.5,
                      height: { xs: "48px", sm: "40px", md: "40px" },
                      whiteSpace: "nowrap",
                      fontSize: {
                        xs: "0.9rem",
                        sm: "0.875rem",
                        md: "0.875rem",
                      },
                      width: { xs: "100%", sm: "auto", md: "auto" },
                      justifyContent: {
                        xs: "center",
                        sm: "flex-start",
                        md: "flex-start",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: { xs: "none", sm: "inline", md: "inline" },
                      }}
                    >
                      Upload Leads
                    </Box>
                    <Box
                      sx={{ display: { xs: "inline", sm: "none", md: "none" } }}
                    >
                      Upload
                    </Box>
                  </Button>
                )}

                {canCreate("lead") && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateLeadModalOpen(true)}
                    sx={{
                      backgroundColor: "success.main",
                      "&:hover": {
                        backgroundColor: "success.dark",
                      },
                      minWidth: "auto",
                      px: { xs: 3, sm: 2, md: 2 },
                      py: 1.5,
                      height: { xs: "48px", sm: "40px", md: "40px" },
                      whiteSpace: "nowrap",
                      fontSize: {
                        xs: "0.9rem",
                        sm: "0.875rem",
                        md: "0.875rem",
                      },
                      width: { xs: "100%", sm: "auto", md: "auto" },
                      justifyContent: {
                        xs: "center",
                        sm: "flex-start",
                        md: "flex-start",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: { xs: "none", sm: "inline", md: "inline" },
                      }}
                    >
                      Create Lead
                    </Box>
                    <Box
                      sx={{ display: { xs: "inline", sm: "none", md: "none" } }}
                    >
                      Create
                    </Box>
                  </Button>
                )}
              </Box>
            </Box>

            {/* Filter Button */}
          </Box>

          {/* Lead Filters Component */}
          {canCreate("csv") && (
            <LeadFilters
              assignmentFilter={assignmentFilter}
              statusFilter={statusFilter}
              userFilter={userFilter}
              onAssignmentFilterChange={handleAssignmentFilterChange}
              onStatusFilterChange={handleStatusFilterChange}
              onUserFilterChange={handleUserFilterChange}
              onClearFilters={handleClearFilters}
              onFilteredExport={handleFilteredExport}
              hasActiveFilters={hasActiveFilters}
            />
          )}

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
                  } ${userFilter ? "• User filtered" : ""}`
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

          {/* Create Lead Modal */}
          <CreateLeadModal
            open={createLeadModalOpen}
            setOpen={setCreateLeadModalOpen}
          />

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
