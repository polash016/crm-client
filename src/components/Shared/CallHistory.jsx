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

  const getCallStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "answered":
        return <CallReceivedIcon color="success" />;
      case "missed":
      case "no_answer":
        return <CallMissedIcon color="error" />;
      case "initiated":
      case "ringing":
        return <CallMadeIcon color="primary" />;
      case "scheduled":
        return <ScheduleIcon color="warning" />;
      default:
        return <PhoneIcon color="action" />;
    }
  };

  const getCallStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "answered":
        return "success";
      case "missed":
      case "no_answer":
        return "error";
      case "initiated":
      case "ringing":
        return "primary";
      case "scheduled":
        return "warning";
      default:
        return "default";
    }
  };

  const formatCallDuration = (duration) => {
    if (!duration) return "N/A";

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const formatCallTime = (timestamp) => {
    if (!timestamp) return "N/A";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {leadName} • {phoneNumber}
          </Typography>
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
                    ? formatCallTime(callHistory[0]?.timestamp)
                    : "Never"}
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<PhoneIcon />}
                onClick={handleNewCall}
                sx={{ minWidth: 120 }}
              >
                New Call
              </Button>
            </Box>

            {/* Call History Table */}
            {callHistory.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Employee</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {callHistory.map((call, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {getCallStatusIcon(call.status)}
                            <Chip
                              label={call.status}
                              size="small"
                              color={getCallStatusColor(call.status)}
                              variant="outlined"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatCallTime(call.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatCallDuration(call.duration)}
                          </Typography>
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
                            <Typography variant="body2">
                              {call.employeeName || "Unknown"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 150 }}
                          >
                            {call.reason || "No reason provided"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View call details">
                            <IconButton
                              size="small"
                              onClick={() => handleCallDetails(call)}
                              sx={{ color: "primary.main" }}
                            >
                              <HistoryIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {selectedCall.status}
                </Typography>
                <Chip
                  icon={getCallStatusIcon(selectedCall.status)}
                  label={selectedCall.status}
                  color={getCallStatusColor(selectedCall.status)}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedCall.timestamp).toLocaleString()}
                </Typography>
              </Box>

              {selectedCall.duration && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1">
                    {formatCallDuration(selectedCall.duration)}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Employee
                </Typography>
                <Typography variant="body1">
                  {selectedCall.employeeName || "Unknown"}
                </Typography>
              </Box>

              {selectedCall.reason && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Call Reason
                  </Typography>
                  <Typography variant="body1">{selectedCall.reason}</Typography>
                </Box>
              )}

              {selectedCall.notes && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body1">{selectedCall.notes}</Typography>
                </Box>
              )}
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
