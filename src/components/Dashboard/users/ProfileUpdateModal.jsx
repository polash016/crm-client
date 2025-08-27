import React from "react";
import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import DSFile from "@/components/Forms/DSFile";
import DSModal from "@/components/Shared/DSModal/DSModal";
import { useUpdateUserProfileMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import { z } from "zod";
import { Box, Paper, Typography, Button } from "@mui/material";
import { FiEdit, FiUser, FiInfo } from "react-icons/fi";
import DSSubmitButton from "@/components/Shared/DSSubmitButton";

const updateProfile = z.object({
  password: z.string().min(6).optional(),
  user: z.object({
    firstName: z.string({ required_error: "First Name is required" }),
    lastName: z.string().optional(),
    email: z.string({ required_error: "Email is required" }).email(),
    profileImg: z.any().optional(),
    nationalId: z.string().optional(),
    contactNumber: z.string({ required_error: "Contact Number is required" }),
    address: z.string().optional(),
  }),
});

const ProfileUpdateModal = ({ open, setOpen, onClose, profile, onSuccess }) => {
  const [updateUser, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const handleSubmit = async (values) => {
    console.log(values);
    const formData = new FormData();
    formData.append("data", JSON.stringify({ user: values.user }));
    if (values.file) formData.append("file", values.file);
    try {
      const res = updateUser({ data: formData }).unwrap();
      toast.promise(Promise.resolve(res), {
        loading: "Updating...",
        success: (res) => {
          if (res?.data?.id) {
            if (typeof onClose === "function") onClose();
            else if (typeof setOpen === "function") setOpen(false);
            if (typeof onSuccess === "function") onSuccess();
            return res?.message || "Profile updated successfully";
          }
          return res?.message || "Profile updated";
        },
        error: (error) => error?.message || "Something went wrong",
      });
    } catch (error) {
      toast.error(error?.message || "Failed to update profile");
    }
  };

  if (!profile) return null;

  return (
    <DSModal
      open={open}
      setOpen={setOpen}
      onClose={onClose}
      title={
        <Box
          sx={{
            background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
            color: "#1e293b",
            px: 3,
            py: 2,
            borderRadius: "16px",
            fontWeight: 600,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <FiEdit size={20} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Update Profile
          </Typography>
        </Box>
      }
      fullWidth
      width="70vw"
      sx={{ height: "full", mx: "auto" }}
    >
      <DSForm
        onSubmit={handleSubmit}
        defaultValues={{
          user: {
            firstName: profile?.employee?.firstName || "",
            lastName: profile?.employee?.lastName || "",
            email: profile?.email || "",
            profileImg: null,
            nationalId: profile?.employee?.nationalId || "",
            contactNumber: profile?.employee?.contactNumber || "",
            address: profile?.employee?.address || "",
          },
        }}
        sx={{ "& > *": { mb: 4 } }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Basic Information Section */}
          <Paper
            sx={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              borderTop: "4px solid #6366f1",
            }}
          >
            <Box
              sx={{
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                p: 2.5,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <FiUser size={20} color="#6366f1" />
              <Typography
                variant="h6"
                sx={{
                  color: "#4338ca",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Basic Information
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(67, 56, 202, 0.7)",
                  fontSize: "0.8rem",
                  ml: "auto",
                }}
              >
                Personal details
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#475569",
                    }}
                  >
                    First Name *
                  </Typography>
                  <DSInput
                    fullWidth
                    name="user.firstName"
                    required
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(8px)",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#475569",
                    }}
                  >
                    Last Name
                  </Typography>
                  <DSInput
                    fullWidth
                    name="user.lastName"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(8px)",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#475569",
                    }}
                  >
                    Email *
                  </Typography>
                  <DSInput
                    fullWidth
                    name="user.email"
                    type="email"
                    required
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(8px)",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#475569",
                    }}
                  >
                    Contact Number *
                  </Typography>
                  <DSInput
                    fullWidth
                    name="user.contactNumber"
                    required
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(8px)",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Additional Information Section */}
          <Paper
            sx={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              borderTop: "4px solid #8b5cf6",
            }}
          >
            <Box
              sx={{
                background:
                  "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",
                p: 2.5,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <FiInfo size={20} color="#8b5cf6" />
              <Typography
                variant="h6"
                sx={{
                  color: "#7c3aed",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Additional Information
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(124, 58, 237, 0.7)",
                  fontSize: "0.8rem",
                  ml: "auto",
                }}
              >
                Extra details
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#475569",
                    }}
                  >
                    National ID
                  </Typography>
                  <DSInput
                    fullWidth
                    name="user.nationalId"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(8px)",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#475569",
                    }}
                  >
                    Profile Image
                  </Typography>
                  <DSFile
                    name="file"
                    label="Upload Profile Image"
                    fullWidth
                    type="file"
                    accept="image/*"
                  />
                </Box>
                <Box
                  sx={{
                    gridColumn: { xs: "auto", md: "1 / span 2" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#475569",
                    }}
                  >
                    Address
                  </Typography>
                  <DSInput
                    fullWidth
                    name="user.address"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(8px)",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Footer Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, pt: 4 }}>
          <Button
            type="button"
            onClick={() =>
              typeof onClose === "function" ? onClose() : setOpen(false)
            }
            disabled={isUpdating}
            sx={{
              px: 4,
              py: 1.5,
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              color: "#475569",
              fontWeight: 600,
              borderRadius: "16px",
              border: "1px solid rgba(203, 213, 225, 0.3)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              textTransform: "none",
              "&:hover": {
                background: "rgba(248, 250, 252, 0.9)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Cancel
          </Button>

          <DSSubmitButton
            type="submit"
            isLoading={isUpdating}
            variant="warning"
            size="large"
            loadingText="Updating..."
          >
            Update Profile
          </DSSubmitButton>
        </Box>
      </DSForm>
    </DSModal>
  );
};

export default ProfileUpdateModal;
