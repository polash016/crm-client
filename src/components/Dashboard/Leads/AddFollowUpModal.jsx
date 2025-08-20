import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import DSModal from "@/components/Shared/DSModal/DSModal";
import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import DSSelect from "@/components/Forms/DSSelect";
import DSSubmitButton from "@/components/Shared/DSSubmitButton";
import SecurePhone from "@/components/Shared/SecurePhone";
import DynamicMetricsInput from "@/components/Forms/DynamicMetricsInput";
import { useForm, Controller } from "react-hook-form";

const AddFollowUpModal = ({ open, setOpen, lead }) => {
  if (!lead) return null;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
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

  const watchedOutcome = watch("followUpOutcome");
  const watchedManualFollowUp = watch("manualFollowUp");
  console.log({ watchedOutcome, watchedManualFollowUp });

  const followUpTypes = [
    { id: "FIRST", name: "First Follow Up" },
    { id: "SECOND", name: "Second Follow Up" },
    { id: "REORDER", name: "Reorder" },
    { id: "GENERAL", name: "General Follow Up" },
  ];

  const followUpOutcomes = [
    { id: "COMPLETED", name: "Completed" },
    { id: "NO_ANSWER", name: "No Answer" },
    { id: "BUSY", name: "Busy" },
    { id: "WRONG_NUMBER", name: "Wrong Number" },
    { id: "REVIEW_CAPTURED", name: "Review Captured" },
    { id: "HEALTH_UPDATE_ONLY", name: "Health Update Only" },
    { id: "REORDER_PLACED", name: "Reorder Placed" },
    { id: "NO_REORDER", name: "No Reorder" },
    { id: "CALL_LATER", name: "Call Later" },
    { id: "DO_NOT_DISTURB", name: "Do Not Disturb" },
  ];

  const nextActionTypes = [
    { id: "REORDER_REMINDER", name: "Reorder Reminder" },
    { id: "CALLBACK_LATER", name: "Callback Later" },
    { id: "GENERAL_FOLLOW_UP", name: "General Follow Up" },
  ];

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
      console.log("Follow-up data:", data);

      // Process the data before sending to API
      const processedData = {
        ...data,
        user: {
          ...data.user,
          age: data.user.age ? parseInt(data.user.age) : null,
          bmSugar: data.user.bmSugar ? parseFloat(data.user.bmSugar) : null,
          amSugar: data.user.amSugar ? parseFloat(data.user.amSugar) : null,
          bp: data.user.bp || null,
          pulse: data.user.pulse ? parseInt(data.user.pulse) : null,
          weight: data.user.weight ? parseFloat(data.user.weight) : null,
          condition: data.user.condition || null,
          notes: data.user.notes || null,
          metrics: data.user.metrics || {},
        },
        // Only include dates if they have values
        ...(data.shipLaterDate && { shipLaterDate: data.shipLaterDate }),
        ...(data.nextFollowUpAt && { nextFollowUpAt: data.nextFollowUpAt }),
      };

      console.log("Processed data:", processedData);

      // TODO: Implement API call to save follow-up
      // await saveFollowUp(processedData);

      // Close modal and reset form
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
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
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
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
        <DSForm onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ maxHeight: "70vh", overflowY: "auto", pr: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* ===== FOLLOW UP DETAILS SECTION ===== */}
              <Box>
                <Box
                  sx={{
                    p: 4,
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                    borderRadius: 3,
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                      mb: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: "1.125rem",
                    }}
                  >
                    <CalendarIcon color="primary" />
                    Follow Up Details
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {/* Row 1: First 2 Select Fields */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
                        <DSSelect
                          control={control}
                          name="followUpType"
                          label="Follow Up Type"
                          options={followUpTypes}
                          fullWidth={true}
                          required
                          error={errors.followUpType}
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
                        <DSSelect
                          control={control}
                          name="followUpOutcome"
                          label="Follow Up Outcome"
                          options={followUpOutcomes}
                          fullWidth={true}
                          required
                          error={errors.followUpOutcome}
                        />
                      </Box>
                    </Box>

                    {/* Row 2: Third Select + Notes */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
                        <DSSelect
                          control={control}
                          name="nextActionType"
                          label="Next Action Type"
                          options={nextActionTypes}
                          required
                          fullWidth={true}
                          error={errors.nextActionType}
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 400px", minWidth: "300px" }}>
                        <DSInput
                          control={control}
                          name="notes"
                          // label="Follow Up Notes"
                          multiline
                          rows={3}
                          placeholder="Enter detailed follow-up notes, observations, and next steps..."
                          error={errors.notes}
                          fullWidth={true}
                        />
                      </Box>
                    </Box>

                    {/* Row 3: Conditional Ship Later Date */}
                    {watchedOutcome === "CALL_LATER" && (
                      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {/* <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}> */}
                        <DSInput
                          control={control}
                          name="shipLaterDate"
                          placeholder="Ship Later Date"
                          type="date"
                          fullWidth={true}
                          error={errors.shipLaterDate}
                        />
                        {/* </Box> */}
                      </Box>
                    )}

                    {/* Row 4: Manual Follow Up Radio */}
                    <Box
                      sx={{
                        p: 3,
                        background: "rgba(59, 130, 246, 0.05)",
                        borderRadius: 2,
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600, color: "#374151" }}
                      >
                        Next Follow Up Schedule
                      </Typography>
                      <Controller
                        control={control}
                        name="manualFollowUp"
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            value={field.value || false}
                            onChange={(e) => {
                              field.onChange(e.target.value === "true");
                            }}
                            row
                          >
                            <FormControlLabel
                              value="true"
                              control={<Radio />}
                              label="Set Manual Next Follow Up Date"
                            />
                            <FormControlLabel
                              value="false"
                              control={<Radio />}
                              label="No Manual Follow Up"
                            />
                          </RadioGroup>
                        )}
                      />
                    </Box>

                    {/* Row 5: Conditional Next Follow Up Date */}
                    {watchedManualFollowUp === true && (
                      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
                          <DSInput
                            control={control}
                            name="nextFollowUpAt"
                            // label="Next Follow Up Date & Time"
                            type="datetime-local"
                            error={errors.nextFollowUpAt}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* ===== USER HEALTH INFORMATION SECTION ===== */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 4,
                    background:
                      "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                    borderRadius: 3,
                    border: "1px solid rgba(14, 165, 233, 0.2)",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#0c4a6e",
                      mb: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: "1.125rem",
                    }}
                  >
                    <PersonIcon color="primary" />
                    User Health Information
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {/* Row 1: Basic Health Metrics */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: "#374151",
                            mb: 2,
                            fontSize: "0.875rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Basic Health Metrics
                        </Typography>
                        <DSInput
                          control={control}
                          name="user.age"
                          label="Age (years)"
                          type="number"
                          placeholder="25"
                          error={errors.user?.age}
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
                        <DSInput
                          control={control}
                          name="user.weight"
                          label="Weight (kg)"
                          type="number"
                          placeholder="70.5"
                          inputProps={{ step: 0.1 }}
                          error={errors.user?.weight}
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
                        <DSInput
                          control={control}
                          name="user.pulse"
                          label="Pulse (bpm)"
                          type="number"
                          placeholder="72"
                          error={errors.user?.pulse}
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
                        <DSInput
                          control={control}
                          name="user.bp"
                          label="Blood Pressure"
                          placeholder="120/80"
                          error={errors.user?.bp}
                        />
                      </Box>
                    </Box>

                    <Grid item xs={12} sm={3} md={3}>
                      <DSInput
                        control={control}
                        name="user.weight"
                        label="Weight (kg)"
                        type="number"
                        placeholder="70.5"
                        inputProps={{ step: 0.1 }}
                        error={errors.user?.weight}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={3}>
                      <DSInput
                        control={control}
                        name="user.pulse"
                        label="Pulse (bpm)"
                        type="number"
                        placeholder="72"
                        error={errors.user?.pulse}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={3}>
                      <DSInput
                        control={control}
                        name="user.bp"
                        label="Blood Pressure"
                        placeholder="120/80"
                        error={errors.user?.bp}
                      />
                    </Grid>

                    {/* Row 2: Sugar Levels */}
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          mb: 2,
                          fontSize: "0.875rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Blood Sugar Levels
                      </Typography>
                      <DSInput
                        control={control}
                        name="user.bmSugar"
                        label="Before Meal Sugar (mg/dL)"
                        type="number"
                        placeholder="95.0"
                        inputProps={{ step: 0.1 }}
                        error={errors.user?.bmSugar}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <DSInput
                        control={control}
                        name="user.amSugar"
                        label="After Meal Sugar (mg/dL)"
                        type="number"
                        placeholder="140.0"
                        inputProps={{ step: 0.1 }}
                        error={errors.user?.amSugar}
                      />
                    </Grid>

                    {/* Row 3: Medical Information */}
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          mb: 2,
                          fontSize: "0.875rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Medical Information
                      </Typography>
                      <DSInput
                        control={control}
                        name="user.condition"
                        label="Medical Condition"
                        placeholder="e.g., Diabetes, Hypertension"
                        error={errors.user?.condition}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <DSInput
                        control={control}
                        name="user.notes"
                        label="Health Notes"
                        multiline
                        rows={2}
                        placeholder="Additional health observations, symptoms, or concerns..."
                        error={errors.user?.notes}
                      />
                    </Grid>

                    {/* Row 4: Dynamic Metrics */}
                    <Grid item xs={12}>
                      <DynamicMetricsInput
                        control={control}
                        name="user.metrics"
                        label="Custom Health Metrics"
                        placeholder="Add custom health parameters"
                        helperText="Add any additional health metrics not covered above (e.g., heart rate, blood oxygen, etc.)"
                      />
                    </Grid>
                  </Box>
                </Box>
              </Grid>

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
                    {isSubmitting ? "Saving Follow Up..." : "Save Follow Up"}
                  </DSSubmitButton>
                </Box>
              </Grid>
            </Box>
          </Box>
        </DSForm>
      </Box>
    </DSModal>
  );
};

export default AddFollowUpModal;
