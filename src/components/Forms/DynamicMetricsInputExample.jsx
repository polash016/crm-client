import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import DynamicMetricsInput from "./DynamicMetricsInput";

const DynamicMetricsInputExample = () => {
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      basicMetrics: {
        temperature: 98.6,
        humidity: 45,
        pressure: 1013,
      },
      customMetrics: {},
    },
  });

  const watchedMetrics = watch();

  const onSubmit = (data) => {};

  const handleReset = () => {
    reset({
      basicMetrics: {
        temperature: 98.6,
        humidity: 45,
        pressure: 1013,
      },
      customMetrics: {},
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Dynamic Metrics Input Examples
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Example 1: Pre-filled Metrics
        </Typography>
        <DynamicMetricsInput
          control={control}
          name="basicMetrics"
          label="Basic Health Metrics"
          helperText="These are pre-filled metrics that can be edited"
        />
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Example 2: Empty Custom Metrics
        </Typography>
        <DynamicMetricsInput
          control={control}
          name="customMetrics"
          label="Custom Metrics"
          placeholder="Add your own health parameters"
          helperText="Start with an empty object and add custom metrics"
        />
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Current Form Values
        </Typography>
        <Box sx={{ background: "rgba(0,0,0,0.05)", p: 2, borderRadius: 1 }}>
          <Typography
            variant="body2"
            component="pre"
            sx={{ fontSize: "0.75rem" }}
          >
            {JSON.stringify(watchedMetrics, null, 2)}
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <Button variant="outlined" onClick={handleReset}>
          Reset Form
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Submit Form
        </Button>
      </Box>

      <Paper
        elevation={1}
        sx={{ p: 2, mt: 3, background: "rgba(59, 130, 246, 0.05)" }}
      >
        <Typography
          variant="body2"
          color="primary"
          sx={{ fontWeight: 600, mb: 1 }}
        >
          💡 How to Use:
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5 }}
        >
          1. Type a property name (e.g., "heartRate") in the first field
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5 }}
        >
          2. Type a value (e.g., "72") in the second field
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5 }}
        >
          3. Click "Add" or press Enter to add the metric
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5 }}
        >
          4. Use the edit/delete buttons to modify existing metrics
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block" }}
        >
          5. The component automatically detects number types and converts them
        </Typography>
      </Paper>
    </Box>
  );
};

export default DynamicMetricsInputExample;
