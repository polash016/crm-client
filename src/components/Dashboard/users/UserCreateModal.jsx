"use client";
import React from "react";
import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import DSSelect from "@/components/Forms/DSSelect";
import DSRoleSelect from "@/components/Forms/DSRoleSelect";
import DSFile from "@/components/Forms/DSFile";
import DSModal from "@/components/Shared/DSModal/DSModal";
import { toast } from "sonner";
import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import { FiPlus, FiUser, FiBriefcase, FiInfo } from "react-icons/fi";
import DSSubmitButton from "@/components/Shared/DSSubmitButton";
import z from "zod";
import { useGetAllRolesQuery } from "@/redux/api/rolesApi";
import { useCreateUserMutation } from "@/redux/api/userApi";
import { zodResolver } from "@hookform/resolvers/zod";

// Enhanced Validation schema
const createEmployee = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
  employee: z.object({
    firstName: z
      .string({ required_error: "First Name is required" })
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
    lastName: z.string().regex(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces").optional(),
    email: z.string({ required_error: "Email is required" }).email("Please enter a valid email address").min(5).max(100),
    profileImg: z.any().optional(),
    nationalId: z.string().regex(/^[0-9]*$/, "National ID must contain only numbers").optional(),
    employeeId: z.string().min(2).max(20),
    designation: z.string({ required_error: "Designation is required" }).min(2).max(100),
    contactNumber: z.string({ required_error: "Contact Number is required" }).regex(/^\+?[0-9]{10,15}$/),
    address: z.string().max(200).optional(),
    gender: z.enum(["MALE", "FEMALE"], { required_error: "Please select a gender" }),
    roleId: z.string({ required_error: "Please select a role" }).nonempty("Role is required"),
  }),
});

const UserCreateModal = ({ open, setOpen, onClose, onSuccess }) => {
  const { data: rolesData, isLoading: rolesLoading, isError: rolesError } = useGetAllRolesQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const roles = rolesData?.data || [];

  const genderOptions = [
    { id: "MALE", name: "MALE" },
    { id: "FEMALE", name: "FEMALE" },
  ];

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ password: values.password, employee: values.employee }));
    if (values.file) formData.append("file", values.file);

    try {
      const res = createUser(formData).unwrap();
      toast.promise(Promise.resolve(res), {
        loading: "Creating...",
        success: (res) => {
          if (res?.data?.id) {
            if (typeof onClose === "function") onClose(); else if (typeof setOpen === "function") setOpen(false);
            if (typeof onSuccess === "function") onSuccess();
            return res?.message || "User created successfully";
          }
          return res?.message || "User created";
        },
        error: (error) => error?.message || "Something went wrong",
      });
    } catch (error) {
      toast.error(error?.message || "Failed to create user");
    }
  };

  return (
    <DSModal
      open={open}
      setOpen={setOpen}
      onClose={onClose}
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create User
          </Typography>
        </Box>
      }
      fullWidth
      width="70vw"
      sx={{ height: "full", mx: "auto" }}
    >
      <DSForm
        onSubmit={handleSubmit}
        resolver={zodResolver(createEmployee)}
        defaultValues={{
          password: "",
          employee: {
            firstName: "",
            lastName: "",
            email: "",
            designation: "",
            contactNumber: "",
            gender: "",
            roleId: "",
            employeeId: "",
          },
        }}
        sx={{ '& > *': { mb: 4 } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Basic Information Section */}
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
                background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
              },
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
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
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FiUser size={16} />
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
                  Basic Information
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                  }}
                >
                  Personal details and credentials
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: "0.875rem" }}>First Name *</Typography>
                <DSInput fullWidth  name={"user.firstName"} required sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' } }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: "0.875rem" }}>Last Name</Typography>
                <DSInput fullWidth name={"user.lastName"} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' } }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: "0.875rem" }}>Email *</Typography>
                <DSInput fullWidth name={"user.email"} type="email" required sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' } }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: "0.875rem" }}>Password *</Typography>
                <DSInput fullWidth  name={"password"} type="password" required sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' } }} />
              </Box>
            </Box>
          </Paper>

          {/* Professional Information Section */}
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
                <FiBriefcase size={16} />
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
                  Professional Information
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                  }}
                >
                  Work details and role assignment
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: "0.875rem" }}>Designation *</Typography>
                <DSInput fullWidth name={"user.designation"} required sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' } }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: "0.875rem" }}>Employee ID</Typography>
                <DSInput fullWidth name={"user.employeeId"} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' } }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: "0.875rem" }}>Contact Number *</Typography>
                <DSInput fullWidth name={"user.contactNumber"} required sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' } }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: "0.875rem" }}>Role *</Typography>
                <DSSelect name="user.roleId" options={roles.map((role) => ({ id: role.id, name: role.name }))} isLoading={rolesLoading} isError={rolesError} fullWidth />
              </Box>
            </Box>
          </Paper>

          {/* Additional Information Section */}
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
                background: "linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)",
              },
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)",
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
                  background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FiInfo size={16} />
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
                  Additional Information
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                  }}
                >
                  Personal details and documents
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
             
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: "0.875rem" }}>National ID</Typography>
                <DSInput fullWidth name={"user.nationalId"} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' } }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: "0.875rem" }}>Profile Image</Typography>
                <DSFile name={"file"} label={"Upload Profile Image"} fullWidth type="file" accept="image/*" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: "0.875rem" }}>Address</Typography>
                <DSInput fullWidth name={"user.address"} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' } }} />
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Footer Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            p: 3,
            pt: 3,
          }}
        >
         
          
          <DSSubmitButton
            type="submit"
            isLoading={isCreating}
            disabled={rolesLoading}
            variant="modern"
            size="large"
            loadingText="Creating..."
          >
            Create User
          </DSSubmitButton>
        </Box>
      </DSForm>
    </DSModal>
  );
};

export default UserCreateModal;
