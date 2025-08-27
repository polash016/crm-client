"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Alert,
  Badge,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  CallMade as CallMadeIcon,
  CallReceived as CallReceivedIcon,
  CallMissed as CallMissedIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const CallHistory = ({
  leadId,
  leadName,
  phoneNumber,
  callHistory = [],
  open,
  onClose,
  onNewCall,
}) => {
  const [selectedCall, setSelectedCall] = useState(null);

  // Function to get employee display name
  const getEmployeeDisplayName = (call) => {
    if (call.user?.profile?.firstName || call.user?.profile?.lastName) {
      const firstName = call.user.profile.firstName || "";
      const lastName = call.user.profile.lastName || "";
      return `${firstName} ${lastName}`.trim();
    }
    return call.userId || "Unknown";
  };

  // Function to format date and time properly
  const formatCallDateTime = (timestamp) => {
    if (!timestamp) return "N/A";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    // Format for today
    if (diffInHours < 24) {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    // Format for this week
    else if (diffInHours < 168) {
      return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    // Format for older dates
    else {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  // Function to get relative time (e.g., "2 hours ago")
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return "";
  };

  const handleNewCall = () => {
    if (onNewCall) {
      onNewCall({ leadId, leadName, phoneNumber });
    }
    onClose();
  };

  const handleCallDetails = (call) => {
    setSelectedCall(call);
  };

  const handleCloseCallDetails = () => {
    setSelectedCall(null);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon color="primary" />
              <Typography variant="h6">Call History</Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {leadName} • {phoneNumber}
          </Typography> */}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Call Summary */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                background: "rgba(59, 130, 246, 0.05)",
                borderRadius: 2,
                border: "1px solid rgba(59, 130, 246, 0.1)",
              }}
            >
              <Box>
                <Typography variant="h6" color="primary">
                  {callHistory.length} Total Calls
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last call:{" "}
                  {callHistory.length > 0
                    ? formatCallDateTime(callHistory[0]?.createdAt)
                    : "Never"}
                </Typography>
              </Box>

              {/* <Button
                variant="contained"
                startIcon={<PhoneIcon />}
                onClick={handleNewCall}
                sx={{ minWidth: 120 }}
              >
                New Call
              </Button> */}
            </Box>

            {/* Call History Table */}
            {callHistory.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Employee</TableCell>
                      <TableCell>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {callHistory.map((call, index) => (
                      <TableRow
                        key={call.id || index}
                        hover
                        onClick={() => handleCallDetails(call)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {formatCallDateTime(call.createdAt)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {getRelativeTime(call.createdAt)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PersonIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={500}>
                              {getEmployeeDisplayName(call)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 200,
                              color: call.reason
                                ? "text.primary"
                                : "text.secondary",
                            }}
                          >
                            {call.reason || "No reason provided"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" icon={<HistoryIcon />}>
                No call history available for this lead.
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Call Details Dialog */}
      <Dialog
        open={!!selectedCall}
        onClose={handleCloseCallDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIcon color="primary" />
            Call Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCall && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatCallDateTime(selectedCall.createdAt)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getRelativeTime(selectedCall.createdAt)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Employee
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {getEmployeeDisplayName(selectedCall)}
                </Typography>
                {selectedCall.userId && (
                  <Typography variant="caption" color="text.secondary">
                    ID: {selectedCall.userId}
                  </Typography>
                )}
              </Box>

              {selectedCall.reason && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Call Reason
                  </Typography>
                  <Typography variant="body1">{selectedCall.reason}</Typography>
                </Box>
              )}

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Call ID
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {selectedCall.id}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Lead ID
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {selectedCall.leadId}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCallDetails} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CallHistory;
