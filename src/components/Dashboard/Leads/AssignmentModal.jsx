"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  InputAdornment,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import DSModal from "@/components/Shared/DSModal/DSModal";
import { toast } from "sonner";

const AssignmentModal = ({ open, setOpen, lead, onAssign }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  console.log("lead", { lead, onAssign });

  // Check if this is a bulk assignment
  const isBulkAssignment = lead?.id === "bulk";

  // Fetch users with search functionality from backend
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersQuery({
    limit: 100,
    searchTerm: searchQuery, // Send search term to backend
  });

  const users = usersData?.data || [];

  console.log("users", users);

  // Debounced search - send to backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Handle assignment
  const handleAssign = async () => {
    if (!selectedUser || !lead) return;

    const assignmentPromise = (async () => {
      if (isBulkAssignment) {
        // For bulk assignment, we need to get the selected lead IDs from the parent
        // The parent component should handle this by passing the actual lead IDs
        // We'll call onAssign with a special object to indicate bulk assignment
        await onAssign({ type: "bulk", userId: selectedUser.id });
      } else {
        // Individual assignment
        await onAssign({
          type: "single",
          leadId: lead.id || lead._id,
          userId: selectedUser.id,
        });
      }

      setOpen(false);
      setSelectedUser(null);
      setSearchTerm("");
    })();

    toast.promise(assignmentPromise, {
      loading: isBulkAssignment ? "Assigning leads..." : "Assigning lead...",
      success: isBulkAssignment
        ? "Leads assigned successfully!"
        : "Lead assigned successfully!",
      error: "Assignment failed. Please try again.",
    });
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setSearchTerm("");
  };

  // Get user role color
  const getRoleColor = (role) => {
    if (!role) return "default";

    try {
      const roleName = role.name || role;

      if (typeof roleName !== "string") {
        console.warn("Role is not a string:", role);
        return "default";
      }

      switch (roleName.toLowerCase()) {
        case "admin":
          return "error";
        case "manager":
          return "warning";
        case "employee":
          return "primary";
        default:
          return "default";
      }
    } catch (error) {
      console.error("Error getting role color:", error);
      return "default";
    }
  };

  // Get user role display name
  const getRoleDisplayName = (user) => {
    try {
      if (user.role?.name && typeof user.role.name === "string") {
        return user.role.name;
      }
      if (user.userType && typeof user.userType === "string") {
        return (
          user.userType.charAt(0).toUpperCase() +
          user.userType.slice(1).toLowerCase()
        );
      }
      return "Employee";
    } catch (error) {
      console.error("Error getting role display name:", error);
      return "Employee";
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DSModal
      open={open}
      setOpen={setOpen}
      title={isBulkAssignment ? "Bulk Assign Leads" : "Assign Lead"}
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ p: 2 }}>
        {/* Lead Information */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            background: "rgba(59, 130, 246, 0.05)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
            {isBulkAssignment ? "Lead Summary" : "Lead Details"}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box>
              <Typography variant="body2" color="text.secondary">
                {isBulkAssignment ? "Count" : "Name"}
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {isBulkAssignment ? lead?.name : lead?.name || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {isBulkAssignment ? "Type" : "Phone"}
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {isBulkAssignment ? "Multiple leads" : lead?.phone || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Current Status
              </Typography>
              <Chip
                label={isBulkAssignment ? "Bulk" : lead?.status || "New"}
                size="small"
                color={isBulkAssignment ? "warning" : "primary"}
                variant="outlined"
              />
            </Box>
          </Stack>
        </Box>

        {/* Search Input */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "background.paper",
              },
            }}
          />
        </Box>

        {/* Users List */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Select User to Assign
            {users.length > 0 && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ ml: 1, fontWeight: 400 }}
              >
                ({users.length} users found)
              </Typography>
            )}
          </Typography>

          {usersLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : usersError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load users. Please try again.
            </Alert>
          ) : users.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              {searchQuery.trim()
                ? "No users found matching your search."
                : "No users available for assignment."}
            </Alert>
          ) : (
            <List
              sx={{
                maxHeight: 400,
                overflow: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                backgroundColor: "background.paper",
              }}
            >
              {users.map((user, index) => (
                <React.Fragment key={user.id}>
                  <ListItem
                    disablePadding
                    sx={{
                      backgroundColor:
                        selectedUser?.id === user.id
                          ? "rgba(59, 130, 246, 0.1)"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      },
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleUserSelect(user)}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getUserInitials(user.name)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body1" fontWeight={500}>
                              {user.name}
                            </Typography>
                            {selectedUser?.id === user.id && (
                              <CheckCircleIcon
                                color="primary"
                                fontSize="small"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: 0.5,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                            <Chip
                              label={getRoleDisplayName(user)}
                              size="small"
                              color={getRoleColor(user.role)}
                              variant="outlined"
                              sx={{ fontSize: "0.7rem", height: "20px" }}
                            />
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < users.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Assignment Summary */}
        {selectedUser && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              background: "rgba(16, 185, 129, 0.05)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="success.main" sx={{ mb: 1 }}>
              Assignment Summary
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "success.main",
                  width: 32,
                  height: 32,
                }}
              >
                {getUserInitials(selectedUser.name)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {selectedUser.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedUser.email} • {getRoleDisplayName(selectedUser)}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={!selectedUser}
            startIcon={<AssignmentIcon />}
            sx={{
              minWidth: 120,
            }}
          >
            {isBulkAssignment ? "Assign All Leads" : "Assign Lead"}
          </Button>
        </Box>
      </Box>
    </DSModal>
  );
};

export default AssignmentModal;
