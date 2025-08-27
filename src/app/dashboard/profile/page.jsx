"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { useGetMyProfileQuery } from "@/redux/api/userApi";
import ResponsiveContainer from "@/components/Shared/ResponsiveContainer";
import ProfileUpdateModal from "@/components/Dashboard/users/ProfileUpdateModal";

const ProfilePage = () => {
  const [openEditModal, setOpenEditModal] = useState(false);

  const { data: profileData, isLoading, refetch } = useGetMyProfileQuery();

  const profile = profileData?.data;

  const handleEditClick = () => {
    setOpenEditModal(true);
  };

  const handleModalClose = () => {
    setOpenEditModal(false);
  };

  const handleUpdateSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <ResponsiveContainer>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Loading profile...
          </Typography>
        </Box>
      </ResponsiveContainer>
    );
  }

  if (!profile) {
    return (
      <ResponsiveContainer>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="error">
            Profile not found
          </Typography>
        </Box>
      </ResponsiveContainer>
    );
  }

  console.log(profile);

  return (
    <ResponsiveContainer>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: "#1e293b", mb: 1 }}
          >
            Profile
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Manage your personal information and account details
          </Typography>
        </Box>

        {/* Profile Banner - Top Middle */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Card
            sx={{
              maxWidth: 800,
              width: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <Avatar
              src={profile?.profile?.profileImg}
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 2,
                fontSize: "3rem",
                fontWeight: 700,
                background: "rgba(255, 255, 255, 0.2)",
                border: "4px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              {profile?.employee?.firstName?.charAt(0)?.toUpperCase() ||
                profile?.name?.charAt(0)?.toUpperCase() ||
                "U"}
            </Avatar>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {profile?.profile?.firstName || profile?.profile?.lastName
                ? `${profile.profile.firstName} ${profile.profile.lastName}`
                : "User"}
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              {profile?.profile?.designation || "Employee"}
            </Typography>

            <Chip
              label={profile?.role?.name || "User"}
              sx={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Card>
        </Box>

        {/* Profile Information - Below the banner */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ maxWidth: 1000, width: "100%" }}>
            <Card
              sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#1e293b" }}
                  >
                    Personal Information
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditClick}
                    sx={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2.5,
                  }}
                >
                  {/* Full Name */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      gap: 2,
                      borderRadius: 2,
                      border: "1px solid rgba(148,163,184,0.25)",
                      background: "linear-gradient(180deg, #fff, #f8fafc)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "rgba(59,130,246,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2563eb",
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Full Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {profile?.profile?.firstName &&
                        profile?.profile?.lastName
                          ? `${profile.profile.firstName} ${profile.profile.lastName}`
                          : profile?.name || "Not provided"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Email */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      gap: 2,
                      borderRadius: 2,
                      border: "1px solid rgba(148,163,184,0.25)",
                      background: "linear-gradient(180deg, #fff, #f8fafc)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "rgba(16,185,129,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0ea5e9",
                      }}
                    >
                      <EmailIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {profile?.email || "Not provided"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Contact */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      gap: 2,
                      borderRadius: 2,
                      border: "1px solid rgba(148,163,184,0.25)",
                      background: "linear-gradient(180deg, #fff, #f8fafc)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "rgba(234,179,8,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ca8a04",
                      }}
                    >
                      <PhoneIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Contact Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {profile?.profile?.contactNumber || "Not provided"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Designation */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      gap: 2,
                      borderRadius: 2,
                      border: "1px solid rgba(148,163,184,0.25)",
                      background: "linear-gradient(180deg, #fff, #f8fafc)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "rgba(99,102,241,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6366f1",
                      }}
                    >
                      <BusinessIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Designation
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {profile?.profile?.designation || "Not provided"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Employee ID */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      gap: 2,
                      borderRadius: 2,
                      border: "1px solid rgba(148,163,184,0.25)",
                      background: "linear-gradient(180deg, #fff, #f8fafc)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "rgba(2,132,199,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0284c7",
                      }}
                    >
                      <BadgeIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Employee ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {profile?.profile?.employeeId || "Not provided"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* National ID */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      gap: 2,
                      borderRadius: 2,
                      border: "1px solid rgba(148,163,184,0.25)",
                      background: "linear-gradient(180deg, #fff, #f8fafc)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "rgba(251,113,133,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#f43f5e",
                      }}
                    >
                      <BadgeIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        National ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {profile?.profile?.nationalId || "Not provided"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Address (spans full width) */}
                  <Box
                    sx={{
                      gridColumn: { xs: "auto", md: "1 / span 2" },
                      display: "flex",
                      alignItems: "flex-start",
                      p: 2,
                      gap: 2,
                      borderRadius: 2,
                      border: "1px solid rgba(148,163,184,0.25)",
                      background: "linear-gradient(180deg, #fff, #f8fafc)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "rgba(148,163,184,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748b",
                      }}
                    >
                      <BusinessIcon fontSize="small" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {profile?.profile?.address || "Not provided"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Role Information */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}
                  >
                    Role & Permissions
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip
                      label={profile?.role?.name || "User"}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      {profile?.userType || "Employee"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Profile Update Modal */}
        <ProfileUpdateModal
          open={openEditModal}
          setOpen={setOpenEditModal}
          onClose={handleModalClose}
          profile={profile}
          onSuccess={handleUpdateSuccess}
        />
      </Box>
    </ResponsiveContainer>
  );
};

export default ProfilePage;
