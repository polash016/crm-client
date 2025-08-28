"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { useAuth } from "@/hooks/useAuth";

// Memoize helper functions to prevent unnecessary re-renders
const getUserInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

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
    return "Employee";
  }
};

const getRoleColor = (role) => {
  if (!role) return "default";
  try {
    const roleName = role.name || role;
    if (typeof roleName !== "string") return "default";

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
    return "default";
  }
};

const LeadFilters = ({
  assignmentFilter,
  statusFilter,
  userFilter,
  onAssignmentFilterChange,
  onStatusFilterChange,
  onUserFilterChange,
  onClearFilters,
  onFilteredExport,
  hasActiveFilters,
}) => {
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const { canCreate } = useAuth();

  // Fetch users for filter dropdown - optimized with memoization
  const userQueryParams = useMemo(
    () => ({
      limit: 50,
      searchTerm: userSearchTerm,
    }),
    [userSearchTerm]
  );

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersQuery(userQueryParams);

  const users = usersData?.data || [];

  // Memoized selected user
  const selectedUser = useMemo(
    () => users.find((u) => u.id === userFilter),
    [users, userFilter]
  );

  // Optimized handlers with useCallback
  const handleUserSelect = useCallback(
    (user) => {
      onUserFilterChange(user.id);
      setUserSearchTerm(user.name);
      setShowUserList(false);
    },
    [onUserFilterChange]
  );

  const handleUserClear = useCallback(() => {
    onUserFilterChange("");
    setUserSearchTerm("");
    setShowUserList(false);
  }, [onUserFilterChange]);

  const handleUserSearchChange = useCallback((event) => {
    setUserSearchTerm(event.target.value);
    if (event.target.value) {
      setShowUserList(true);
    }
  }, []);

  const handleUserFocus = useCallback(() => {
    if (users.length > 0) {
      setShowUserList(true);
    }
  }, [users.length]);

  const handleUserBlur = useCallback(() => {
    setTimeout(() => setShowUserList(false), 200);
  }, []);

  const handleFilterChange = useCallback(
    (event) => {
      const [assignment, status] = event.target.value.split("-");
      onAssignmentFilterChange(assignment);
      onStatusFilterChange(status);
    },
    [onAssignmentFilterChange, onStatusFilterChange]
  );

  // Memoized filter value
  const filterValue = useMemo(
    () => `${assignmentFilter}-${statusFilter}`,
    [assignmentFilter, statusFilter]
  );

  return (
    <>
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
                onDelete={() => onAssignmentFilterChange("all")}
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
                onDelete={() => onStatusFilterChange("all")}
              />
            )}

            {userFilter && (
              <Chip
                label={`User: ${selectedUser?.profile?.firstName || "Unknown"}`}
                size="small"
                color="primary"
                variant="outlined"
                onDelete={() => onUserFilterChange("")}
              />
            )}
          </Box>

          <Button
            size="small"
            variant="text"
            onClick={onClearFilters}
            sx={{ color: "primary.main" }}
          >
            Clear All
          </Button>
        </Box>
      )}

      {/* Filter Controls */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Main Filter Dropdown */}
        {canCreate("csv") && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter Leads</InputLabel>
            <Select
              value={filterValue}
              label="Filter Leads"
              onChange={handleFilterChange}
            >
              <MenuItem value="all-all">All Leads</MenuItem>
              <MenuItem value="unassigned-all">Unassigned</MenuItem>
              <MenuItem value="assigned-all">Assigned</MenuItem>
              {/* <MenuItem value="all-new">New Leads</MenuItem> */}
            </Select>
          </FormControl>
        )}

        {/* User Filter Dropdown */}
        <Box sx={{ position: "relative", minWidth: 250 }}>
          <TextField
            size="small"
            placeholder="Filter by user..."
            value={userSearchTerm}
            onChange={handleUserSearchChange}
            onFocus={handleUserFocus}
            onBlur={handleUserBlur}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: userFilter && (
                <InputAdornment position="end">
                  <Chip
                    label="Assigned"
                    size="small"
                    color="success"
                    variant="outlined"
                    onDelete={handleUserClear}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "background.paper",
              },
            }}
          />

          {/* User List Dropdown */}
          {showUserList && users.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                maxHeight: 300,
                overflow: "auto",
                mt: 1,
              }}
            >
              <List dense>
                {users.slice(0, 10).map((user, index) => (
                  <React.Fragment key={user.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleUserSelect(user)}
                        sx={{ py: 1 }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: "primary.main",
                              width: 32,
                              height: 32,
                              fontSize: "0.875rem",
                            }}
                          >
                            {getUserInitials(
                              user.profile?.firstName +
                                " " +
                                user.profile?.lastName
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            user.profile?.firstName +
                            " " +
                            user.profile?.lastName
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
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {user.id}
                              </Typography>
                              <Chip
                                label={getRoleDisplayName(user)}
                                size="small"
                                color={getRoleColor(user.role)}
                                variant="outlined"
                                sx={{ fontSize: "0.7rem", height: "18px" }}
                              />
                            </Box>
                          }
                        />
                        {userFilter === user.id && (
                          <CheckCircleIcon color="success" fontSize="small" />
                        )}
                      </ListItemButton>
                    </ListItem>
                    {index < Math.min(users.length - 1, 9) && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}

          {/* Loading State */}
          {usersLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={20} />
            </Box>
          )}

          {/* Error State */}
          {usersError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              Failed to load users. Please try again.
            </Alert>
          )}

          {/* No Results */}
          {showUserList &&
            !usersLoading &&
            users.length === 0 &&
            userSearchTerm.trim() && (
              <Alert severity="info" sx={{ mt: 1 }}>
                No users found matching your search.
              </Alert>
            )}
        </Box>

        {/* Filtered Export Button */}
        {hasActiveFilters && canCreate("csv") && (
          <Button
            size="small"
            variant="outlined"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={onFilteredExport}
            sx={{ minWidth: "auto" }}
          >
            Export Filtered
          </Button>
        )}
      </Box>
    </>
  );
};

export default React.memo(LeadFilters);
