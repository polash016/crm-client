import React from "react";
import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import DSRadioInput from "@/components/Forms/DSRadioInput";
import DSModal from "@/components/Shared/DSModal/DSModal";
import { useGetAllPermissionsQuery } from "@/redux/api/permissionApi";
import { useUpdateRoleMutation } from "@/redux/api/rolesApi";
import { toast } from "sonner";
import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import { FiEdit, FiShield, FiEdit3, FiCheck } from "react-icons/fi";
import DSSubmitButton from "@/components/Shared/DSSubmitButton";

const RoleUpdateModal = ({ open, setOpen, role, onSuccess }) => {
  const { data, isLoading, isError } = useGetAllPermissionsQuery();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const permissions = data?.data || [];

  const handleSubmit = async (values) => {
    const res = updateRole({ id: role.id, ...values }).unwrap();
    toast.promise(res, {
      loading: "Updating...",
      success: (res) => {
        if (res?.data?.id) {
          setOpen(false);
          if (typeof onSuccess === "function") onSuccess();
          return res?.message || "Role Updated successfully";
        }
        return res?.message;
      },
      error: (error) => error?.message || "Something went wrong",
    });
  };

  const defaultPermissions = role?.permissions?.map((r) => ({ id: r?.permission?.id, name: r?.permission?.name }));

  return (
    <DSModal 
      open={open} 
      setOpen={setOpen} 
      title={
        <Box
          sx={{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            color: '#1e293b',
            px: 3,
            py: 2,
            borderRadius: '16px',
            fontWeight: 600,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <FiEdit size={20} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Update Role
          </Typography>
        </Box>
      }
      fullWidth 
      sx={{ height: "full", mx: "auto" }}
    >
      <DSForm
        onSubmit={handleSubmit}
        defaultValues={{ name: role?.name || "", description: role?.description || "", permissions: defaultPermissions || "" }}
        sx={{ '& > *': { mb: 4 } }}
      >
        {/* Role Information Section */}
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
            },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)",
              color: "#1e293b",
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <FiShield size={16} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  lineHeight: 1.2,
                }}
              >
                Role Information
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontSize: "0.75rem",
                }}
              >
                Update role details and permissions
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#1e293b",
                  mb: 1.5,
                  fontSize: "0.875rem",
                }}
              >
                Role Name *
              </Typography>
              <DSInput
                fullWidth={true}
                // label="Enter role name (e.g., Admin, Manager, Employee)"
                name="name"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(8px)',
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#1e293b",
                  mb: 1.5,
                  fontSize: "0.875rem",
                }}
              >
                Description
              </Typography>
              <DSInput
                fullWidth={true}
                // label="Brief description of the role's responsibilities"
                name="description"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(8px)',
                  }
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Permissions Section */}
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #10b981 0%, #06b6d4 100%)",
            },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #d1fae5 0%, #dcfce7 100%)",
              color: "#1e293b",
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <FiEdit3 size={16} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  lineHeight: 1.2,
                }}
              >
                Permissions
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontSize: "0.75rem",
                }}
              >
                Select permissions for this role
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            <DSRadioInput
              name="permissions"
              label="Select Permissions"
              defaultValue={defaultPermissions}
              options={permissions.map((p) => ({ id: p.id, name: p.name }))}
              required
              isLoading={isLoading}
              isError={isError}
            />
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            p: 3,
            pt: 4,
          }}
        >
          
          
          <DSSubmitButton
            type="submit"
            isLoading={isUpdating}
            disabled={isLoading}
            variant="warning"
            size="large"
            loadingText="Updating..."
          >
            Update Role
          </DSSubmitButton>
        </Box>
      </DSForm>
    </DSModal>
  );
};

export default RoleUpdateModal;
