"use client";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Modal,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FiEye } from "react-icons/fi";

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 14px",
  },
}));

const RoleMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const PermissionModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const DSRoleSelect = ({
  name,
  label,
  options = [],
  required = false,
  fullWidth = false,
  isLoading = false,
  isError = false,
  sx,
  defaultValue = null,
}) => {
  const { control } = useFormContext();
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handlePermissionClick = (event, role) => {
    event.stopPropagation();
    setSelectedRole(role);
    setPermissionModalOpen(true);
  };

  const handleModalClose = () => {
    setPermissionModalOpen(false);
    setSelectedRole(null);
  };

  const getPermissionsList = (role) => {
    if (!role?.permissions) return [];
    return role.permissions.map(
      (perm) => perm.permission?.name || "Unknown Permission"
    );
  };

  return (
    <>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue || ""}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormControl
            fullWidth={fullWidth}
            required={required}
            error={!!error || isError}
            sx={sx}>
            <InputLabel>{label}</InputLabel>
            <StyledSelect
              value={value || ""}
              onChange={onChange}
              label={label}
              disabled={isLoading}>
              {options.map((role) => (
                <RoleMenuItem key={role.id} value={role.id}>
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {role.name}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handlePermissionClick(e, role)}
                    sx={{
                      ml: 1,
                      p: 0.5,
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "primary.light",
                        color: "white",
                      },
                    }}>
                    <FiEye size={14} />
                  </IconButton>
                </RoleMenuItem>
              ))}
            </StyledSelect>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {error.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

      {/* Permission Modal */}
      <PermissionModal open={permissionModalOpen} onClose={handleModalClose}>
        <Paper
          sx={{
            maxWidth: 500,
            width: "100%",
            maxHeight: "80vh",
            overflow: "auto",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
          }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {selectedRole?.name} - Permissions
            </Typography>
            {selectedRole?.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedRole.description}
              </Typography>
            )}
            <Divider sx={{ mb: 2 }} />
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
              Permissions ({getPermissionsList(selectedRole).length})
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {getPermissionsList(selectedRole).map((permission, index) => (
                <Chip
                  key={index}
                  label={permission}
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                    borderColor: "primary.main",
                    "& .MuiChip-label": {
                      fontWeight: 500,
                    },
                  }}
                />
              ))}
              {getPermissionsList(selectedRole).length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No permissions assigned
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={handleModalClose}
              sx={{
                backgroundColor: "grey.100",
                "&:hover": {
                  backgroundColor: "grey.200",
                },
              }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Close
              </Typography>
            </IconButton>
          </Box>
        </Paper>
      </PermissionModal>
    </>
  );
};

export default DSRoleSelect;
