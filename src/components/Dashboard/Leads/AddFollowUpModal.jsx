import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import DSModal from "@/components/Shared/DSModal/DSModal";
import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import DSSelect from "@/components/Forms/DSSelect";
import DSSubmitButton from "@/components/Shared/DSSubmitButton";
import SecurePhone from "@/components/Shared/SecurePhone";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { PhoneVisibilityProvider } from "@/contexts/PhoneVisibilityContext";
import { useCreateFollowUpMutation } from "@/redux/api/followUpApi";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import FollowUpScheduleRadio from "./FollowUpScheduleRadio";
import DynamicMetricsInput from "@/components/Forms/DynamicMetricsInput";

// Comprehensive follow-up schema with health tracking
const followUpSchema = z.object({
  followUpType: z.string().min(1, "Follow-up type is required"),
  outcome: z.string().min(1, "Outcome is required"),
  nextActionType: z.string().min(1, "Next action is required"),
  notes: z.string().optional(),
  // Comprehensive health fields with realistic validation
  age: z
    .union([z.string(), z.number()])
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num >= 1 && num <= 130;
    }, "Age must be between 1 and 130 years"),
  weight: z
    .union([z.string(), z.number()])
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num >= 1 && num <= 300;
    }, "Weight must be between 1 and 300 kg"),
  pulse: z
    .union([z.string(), z.number()])
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num >= 30 && num <= 200;
    }, "Pulse must be between 30 and 200 bpm"),
  bp: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const bpRegex = /^\d{2,3}\/\d{2,3}$/;
      if (!bpRegex.test(val)) return false;
      const [systolic, diastolic] = val.split("/").map(Number);
      return (
        systolic >= 70 &&
        systolic <= 250 &&
        diastolic >= 40 &&
        diastolic <= 150 &&
        systolic > diastolic
      );
    }, "Blood pressure must be in format '120/80' with systolic 70-250, diastolic 40-150"),
  bmSugar: z
    .union([z.string(), z.number()])
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num >= 7 && num <= 35;
    }, "Before meal sugar must be between 7 and 35 mmol/L"),
  amSugar: z
    .union([z.string(), z.number()])
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num >= 7 && num <= 35;
    }, "After meal sugar must be between 7 and 35 mmol/L"),
  condition: z.string().optional(),
  healthNotes: z.string().optional(),
  // Medicine assessment
  medicineEfficacy: z.string().optional(),
  medicineStockStatus: z.string().optional(),
  customerMood: z.string().optional(),
  // Manual follow-up scheduling
  manualFollowUp: z.boolean().optional(),
  // Conditional fields (number of days) - truly optional
  shipLaterDate: z
    .union([z.string(), z.number()])
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = typeof val === "string" ? parseInt(val, 10) : val;
      return num >= 1 && num <= 365;
    }, "Ship later date must be between 1 and 365 days"),
  nextFollowUpAt: z
    .union([z.string(), z.number()])
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = typeof val === "string" ? parseInt(val, 10) : val;
      return num >= 1 && num <= 365;
    }, "Follow-up date must be between 1 and 365 days"),
  // Dynamic health metrics
  metrics: z.record(z.any()).optional(),
});

