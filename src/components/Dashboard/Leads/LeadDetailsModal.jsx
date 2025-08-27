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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
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
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  LocalHospital as HealthIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import SecurePhone from "@/components/Shared/SecurePhone";
import DSModal from "@/components/Shared/DSModal/DSModal";
import { PhoneVisibilityProvider } from "@/contexts/PhoneVisibilityContext";

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
    <PhoneVisibilityProvider>
      <DSModal
        open={open}
        setOpen={setOpen}
        title="Lead Details"
        maxWidth="xl"
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
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#1e293b" }}
              >
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Full Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {lead?.name || "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Phone Number
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SecurePhone
                      phoneNumber={lead?.phone}
                      variant="compact"
                      userRole="employee"
                      phoneId={`details-${lead?.id || lead?._id}-phone`}
                    />
                    {/* <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {lead?.phone || "N/A"}
                  </Typography> */}
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Source
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {lead?.source || "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Batch Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {lead?.batchName || "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
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
                        borderColor: "rgba(59, 130, 246, 0.2)",
                        color: "#3b82f6",
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            )}

            {/* Follow-up History */}
            {lead?.leadFollowUp && lead?.leadFollowUp?.length > 0 && (
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
                  <HistoryIcon color="primary" />
                  Follow-up History ({lead.leadFollowUp.length})
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {lead.leadFollowUp.map((followUp, index) => (
                    <Card
                      key={followUp.id || index}
                      sx={{
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        borderRadius: 2,
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        {/* Follow-up Header */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                mb: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Chip
                                label={followUp.followUpType || "N/A"}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                                  color: "#3b82f6",
                                  fontWeight: 600,
                                }}
                              />
                              {(followUp.followUpOutcome ||
                                followUp.outcome) && (
                                <Chip
                                  label={
                                    followUp.followUpOutcome ||
                                    followUp.outcome ||
                                    "N/A"
                                  }
                                  size="small"
                                  sx={{
                                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                                    color: "#059669",
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Attempted: {formatDate(followUp.attemptedAt)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Created: {formatDate(followUp.createdAt)}
                            </Typography>
                          </Box>

                          {/* Ship Later Date - Conditional */}
                          {followUp.shipLaterDate && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 1,
                                background: "rgba(245, 158, 11, 0.1)",
                                borderRadius: 1,
                                border: "1px solid rgba(245, 158, 11, 0.2)",
                              }}
                            >
                              <ScheduleIcon color="warning" fontSize="small" />
                              <Typography
                                variant="body2"
                                color="warning.main"
                                sx={{ fontWeight: 500 }}
                              >
                                Ship Later: {formatDate(followUp.shipLaterDate)}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Follow-up Outcome Details */}
                        {(followUp.followUpOutcome || followUp.outcome) && (
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                color: "#1e293b",
                                mb: 1,
                              }}
                            >
                              Outcome Details
                            </Typography>
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              <Chip
                                label={`Outcome: ${
                                  followUp.followUpOutcome || followUp.outcome
                                }`}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                                  color: "#059669",
                                  fontWeight: 600,
                                }}
                              />
                              {followUp.nextActionType && (
                                <Chip
                                  label={`Next Action: ${followUp.nextActionType}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                                    color: "#3b82f6",
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </Box>
                            {followUp.notes && (
                              <Box
                                sx={{
                                  mt: 1,
                                  p: 1.5,
                                  background: "rgba(148, 163, 184, 0.05)",
                                  borderRadius: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  Notes:
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {followUp.notes}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}

                        {/* Health Snapshot Section */}
                        {followUp.healthSnapshot &&
                          followUp.healthSnapshot.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  color: "#1e293b",
                                  mb: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <HealthIcon fontSize="small" color="primary" />
                                Health Information
                              </Typography>

                              {followUp.healthSnapshot.map(
                                (health, healthIndex) => (
                                  <Box
                                    key={health.id || healthIndex}
                                    sx={{
                                      p: 2,
                                      background: "rgba(16, 185, 129, 0.05)",
                                      borderRadius: 1,
                                      border:
                                        "1px solid rgba(16, 185, 129, 0.1)",
                                      mb: 1,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 2,
                                      }}
                                    >
                                      {/* Basic Health Metrics */}
                                      <Box
                                        sx={{
                                          flex: "1 1 200px",
                                          minWidth: "200px",
                                        }}
                                      >
                                        <Box sx={{ mb: 1 }}>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                          >
                                            Condition
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 500 }}
                                          >
                                            {health.condition || "N/A"}
                                          </Typography>
                                        </Box>
                                      </Box>

                                      <Box
                                        sx={{
                                          flex: "1 1 200px",
                                          minWidth: "200px",
                                        }}
                                      >
                                        <Box sx={{ mb: 1 }}>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                          >
                                            Weight
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 500 }}
                                          >
                                            {health.weight || "N/A"} kg
                                          </Typography>
                                        </Box>
                                      </Box>

                                      {/* Blood Pressure */}
                                      <Box
                                        sx={{
                                          flex: "1 1 200px",
                                          minWidth: "200px",
                                        }}
                                      >
                                        <Box sx={{ mb: 1 }}>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                          >
                                            Blood Pressure
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 500 }}
                                          >
                                            {health.bp || "N/A"} mmHg
                                          </Typography>
                                        </Box>
                                      </Box>

                                      {/* Pulse */}
                                      <Box
                                        sx={{
                                          flex: "1 1 200px",
                                          minWidth: "200px",
                                        }}
                                      >
                                        <Box sx={{ mb: 1 }}>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                          >
                                            Pulse
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 500 }}
                                          >
                                            {health.pulse || "N/A"} bpm
                                          </Typography>
                                        </Box>
                                      </Box>

                                      {/* Sugar Levels */}
                                      <Box
                                        sx={{
                                          flex: "1 1 200px",
                                          minWidth: "200px",
                                        }}
                                      >
                                        <Box sx={{ mb: 1 }}>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                          >
                                            AM Sugar
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 500 }}
                                          >
                                            {health.amSugar || "N/A"} mg/dL
                                          </Typography>
                                        </Box>
                                      </Box>

                                      <Box
                                        sx={{
                                          flex: "1 1 200px",
                                          minWidth: "200px",
                                        }}
                                      >
                                        <Box sx={{ mb: 1 }}>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                          >
                                            BM Sugar
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 500 }}
                                          >
                                            {health.bmSugar || "N/A"} mg/dL
                                          </Typography>
                                        </Box>
                                      </Box>

                                      {/* Age */}
                                      <Box
                                        sx={{
                                          flex: "1 1 200px",
                                          minWidth: "200px",
                                        }}
                                      >
                                        <Box sx={{ mb: 1 }}>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                          >
                                            Age
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 500 }}
                                          >
                                            {health.age || "N/A"} years
                                          </Typography>
                                        </Box>
                                      </Box>

                                      {/* Blood Type */}
                                      <Box
                                        sx={{
                                          flex: "1 1 200px",
                                          minWidth: "200px",
                                        }}
                                      >
                                        <Box sx={{ mb: 1 }}>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                          >
                                            Blood Type
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 500 }}
                                          >
                                            {health.metrics?.blood || "N/A"}
                                          </Typography>
                                        </Box>
                                      </Box>

                                      {/* Notes */}
                                      {health.notes && (
                                        <Box
                                          sx={{
                                            flex: "1 1 100%",
                                            width: "100%",
                                          }}
                                        >
                                          <Box sx={{ mb: 1 }}>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                              gutterBottom
                                            >
                                              Notes
                                            </Typography>
                                            <Typography
                                              variant="body1"
                                              sx={{ fontWeight: 500 }}
                                            >
                                              {health.notes}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      )}
                                    </Box>
                                  </Box>
                                )
                              )}
                            </Box>
                          )}

                        {/* Follow-up Creator Info */}
                        {followUp.createdById && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 1,
                              borderTop: "1px solid rgba(148, 163, 184, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Created by: {followUp.createdById}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                {/* Health Timestamps Summary - At bottom of entire follow-up history */}
                {lead?.leadFollowUp?.some(
                  (followUp) =>
                    followUp.healthSnapshot &&
                    followUp.healthSnapshot.length > 0
                ) && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      background: "rgba(16, 185, 129, 0.05)",
                      borderRadius: 2,
                      border: "1px solid rgba(16, 185, 129, 0.1)",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: "#1e293b",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <HealthIcon fontSize="small" color="primary" />
                      Health Data Timestamps
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      {lead.leadFollowUp
                        .filter(
                          (followUp) =>
                            followUp.healthSnapshot &&
                            followUp.healthSnapshot.length > 0
                        )
                        .map((followUp, index) => (
                          <Box key={index} sx={{ display: "flex", gap: 2 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Follow-up {index + 1}:{" "}
                              {formatDate(
                                followUp.healthSnapshot[0]?.measuredAt
                              )}
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                )}
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
    </PhoneVisibilityProvider>
  );
};

export default LeadDetailsModal;
