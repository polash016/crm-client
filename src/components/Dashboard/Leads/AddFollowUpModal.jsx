import React from "react";
import { Box, Typography, Avatar, Chip, Grid } from "@mui/material";
import { Phone as PhoneIcon } from "@mui/icons-material";
import DSModal from "@/components/Shared/DSModal/DSModal";
import DSForm from "@/components/Forms/DSForm";
import DSSubmitButton from "@/components/Shared/DSSubmitButton";
import SecurePhone from "@/components/Shared/SecurePhone";
import { useForm, FormProvider } from "react-hook-form";
import FollowUpDetails from "./FollowUpDetails";
import UserHealthInformation from "./UserHealthInformation";
import { PhoneVisibilityProvider } from "@/contexts/PhoneVisibilityContext";
import { useCreateFollowUpMutation } from "@/redux/api/followUpApi";
import { toast } from "sonner";

const AddFollowUpModal = ({ open, setOpen, lead }) => {
  // ALL hooks must be called at the top level - before any conditional logic
  const [createFollowUp, { isLoading }] = useCreateFollowUpMutation();

  const methods = useForm({
    defaultValues: {
      followUpType: "",
      followUpOutcome: "",
      nextActionType: "",
      notes: "",
      shipLaterDate: "",
      nextFollowUpAt: "",
      manualFollowUp: false,
      user: {
        age: "",
        bmSugar: "",
        amSugar: "",
        bp: "",
        pulse: "",
        weight: "",
        condition: "",
        notes: "",
        metrics: {},
      },
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  // Early return after ALL hooks
  if (!lead) return null;

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

  const onSubmit = async (data) => {
    try {
      // Process the data before sending to API
      const processedData = {
        ...data,
        leadId: lead?.id,
        user: {
          ...data.user,
          age: data.user.age ? data.user.age : null,
          bmSugar: data.user.bmSugar ? data.user.bmSugar : null,
          amSugar: data.user.amSugar ? data.user.amSugar : null,
          bp: data.user.bp || null,
          pulse: data.user.pulse ? data.user.pulse : null,
          weight: data.user.weight ? data.user.weight : null,
          condition: data.user.condition || null,
          notes: data.user.notes || null,
          metrics: data.user.metrics || {},
        },
        // Only include dates if they have values
        ...(data.shipLaterDate && { shipLaterDate: data.shipLaterDate }),
        ...(data.nextFollowUpAt && { nextFollowUpAt: data.nextFollowUpAt }),
      };

      const res = await createFollowUp(processedData).unwrap();

      toast.promise(Promise.resolve(res), {
        loading: "Creating...",
        success: (res) => {
          if (res?.data?.id) {
            setOpen(false);
            reset();
            return res?.message || "Follow Up created successfully";
          }
          return res?.message || "Follow Up created successfully";
        },
        error: (error) => {
          return error?.message || "Something went wrong";
        },
      });

      // Close modal and reset form
      // setOpen(false);
      // reset();
    } catch (error) {
      toast.error("Failed to create follow up. Please try again.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <PhoneVisibilityProvider>
      <DSModal
        open={open}
        setOpen={handleClose}
        title="Add Follow Up"
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ p: 2 }}>
          {/* Lead Information Header */}
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
                width: 50,
                height: 50,
                fontSize: "1.25rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              }}
            >
              {lead?.name?.charAt(0)?.toUpperCase() || "L"}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1e293b" }}
              >
                {lead?.name || "Unnamed Lead"}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon fontSize="small" color="action" />
                  <SecurePhone
                    phoneNumber={lead?.phone}
                    variant="compact"
                    userRole="employee"
                    phoneId={`modal-${lead?.id || lead?._id}-phone`}
                  />
                </Box>
                {lead?.status && (
                  <Chip
                    label={
                      lead.status.charAt(0).toUpperCase() + lead.status.slice(1)
                    }
                    size="small"
                    sx={{
                      backgroundColor: statusConfig.bg,
                      color: statusConfig.color,
                      border: `1px solid ${statusConfig.border}`,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: "20px",
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Follow Up Form */}
          <FormProvider {...methods}>
            <DSForm onSubmit={onSubmit}>
              <Box sx={{ maxHeight: "70vh", overflowY: "auto", pr: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {/* ===== FOLLOW UP DETAILS SECTION ===== */}
                  <FollowUpDetails />

                  {/* ===== USER HEALTH INFORMATION SECTION ===== */}
                  <UserHealthInformation />

                  {/* ===== SUBMIT SECTION ===== */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 4,
                        background: "rgba(34, 197, 94, 0.05)",
                        borderRadius: 3,
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                        textAlign: "center",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Review all information above before submitting
                      </Typography>
                      <DSSubmitButton
                        type="submit"
                        loading={isSubmitting}
                        variant="contained"
                        size="large"
                        sx={{
                          backgroundColor: "success.main",
                          minWidth: "200px",
                          "&:hover": {
                            backgroundColor: "success.dark",
                          },
                        }}
                      >
                        {isSubmitting
                          ? "Saving Follow Up..."
                          : "Save Follow Up"}
                      </DSSubmitButton>
                    </Box>
                  </Grid>
                </Box>
              </Box>
            </DSForm>
          </FormProvider>
        </Box>
      </DSModal>
    </PhoneVisibilityProvider>
  );
};

export default AddFollowUpModal;