const AddFollowUpModal = ({ open, setOpen, lead }) => {
  // ALL hooks must be called at the top level - before any conditional logic
  const [createFollowUp, { isLoading }] = useCreateFollowUpMutation();
  const [showHealthFields, setShowHealthFields] = React.useState(false);

  const methods = useForm({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      followUpType: "",
      outcome: "",
      nextActionType: "",
      notes: "",
      // Health metrics
      age: "",
      weight: "",
      pulse: "",
      bp: "",
      bmSugar: "",
      amSugar: "",
      condition: "",
      healthNotes: "",
      // Medicine assessment
      medicineEfficacy: "",
      medicineStockStatus: "",
      customerMood: "",
      // Manual follow-up
      manualFollowUp: false,
      // Conditional dates (number of days)
      shipLaterDate: null,
      nextFollowUpAt: null,
      // Dynamic metrics
      metrics: {},
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    control,
  } = methods;

  // Watch values for conditional rendering
  const watchedOutcome = watch("outcome");
  const watchedFollowUpType = watch("followUpType");
  const watchedManualFollowUp = watch("manualFollowUp");

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
      // Process the comprehensive data before sending to API
      const processedData = {
        leadId: lead?.id,
        followUpType: data.followUpType,
        outcome: data.outcome,
        nextActionType: data.nextActionType,
        note: data.notes || "",
        // Medicine assessment fields
        ...(data.medicineEfficacy && {
          medicineEfficacy: data.medicineEfficacy,
        }),
        ...(data.medicineStockStatus && {
          medicineStockStatus: data.medicineStockStatus,
        }),
        ...(data.customerMood && { customerMood: data.customerMood }),
        // Dates are now calculated from number inputs above
      };

      // Calculate dates from number inputs
      const calculateDateFromDays = (days) => {
        if (!days || days < 1) return null;
        const today = new Date();
        today.setDate(today.getDate() + Number(days));
        return today.toISOString();
      };

      // Handle ship later date calculation
      if (data.shipLaterDate && data.shipLaterDate > 0) {
        processedData.shipLaterDate = calculateDateFromDays(data.shipLaterDate);
      }

      // Handle manual follow-up date override with calculation
      if (
        data.manualFollowUp &&
        data.nextFollowUpAt &&
        data.nextFollowUpAt > 0
      ) {
        processedData.nextFollowUpAt = calculateDateFromDays(
          data.nextFollowUpAt
        );
        processedData.nextActionType = "GENERAL_FOLLOW_UP"; // Override with general follow-up for manual dates
      }

      // Add health snapshot data if health fields are provided
      const hasHealthData =
        data.age ||
        data.weight ||
        data.pulse ||
        data.bp ||
        data.bmSugar ||
        data.amSugar ||
        data.condition ||
        data.healthNotes ||
        (data.metrics && Object.keys(data.metrics).length > 0);

      if (hasHealthData) {
        processedData.user = {
          ...(data.age && { age: data.age }),
          ...(data.weight && { weight: data.weight }),
          ...(data.pulse && { pulse: data.pulse }),
          ...(data.bp && { bp: data.bp }),
          ...(data.bmSugar && { bmSugar: data.bmSugar }),
          ...(data.amSugar && { amSugar: data.amSugar }),
          ...(data.condition && { condition: data.condition }),
          ...(data.healthNotes && { notes: data.healthNotes }),
          ...(data.metrics &&
            Object.keys(data.metrics).length > 0 && {
              metrics: data.metrics,
            }),
        };
      }

      console.log({ processedData });

      // const res = await createFollowUp(processedData).unwrap();

      // toast.promise(Promise.resolve(res), {
      //   loading: "Creating...",
      //   success: (res) => {
      //     if (res?.data?.id) {
      //       setOpen(false);
      //       reset({
      //         followUpType: "",
      //         outcome: "",
      //         nextActionType: "",
      //         notes: "",
      //         age: "",
      //         weight: "",
      //         pulse: "",
      //         bp: "",
      //         bmSugar: "",
      //         amSugar: "",
      //         condition: "",
      //         healthNotes: "",
      //         medicineEfficacy: "",
      //         medicineStockStatus: "",
      //         customerMood: "",
      //         manualFollowUp: false,
      //         shipLaterDate: "",
      //         nextFollowUpAt: "",
      //         metrics: {},
      //       });
      //       setShowHealthFields(false); // Reset health fields visibility
      //       return res?.message || "Follow-up created successfully";
      //     }
      //     return res?.message || "Follow-up created successfully";
      //   },
      //   error: (error) => {
      //     return error?.message || "Something went wrong";
      //   },
      // });
    } catch (error) {
      toast.error("Failed to create follow-up. Please try again.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset({
      followUpType: "",
      outcome: "",
      nextActionType: "",
      notes: "",
      age: "",
      weight: "",
      pulse: "",
      bp: "",
      bmSugar: "",
      amSugar: "",
      condition: "",
      healthNotes: "",
      medicineEfficacy: "",
      medicineStockStatus: "",
      customerMood: "",
      manualFollowUp: false,
      shipLaterDate: null,
      nextFollowUpAt: null,
      metrics: {},
    });
    setShowHealthFields(false);
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

          {/* Simplified Follow Up Form */}
          <DSForm onSubmit={onSubmit} methods={methods}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* ===== COMPACT FOLLOW-UP FORM ===== */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Row 1: Follow-up Type & Outcome */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <DSSelect
                    name="followUpType"
                    label="Follow-up Type"
                    options={[
                      { id: "FIRST", name: "First Follow-up" },
                      { id: "SECOND", name: "Second Follow-up" },
                      { id: "REORDER", name: "Reorder" },
                      { id: "GENERAL", name: "General" },
                    ]}
                    fullWidth
                    size="small"
                  />

                  <Controller
                    name="outcome"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth size="small">
                        <InputLabel>Outcome</InputLabel>
                        <Select
                          {...field}
                          label="Outcome"
                          error={!!errors.outcome}
                          value={field.value || ""}
                        >
                          <MenuItem value="COMPLETED">Completed</MenuItem>
                          <MenuItem value="NO_ANSWER">No Answer</MenuItem>
                          <MenuItem value="BUSY">Busy</MenuItem>
                          <MenuItem value="WRONG_NUMBER">Wrong Number</MenuItem>
                          <MenuItem value="CUSTOMER_NOT_INTERESTED">
                            Not Interested
                          </MenuItem>
                          <MenuItem value="MEDICINE_WORKING_WELL">
                            Medicine Working Well
                          </MenuItem>
                          <MenuItem value="MEDICINE_NOT_WORKING">
                            Medicine Not Working
                          </MenuItem>
                          <MenuItem value="REORDER_PLACED">
                            Reorder Placed
                          </MenuItem>
                          <MenuItem value="SHIP_LATER">Ship Later</MenuItem>
                          <MenuItem value="DO_NOT_DISTURB">
                            Do Not Disturb
                          </MenuItem>
                        </Select>
                        {errors.outcome && (
                          <FormHelperText error>
                            {errors.outcome.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Box>

                {/* Row 2: Next Action & Notes */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <DSSelect
                    name="nextActionType"
                    label="Next Action"
                    options={[
                      { id: "REORDER_REMINDER", name: "Reorder Reminder" },
                      { id: "CALLBACK_LATER", name: "Callback Later" },
                      { id: "GENERAL_FOLLOW_UP", name: "General Follow-up" },
                    ]}
                    fullWidth
                    size="small"
                  />

                  <DSInput
                    name="notes"
                    label="Notes"
                    multiline
                    rows={2}
                    placeholder="Quick notes about the call..."
                    fullWidth
                    size="small"
                  />
                </Box>

                {/* Conditional Ship Later Date */}
                {watchedOutcome === "SHIP_LATER" && (
                  <DSInput
                    name="shipLaterDate"
                    label="Ship in X days"
                    type="number"
                    placeholder="e.g., 7"
                    helperText="Enter number of days from today"
                    fullWidth
                    size="small"
                  />
                )}

                {/* ===== NEXT FOLLOW-UP SCHEDULING ===== */}
                <Box>
                  <FollowUpScheduleRadio />
                </Box>

                {/* Conditional Manual Next Follow-up Date */}
                {watchedManualFollowUp === true && (
                  <DSInput
                    name="nextFollowUpAt"
                    label="Follow up in X days"
                    type="number"
                    placeholder="e.g., 3"
                    helperText="Enter number of days from today"
                    fullWidth
                    size="small"
                  />
                )}

                {/* Health Fields Toggle */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowHealthFields(!showHealthFields)}
                    sx={{ minWidth: "auto" }}
                  >
                    {showHealthFields ? "Hide" : "Show"} Health Details
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Customer health information
                  </Typography>
                </Box>

                {/* Comprehensive Health Fields */}
                {showHealthFields && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      p: 3,
                      bgcolor: "grey.50",
                      borderRadius: 2,
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    {/* Basic Health Metrics */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          mb: 2,
                          fontSize: "0.875rem",
                        }}
                      >
                        Basic Health Metrics
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <DSInput
                          name="age"
                          label="Age (years)"
                          type="number"
                          placeholder="25"
                          size="small"
                          sx={{ flex: "1 1 120px", minWidth: "100px" }}
                        />

                        <DSInput
                          name="weight"
                          label="Weight (kg)"
                          type="number"
                          placeholder="70.5"
                          size="small"
                          inputProps={{ step: 0.1 }}
                          sx={{ flex: "1 1 120px", minWidth: "100px" }}
                        />

                        <DSInput
                          name="pulse"
                          label="Pulse (bpm)"
                          type="number"
                          placeholder="72"
                          size="small"
                          sx={{ flex: "1 1 120px", minWidth: "100px" }}
                        />

                        <DSInput
                          name="bp"
                          label="Blood Pressure"
                          placeholder="120/80"
                          size="small"
                          sx={{ flex: "1 1 140px", minWidth: "120px" }}
                        />
                      </Box>
                    </Box>

                    {/* Blood Sugar Levels */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          mb: 2,
                          fontSize: "0.875rem",
                        }}
                      >
                        Blood Sugar Levels
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <DSInput
                          name="bmSugar"
                          label="Before Meal (mg/dL)"
                          type="number"
                          placeholder="95.0"
                          size="small"
                          inputProps={{ step: 0.1 }}
                          sx={{ flex: "1 1 160px", minWidth: "140px" }}
                        />

                        <DSInput
                          name="amSugar"
                          label="After Meal (mg/dL)"
                          type="number"
                          placeholder="140.0"
                          size="small"
                          inputProps={{ step: 0.1 }}
                          sx={{ flex: "1 1 160px", minWidth: "140px" }}
                        />
                      </Box>
                    </Box>

                    {/* Medical Information */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          mb: 2,
                          fontSize: "0.875rem",
                        }}
                      >
                        Medical Information
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <DSInput
                          name="condition"
                          label="Medical Condition"
                          placeholder="e.g., Diabetes, Hypertension"
                          size="small"
                        />

                        <DSInput
                          name="healthNotes"
                          label="Health Notes"
                          multiline
                          rows={2}
                          placeholder="Additional health observations, symptoms, or concerns..."
                          size="small"
                        />
                      </Box>
                    </Box>

                    {/* Medicine & Customer Assessment */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          mb: 2,
                          fontSize: "0.875rem",
                        }}
                      >
                        Medicine & Customer Assessment
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <DSSelect
                          name="medicineEfficacy"
                          label="Medicine Working?"
                          options={[
                            { id: "EXCELLENT", name: "Excellent" },
                            { id: "GOOD", name: "Good" },
                            { id: "MODERATE", name: "Moderate" },
                            { id: "POOR", name: "Poor" },
                            { id: "NOT_WORKING", name: "Not Working" },
                          ]}
                          size="small"
                          sx={{ flex: "1 1 160px", minWidth: "140px" }}
                        />

                        <DSSelect
                          name="medicineStockStatus"
                          label="Medicine Stock"
                          options={[
                            { id: "PLENTY", name: "Plenty Left" },
                            { id: "RUNNING_LOW", name: "Running Low" },
                            { id: "CRITICAL", name: "Critical" },
                            { id: "FINISHED", name: "Finished" },
                          ]}
                          size="small"
                          sx={{ flex: "1 1 160px", minWidth: "140px" }}
                        />

                        <DSSelect
                          name="customerMood"
                          label="Customer Mood"
                          options={[
                            { id: "VERY_POSITIVE", name: "Very Positive" },
                            { id: "POSITIVE", name: "Positive" },
                            { id: "NEUTRAL", name: "Neutral" },
                            { id: "NEGATIVE", name: "Negative" },
                            { id: "VERY_NEGATIVE", name: "Very Negative" },
                            { id: "ANGRY", name: "Angry" },
                          ]}
                          size="small"
                          sx={{ flex: "1 1 160px", minWidth: "140px" }}
                        />
                      </Box>
                    </Box>

                    {/* ===== DYNAMIC HEALTH METRICS ===== */}
                    <Box>
                      <DynamicMetricsInput
                        control={control}
                        name="metrics"
                        label="Custom Health Parameters"
                        placeholder="Add custom health parameters"
                        helperText="Add any additional health metrics not covered above (e.g., heart rate, blood oxygen, cholesterol levels, etc.)"
                      />
                    </Box>
                  </Box>
                )}
              </Box>

              {/* ===== SUBMIT BUTTON ===== */}
              <Box
                sx={{
                  p: 2,
                  background: "rgba(34, 197, 94, 0.05)",
                  borderRadius: 2,
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  textAlign: "center",
                }}
              >
                <DSSubmitButton
                  type="submit"
                  loading={isSubmitting}
                  variant="contained"
                  sx={{
                    backgroundColor: "success.main",
                    minWidth: "200px",
                    "&:hover": { backgroundColor: "success.dark" },
                  }}
                >
                  {isSubmitting ? "Saving..." : "Save Follow-up"}
                </DSSubmitButton>
              </Box>
            </Box>
          </DSForm>
        </Box>
      </DSModal>
    </PhoneVisibilityProvider>
  );
};

export default AddFollowUpModal;
