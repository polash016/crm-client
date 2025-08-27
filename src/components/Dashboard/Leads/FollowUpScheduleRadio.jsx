import React from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const FollowUpScheduleRadio = () => {
  const { control } = useFormContext();

  return (
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
  );
};

export default FollowUpScheduleRadio;
