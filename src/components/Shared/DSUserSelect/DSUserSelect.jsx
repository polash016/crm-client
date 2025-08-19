"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useGetAllUsersQuery } from "@/redux/api/userApi";

const DSUserSelect = ({
  name,
  label,
  description,
  disabled = false,
  required = false,
  placeholder = "Search users...",
  sx = {},
  showAllUsersOnFocus = true,
  maxUsersToShow = 10,
  helperText,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const fieldError = errors[name];

  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  // Fetch users
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersQuery({
    limit: 50,
    searchTerm: searchTerm,
  });

  const users = usersData?.data || [];

  // Show user list when focused or searching
  useEffect(() => {
    if (isFocused || searchTerm) {
      setShowUserList(true);
    } else {
      setShowUserList(false);
    }
  }, [isFocused, searchTerm]);

  // Handle user selection
  const handleUserSelect = (user, onChange) => {
    onChange(user.id);
    setShowUserList(false);
    setSearchTerm(user.name);
    setIsFocused(false);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle focus/blur
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setTimeout(() => setIsFocused(false), 200);

  // Clear selection
  const handleClearSelection = (onChange) => {
    onChange("");
    setSearchTerm("");
  };

  // Helper functions
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
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        // Get selected user object
        const selectedUser = users.find((user) => user.id === value);

        return (
          <Box sx={sx}>
            {label && (
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {label}
                {required && <span style={{ color: "error.main" }}> *</span>}
              </Typography>
            )}

            {description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {description}
              </Typography>
            )}

            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                error={!!fieldError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: selectedUser && (
                    <InputAdornment position="end">
                      <Chip
                        label="Assigned"
                        size="small"
                        color="success"
                        variant="outlined"
                        onDelete={() => handleClearSelection(onChange)}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
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
                    {users.slice(0, maxUsersToShow).map((user, index) => (
                      <React.Fragment key={user.id}>
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => handleUserSelect(user, onChange)}
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
                                {getUserInitials(user.name)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={user.name}
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
                                    {user.email}
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
                            {selectedUser?.id === user.id && (
                              <CheckCircleIcon
                                color="success"
                                fontSize="small"
                              />
                            )}
                          </ListItemButton>
                        </ListItem>
                        {index <
                          Math.min(users.length - 1, maxUsersToShow - 1) && (
                          <Divider />
                        )}
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
                searchTerm.trim() && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    No users found matching your search.
                  </Alert>
                )}

              {/* Show all users when focused and no search term */}
              {showAllUsersOnFocus &&
                isFocused &&
                !searchTerm.trim() &&
                users.length > 0 && (
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
                      <ListItem>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ px: 2 }}
                        >
                          Start typing to search or select from all users:
                        </Typography>
                      </ListItem>
                      <Divider />
                      {users.slice(0, maxUsersToShow).map((user, index) => (
                        <React.Fragment key={user.id}>
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => handleUserSelect(user, onChange)}
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
                                  {getUserInitials(user.name)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={user.name}
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
                                      {user.email}
                                    </Typography>
                                    <Chip
                                      label={getRoleDisplayName(user)}
                                      size="small"
                                      color={getRoleColor(user.role)}
                                      variant="outlined"
                                      sx={{
                                        fontSize: "0.7rem",
                                        height: "18px",
                                      }}
                                    />
                                  </Box>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                          {index <
                            Math.min(users.length - 1, maxUsersToShow - 1) && (
                            <Divider />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                )}
            </Box>

            {/* Error Message */}
            {fieldError && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, display: "block" }}
              >
                {fieldError.message}
              </Typography>
            )}

            {/* Helper Text */}
            {helperText && !fieldError && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {helperText}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
};

export default DSUserSelect;
