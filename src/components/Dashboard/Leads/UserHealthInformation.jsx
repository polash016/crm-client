import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import DSInput from "@/components/Forms/DSInput";
import DynamicMetricsInput from "@/components/Forms/DynamicMetricsInput";

const UserHealthInformation = () => {
  const { control } = useFormContext();

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        borderRadius: 3,
        border: "1px solid rgba(14, 165, 233, 0.2)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 4,
        }}
      >
        <PersonIcon color="primary" />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#0c4a6e",
            fontSize: "1.125rem",
          }}
        >
          User Health Information
        </Typography>
      </Box>

      {/* Basic Health Metrics Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#374151",
            mb: 3,
            fontSize: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "2px solid rgba(14, 165, 233, 0.3)",
            pb: 1,
          }}
        >
          Basic Health Metrics
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
            <DSInput
              control={control}
              name="user.age"
              label="Age (years)"
              type="number"
              placeholder="25"
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
            />
          </Box>

          <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
            <DSInput
              control={control}
              name="user.pulse"
              label="Pulse (bpm)"
              type="number"
              placeholder="72"
            />
          </Box>

          <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
            <DSInput
              control={control}
              name="user.bp"
              label="Blood Pressure"
              placeholder="120/80"
            />
          </Box>
        </Box>
      </Box>

      {/* Blood Sugar Levels Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#374151",
            mb: 3,
            fontSize: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "2px solid rgba(14, 165, 233, 0.3)",
            pb: 1,
          }}
        >
          Blood Sugar Levels
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <DSInput
              control={control}
              name="user.bmSugar"
              label="Before Meal Sugar (mg/dL)"
              type="number"
              placeholder="95.0"
              inputProps={{ step: 0.1 }}
              fullWidth={true}
            />
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <DSInput
              control={control}
              name="user.amSugar"
              label="After Meal Sugar (mg/dL)"
              type="number"
              placeholder="140.0"
              inputProps={{ step: 0.1 }}
              fullWidth={true}
            />
          </Box>
        </Box>
      </Box>

      {/* Medical Information Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#374151",
            mb: 3,
            fontSize: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "2px solid rgba(14, 165, 233, 0.3)",
            pb: 1,
          }}
        >
          Medical Information
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <DSInput
              control={control}
              name="user.condition"
              label="Medical Condition"
              placeholder="e.g., Diabetes, Hypertension"
              fullWidth={true}
            />
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <DSInput
              control={control}
              name="user.notes"
              label="Health Notes"
              multiline
              rows={2}
              placeholder="Additional health observations, symptoms, or concerns..."
              fullWidth={true}
            />
          </Box>
        </Box>
      </Box>

      {/* Custom Health Metrics Section */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#374151",
            mb: 3,
            fontSize: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "2px solid rgba(14, 165, 233, 0.3)",
            pb: 1,
          }}
        >
          Custom Health Metrics
        </Typography>

        <DynamicMetricsInput
          control={control}
          name="user.metrics"
          label="Additional Health Parameters"
          placeholder="Add custom health parameters"
          helperText="Add any additional health metrics not covered above (e.g., heart rate, blood oxygen, etc.)"
        />
      </Box>
    </Box>
  );
};

export default UserHealthInformation;
