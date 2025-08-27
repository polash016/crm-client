import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DSForm from "./DSForm";
import DynamicMetricsInput from "./DynamicMetricsInput";
import { toast } from "sonner";

const HealthSnapshotForm = ({
  onSubmit,
  initialData = {},
  isEditing = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      age: initialData.age || "",
      sugarFasting: initialData.sugarFasting || "",
      sugarRandom: initialData.sugarRandom || "",
      bpSystolic: initialData.bpSystolic || "",
      bpDiastolic: initialData.bpDiastolic || "",
      pulse: initialData.pulse || "",
      weightKg: initialData.weightKg || "",
      condition: initialData.condition || "",
      notes: initialData.notes || "",
      metrics: initialData.metrics || {},
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      // Convert string numbers to actual numbers
      const processedData = {
        ...data,
        age: data.age ? parseInt(data.age) : null,
        sugarFasting: data.sugarFasting ? parseFloat(data.sugarFasting) : null,
        sugarRandom: data.sugarRandom ? parseFloat(data.sugarRandom) : null,
        bpSystolic: data.bpSystolic ? parseInt(data.bpSystolic) : null,
        bpDiastolic: data.bpDiastolic ? parseInt(data.bpDiastolic) : null,
        pulse: data.pulse ? parseInt(data.pulse) : null,
        weightKg: data.weightKg ? parseFloat(data.weightKg) : null,
        // metrics is already processed by DynamicMetricsInput
      };

      const res = onSubmit(processedData).unwrap();
      toast.promise(res, {
        loading: "Saving...",
        success: (res) => {
          return res?.message || "Health snapshot saved successfully";
        },
        error: (error) => error?.message || "Something went wrong",
      });
      reset();
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const conditions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Obesity",
    "Asthma",
    "Arthritis",
    "None",
  ];

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        {isEditing ? "Edit Health Snapshot" : "Add Health Snapshot"}
      </Typography>

      <DSForm onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Health Metrics */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}
            >
              Basic Health Metrics
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Controller
              control={control}
              name="age"
              rules={{ min: { value: 0, message: "Age must be positive" } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Age (years)"
                  type="number"
                  size="small"
                  error={!!errors.age}
                  helperText={errors.age?.message}
                  placeholder="25"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Controller
              control={control}
              name="weightKg"
              rules={{ min: { value: 0, message: "Weight must be positive" } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  size="small"
                  error={!!errors.weightKg}
                  helperText={errors.weightKg?.message}
                  placeholder="70.5"
                  inputProps={{ step: 0.1 }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Controller
              control={control}
              name="bpSystolic"
              rules={{ min: { value: 0, message: "BP must be positive" } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="BP Systolic"
                  type="number"
                  size="small"
                  error={!!errors.bpSystolic}
                  helperText={errors.bpSystolic?.message}
                  placeholder="120"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Controller
              control={control}
              name="bpDiastolic"
              rules={{ min: { value: 0, message: "BP must be positive" } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="BP Diastolic"
                  type="number"
                  size="small"
                  error={!!errors.bpDiastolic}
                  helperText={errors.bpDiastolic?.message}
                  placeholder="80"
                />
              )}
            />
          </Grid>

          {/* Sugar Levels */}
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              control={control}
              name="sugarFasting"
              rules={{
                min: { value: 0, message: "Sugar level must be positive" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Fasting Sugar (mg/dL)"
                  type="number"
                  size="small"
                  error={!!errors.sugarFasting}
                  helperText={errors.sugarFasting?.message}
                  placeholder="95"
                  inputProps={{ step: 0.1 }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              control={control}
              name="sugarRandom"
              rules={{
                min: { value: 0, message: "Sugar level must be positive" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Random Sugar (mg/dL)"
                  type="number"
                  size="small"
                  error={!!errors.sugarRandom}
                  helperText={errors.sugarRandom?.message}
                  placeholder="140"
                  inputProps={{ step: 0.1 }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              control={control}
              name="pulse"
              rules={{ min: { value: 0, message: "Pulse must be positive" } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Pulse (bpm)"
                  type="number"
                  size="small"
                  error={!!errors.pulse}
                  helperText={errors.pulse?.message}
                  placeholder="72"
                />
              )}
            />
          </Grid>

          {/* Condition and Notes */}
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              name="condition"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Medical Condition"
                  size="small"
                  placeholder="Select condition"
                >
                  {conditions.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Notes"
                  size="small"
                  multiline
                  rows={2}
                  placeholder="Additional notes..."
                />
              )}
            />
          </Grid>

          {/* Dynamic Metrics */}
          <Grid item xs={12}>
            <DynamicMetricsInput
              control={control}
              name="metrics"
              label="Custom Metrics"
              placeholder="Add custom health metrics"
              helperText="Add any additional health parameters not covered above"
              defaultValue={initialData.metrics || {}}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                  ? "Update Snapshot"
                  : "Save Snapshot"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DSForm>
    </Paper>
  );
};

export default HealthSnapshotForm;
