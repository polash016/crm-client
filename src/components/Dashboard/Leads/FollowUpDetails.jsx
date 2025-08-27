import React from "react";
import { Box, Typography } from "@mui/material";
import { CalendarToday as CalendarIcon } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import DSSelect from "@/components/Forms/DSSelect";
import DSInput from "@/components/Forms/DSInput";
import FollowUpScheduleRadio from "./FollowUpScheduleRadio";

const FollowUpDetails = () => {
  const { control, watch } = useFormContext();

  // Watch the values for conditional rendering
  const watchedOutcome = watch("followUpOutcome");
  const watchedManualFollowUp = watch("manualFollowUp");

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
    { id: "SHIP_LATER", name: "Ship Later" },
    { id: "DO_NOT_DISTURB", name: "Do Not Disturb" },
  ];

  const nextActionTypes = [
    { id: "REORDER_REMINDER", name: "Reorder Reminder" },
    { id: "CALLBACK_LATER", name: "Callback Later" },
    { id: "GENERAL_FOLLOW_UP", name: "General Follow Up" },
  ];

  return (
    <Box>
      <Box
        sx={{
          p: 4,
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
              />
            </Box>
            <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
              <DSInput
                control={control}
                name="notes"
                multiline
                rows={2}
                placeholder="Enter detailed follow-up notes, observations, and next steps..."
                fullWidth={true}
              />
            </Box>
          </Box>

          {/* Row 3: Conditional Ship Later Date */}
          {watchedOutcome === "SHIP_LATER" && (
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <DSInput
                control={control}
                name="shipLaterDate"
                placeholder="Ship Later Date"
                type="date"
                fullWidth={true}
              />
            </Box>
          )}

          {/* Row 4: Manual Follow Up Radio */}
          <FollowUpScheduleRadio />

          {/* Row 5: Conditional Next Follow Up Date */}
          {watchedManualFollowUp === true && (
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
                <DSInput
                  control={control}
                  name="nextFollowUpAt"
                  type="datetime-local"
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FollowUpDetails;
