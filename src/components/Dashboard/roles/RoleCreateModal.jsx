import React from "react";
import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import DSRadioInput from "@/components/Forms/DSRadioInput";
import DSModal from "@/components/Shared/DSModal/DSModal";
import { useGetAllPermissionsQuery } from "@/redux/api/permissionApi";
import { useCreateRoleMutation } from "@/redux/api/rolesApi";
import { Box, Typography, Paper, Divider, Button } from "@mui/material";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiPlus, FiShield, FiEdit3, FiCheck } from "react-icons/fi";
import DSSubmitButton from "@/components/Shared/DSSubmitButton";

const createRoleValidation = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .min(3, "Role name must be at least 3 characters")
    .max(50, "Role name must not exceed 50 characters")
    .regex(
      /^[a-zA-Z\s-_]+$/,
      "Role name can only contain letters, spaces, hyphens and underscores"
    ),
  description: z.string().optional(),
  permissions: z
    .array(z.object({
      id: z.string().optional(),
      name: z.string().optional(),
    }))
    .min(1, { message: "Please select at least one permission" })
    .refine((val) => val.length > 0, {
      message: "At least one permission must be selected",
    }),
});

const RoleCreateModal = ({ open, setOpen, onClose, onSuccess }) => {
  const { data, isLoading, isError } = useGetAllPermissionsQuery({});
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const permissions = data?.data || [];

  const handleSubmit = async (values) => {
    console.log("came here");
    console.log(values);
    const res = createRole(JSON.stringify(values)).unwrap();

    toast.promise(res, {
      loading: "Creating...",
      success: (res) => {
        if (res?.data?.id) {
          if (typeof onClose === "function") onClose(); else if (typeof setOpen === "function") setOpen(false);
          if (typeof onSuccess === "function") onSuccess();
          return res?.message || "Role created successfully";
        } else {
          return res?.message;
        }
      },
      error: (error) => {
        console.log(error.message);
        return error?.message || "Something went wrong";
      },
    });
  };

  return (
    <DSModal
      open={open}
      setOpen={setOpen}
      title={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            borderRadius: "20px",
            color: "white",
            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
          }}
        >
          <Box
            sx={{
            
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <FiShield size={24} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.25rem",
                letterSpacing: "0.025em",
              }}
            >
              Create New Role
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: "0.875rem",
                mt: 0.5,
              }}
            >
              Define permissions and access levels
            </Typography>
          </Box>
        </Box>
      }
      fullWidth={true}
      width="60vw"
      sx={{ 
        height: "full", 
        width: "100%", 
        mx: "auto",
        "& .MuiDialog-paper": {
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DSForm
        onSubmit={handleSubmit}
        resolver={zodResolver(createRoleValidation)}
        defaultValues={{
          name: "",
          description: "",
          permissions: [],
        }}
        className="space-y-8"
      >
        <Box sx={{ p: 3 }}>
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
                height: "4px",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              },
            }}
          >
            {/* Section Header */}
            <Box
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <FiEdit3 size={20} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                      fontSize: "1.125rem",
                    }}
                  >
                    Role Information
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                      mt: 0.5,
                    }}
                  >
                    Basic details about the role
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Form Fields */}
            <Box sx={{ p: 3, spaceY: 4 }}>
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
                  label="Enter role name (e.g., Admin, Manager, Employee)"
                  name="name"
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
                  label="Brief description of the role's responsibilities"
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
              mt: 3,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              },
            }}
          >
            {/* Section Header */}
            <Box
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <FiShield size={20} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                      fontSize: "1.125rem",
                    }}
                  >
                    Permissions
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                      mt: 0.5,
                    }}
                  >
                    Select the permissions this role will have
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Permissions Field */}
            <Box sx={{ p: 3 }}>
              <DSRadioInput
                name="permissions"
                label="Select Permissions"
                options={permissions.map((p) => ({
                  id: p.id,
                  name: p.name,
                }))}
                isLoading={isLoading}
                isError={isError}
              />
            </Box>
          </Paper>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            p: 3,
            pt: 0,
          }}
        >
          
          
          <DSSubmitButton
            type="submit"
            isLoading={isCreating}
            disabled={isLoading}
            variant="primary"
            size="large"
            loadingText="Creating..."
          >
            Create Role
          </DSSubmitButton>
        </Box>
      </DSForm>
    </DSModal>
  );
};

export default RoleCreateModal;
