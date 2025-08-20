import React from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import SecurePhone from "@/components/Shared/SecurePhone";
import DSModal from "@/components/Shared/DSModal/DSModal";

const LeadDetailsModal = ({ open, setOpen, lead }) => {
  if (!lead) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log("lead", lead);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" };
      case "contacted":
        return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
      case "qualified":
        return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
      case "unqualified":
        return { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" };
      case "converted":
        return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
      case "lost":
        return { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" };
      default:
        return { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" };
    }
  };

  const statusConfig = getStatusColor(lead?.status);

  return (
    <DSModal
      open={open}
      setOpen={setOpen}
      title="Lead Details"
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ p: 2 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            p: 2,
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderRadius: 2,
            border: "1px solid rgba(148, 163, 184, 0.2)",
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              fontSize: "1.5rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            }}
          >
            {lead?.name?.charAt(0)?.toUpperCase() || "L"}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1e293b" }}>
              {lead?.name || "Unnamed Lead"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lead ID: {lead?.id || lead?._id || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Chip
              label={
                lead?.status?.charAt(0)?.toUpperCase() +
                  lead?.status?.slice(1) || "New"
              }
              size="medium"
              sx={{
                backgroundColor: statusConfig.bg,
                color: statusConfig.color,
                border: `1px solid ${statusConfig.border}`,
                fontWeight: 600,
                fontSize: "0.875rem",
                height: "32px",
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PersonIcon color="primary" />
              Basic Information
            </Typography>
            <Box sx={{ space: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {lead?.name || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Phone Number
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SecurePhone
                    phoneNumber={lead?.phone}
                    variant="compact"
                    userRole="employee"
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {lead?.phone || "N/A"}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {lead?.address || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Business Information */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <BusinessIcon color="primary" />
              Business Information
            </Typography>
            <Box sx={{ space: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Source
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {lead?.source || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Batch Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {lead?.batchName || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Price
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  ${lead?.price || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Assignment Information */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AssignmentIcon color="primary" />
              Assignment Information
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {lead?.user && lead.user.profile ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    background: "rgba(16, 185, 129, 0.1)",
                    borderRadius: 2,
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    }}
                  >
                    {lead.user.profile.firstName?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {`${lead.user.profile.firstName || ""} ${
                        lead.user.profile.lastName || ""
                      }`.trim()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lead.user.email}
                    </Typography>
                  </Box>
                </Box>
              ) : lead?.assignedToId ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    background: "rgba(16, 185, 129, 0.1)",
                    borderRadius: 2,
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <AssignmentIcon color="success" />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Assigned
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      User ID: {lead.assignedToId}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    background: "rgba(245, 158, 11, 0.1)",
                    borderRadius: 2,
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}
                >
                  <AssignmentIcon color="warning" />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Unassigned
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No user assigned to this lead
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Items/Products */}
          {lead?.items && lead.items.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1e293b",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CategoryIcon color="primary" />
                Items/Products ({lead.items.length})
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {lead.items.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "rgba(59, 130, 246, 0.3)",
                      color: "#3b82f6",
                    }}
                  />
                ))}
              </Box>
            </Grid>
          )}

          {/* Timestamps */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CalendarIcon color="primary" />
              Timestamps
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Created At
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(lead?.createdAt)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Last Updated
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(lead?.updatedAt)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </DSModal>
  );
};

export default LeadDetailsModal;
