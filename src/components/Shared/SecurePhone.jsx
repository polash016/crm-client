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
  TextField,
  Alert,
  Stack,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Call as CallIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { phoneConfig, hasPermission } from "@/config/phoneConfig";
import { usePhoneVisibility } from "@/contexts/PhoneVisibilityContext";
import { useCreateCallLogMutation } from "@/redux/api/callLogApi";
import { toast } from "sonner";

const SecurePhone = ({
  phoneNumber,
  showCallButton = true,
  variant = "default",
  size = "medium",
  onCall,
  requireConfirmation = true,
  userRole = "employee", // For role-based access control
  phoneId, // Unique identifier for this phone number
  row,
}) => {
  const [createCallLog, { isLoading: isCreatingCallLog }] =
    useCreateCallLogMutation();
  const { isPhoneVisible, showPhone, hidePhone } = usePhoneVisibility();
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callReason, setCallReason] = useState("");
  const [isCalling, setIsCalling] = useState(false);

  // Use the global visibility state instead of local state
  const isVisible = isPhoneVisible(phoneId);

  // Check if user has permission to view phone numbers
  const canViewPhone = hasPermission(userRole, "canViewPhone");

  // Check if user has permission to make calls
  const canMakeCalls = hasPermission(userRole, "canMakeCalls");

  if (!phoneNumber) {
    return (
      <Typography variant="body2" color="text.secondary">
        No phone number
      </Typography>
    );
  }

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // Format based on length
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(
        4,
        7
      )}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }

    return phone; // Return original if can't format
  };

  // Mask phone number for security
  const maskPhoneNumber = (phone) => {
    if (!phone) return "";

    const cleaned = phone.replace(/\D/g, "");
    const maskingConfig = phoneConfig.security.masking;

    if (!maskingConfig.enabled) {
      return formatPhoneNumber(phone);
    }

    const { first, last } = maskingConfig.visibleDigits;
    const maskChar = maskingConfig.maskChar;

    // Format based on length
    if (cleaned.length === 10) {
      const areaCode = cleaned.slice(0, 3);
      const middle = maskChar.repeat(3);
      const lastDigits = cleaned.slice(6);
      return `(${areaCode}) ${middle}-${lastDigits}`;
    } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
      const countryCode = "+1";
      const areaCode = cleaned.slice(1, 4);
      const middle = maskChar.repeat(3);
      const lastDigits = cleaned.slice(7);
      return `${countryCode} (${areaCode}) ${middle}-${lastDigits}`;
    } else if (cleaned.length === 7) {
      const firstDigits = cleaned.slice(0, 3);
      const lastDigits = cleaned.slice(5);
      return `${firstDigits}-${maskChar.repeat(2)}${lastDigits}`;
    }

    // Generic masking for other formats
    const visibleChars = Math.min(first, Math.floor(phone.length * 0.3));
    const lastVisible = Math.min(last, Math.floor(phone.length * 0.2));
    const middleMask = maskChar.repeat(
      phone.length - visibleChars - lastVisible
    );

    return `${phone.slice(0, visibleChars)}${middleMask}${phone.slice(
      -lastVisible
    )}`;
  };

  const handleToggleVisibility = () => {
    if (canViewPhone) {
      if (isVisible) {
        hidePhone();
      } else {
        showPhone(phoneId);
      }
    }
  };

  const handleCallClick = () => {
    if (!canMakeCalls) {
      return;
    }

    if (requireConfirmation) {
      setShowCallDialog(true);
    } else {
      initiateCall();
    }
  };

  const handleCopyNumber = async () => {
    try {
      const raw = phoneNumber?.toString() || "";
      await navigator.clipboard.writeText(raw);
      toast.success("Phone number copied to clipboard");
    } catch (e) {
      try {
        const el = document.createElement("textarea");
        el.value = phoneNumber?.toString() || "";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        toast.success("Phone number copied to clipboard");
      } catch {
        toast.error("Failed to copy phone number");
      }
    }
  };

  const initiateCall = () => {
    setIsCalling(true);

    try {
      // Get protocols from configuration
      const protocols = phoneConfig.sip.protocols;
      const defaultClient = phoneConfig.sip.defaultClient;

      // Build protocol links based on configuration
      const protocolLinks = protocols
        .map((protocol) => {
          switch (protocol) {
            case "sip":
              return `sip:${phoneNumber.replace(/\D/g, "")}`;
            case "tel":
              return `tel:${phoneNumber.replace(/\D/g, "")}`;
            case "callto":
              return `callto:${phoneNumber.replace(/\D/g, "")}`;
            case "skype":
              return `skype:${phoneNumber.replace(/\D/g, "")}`;
            default:
              return null;
          }
        })
        .filter(Boolean);

      // Add client-specific protocols
      if (defaultClient === "microsip") {
        const microsipConfig = phoneConfig.sip.microsip;
        protocolLinks.unshift(
          `${microsipConfig.protocol}${phoneNumber.replace(/\D/g, "")}@${
            microsipConfig.domain
          }:${microsipConfig.port}`
        );
      }

      // Attempt to open the first available protocol
      let opened = false;

      protocolLinks.forEach((protocol) => {
        if (!opened) {
          try {
            const link = document.createElement("a");
            link.href = protocol;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            opened = true;

            // Log the call attempt
            if (onCall) {
              onCall({
                phoneNumber,
                protocol: protocol.split(":")[0],
                timestamp: new Date().toISOString(),
                reason: callReason || "Direct call",
                method: "protocol_redirect",
                client: defaultClient,
              });
            }
          } catch (error) {
            toast.error(`Protocol ${protocol} failed, trying next...`);
          }
        }
      });

      // If no protocol worked, show instructions
      if (!opened) {
        const instructions = `
          Unable to initiate call automatically. 
          
          To make a call:
          1. Copy this number: ${phoneNumber}
          2. Open your phone app or SIP client (${defaultClient})
          3. Dial the number manually
          
          Or ensure your SIP client is properly configured.
        `;
        alert(instructions);
      }
    } catch (error) {
      alert(
        "Error initiating call. Please try again or copy the number manually."
      );
    } finally {
      setIsCalling(false);
      setShowCallDialog(false);
      setCallReason("");
    }
  };

  const handleCallConfirm = () => {
    // Validate that call reason is provided and has meaningful content
    if (!callReason || callReason.trim() === "") {
      toast.error(
        "Call reason is required. Please provide a reason before making the call."
      );
      return;
    }

    // Additional validation: ensure call reason has meaningful content (not just spaces)
    if (callReason.trim().length < 3) {
      toast.error("Call reason must be at least 3 characters long.");
      return;
    }

    const data = {
      leadId: row?.id,
      reason: callReason,
    };

    const res = createCallLog(data).unwrap();

    toast.promise(res, {
      loading: "Creating...",
      success: (res) => {
        if (res.data.id) {
          initiateCall();
        }
        return res?.message || "Call log created successfully";
      },
      error: (error) => {
        return error?.message || "Something went wrong";
      },
    });
  };

  const handleCallCancel = () => {
    setShowCallDialog(false);
    setCallReason("");
  };

  // Different display variants
  const renderPhoneDisplay = () => {
    const displayNumber = isVisible
      ? formatPhoneNumber(phoneNumber)
      : maskPhoneNumber(phoneNumber);

    switch (variant) {
      case "chip":
        return (
          <Tooltip title="Double click to copy • Click to toggle">
            <Chip
              label={displayNumber}
              size={size}
              icon={isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              onClick={handleToggleVisibility}
              onDoubleClick={handleCopyNumber}
              sx={{
                cursor: canViewPhone ? "pointer" : "default",
                backgroundColor: isVisible
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(59, 130, 246, 0.1)",
                color: isVisible ? "#dc2626" : "#3b82f6",
                border: `1px solid ${
                  isVisible
                    ? "rgba(239, 68, 68, 0.3)"
                    : "rgba(59, 130, 246, 0.3)"
                }`,
                "&:hover": {
                  backgroundColor: isVisible
                    ? "rgba(239, 68, 68, 0.2)"
                    : "rgba(59, 130, 246, 0.2)",
                },
              }}
            />
          </Tooltip>
        );

      case "compact":
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Click to copy">
              <Typography
                variant="body2"
                onClick={handleCopyNumber}
                sx={{ fontFamily: "monospace", cursor: "pointer" }}
              >
                {displayNumber}
              </Typography>
            </Tooltip>
            {canViewPhone && (
              <IconButton
                size="small"
                onClick={handleToggleVisibility}
                sx={{ p: 0.5 }}
              >
                {isVisible ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </IconButton>
            )}
          </Box>
        );

      default:
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Click to copy">
              <Typography
                variant="body2"
                onClick={handleCopyNumber}
                sx={{ fontFamily: "monospace", cursor: "pointer" }}
              >
                {displayNumber}
              </Typography>
            </Tooltip>
            {canViewPhone && (
              <IconButton
                size="small"
                onClick={handleToggleVisibility}
                sx={{
                  p: 0.5,
                  color: isVisible ? "error.main" : "primary.main",
                  "&:hover": {
                    backgroundColor: isVisible
                      ? "rgba(239, 68, 68, 0.1)"
                      : "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                {isVisible ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </IconButton>
            )}
          </Box>
        );
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {renderPhoneDisplay()}

        {showCallButton && canMakeCalls && (
          <Tooltip title={isCalling ? "Initiating call..." : "Click to call"}>
            <IconButton
              size="small"
              onClick={handleCallClick}
              disabled={isCalling}
              sx={{
                p: 0.5,
                color: "success.main",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  transform: "scale(1.1)",
                },
                "&:disabled": {
                  color: "text.disabled",
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {isCalling ? (
                <PhoneIcon fontSize="small" />
              ) : (
                <CallIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        )}

        {!canViewPhone && (
          <Tooltip title="Contact administrator for phone access">
            <SecurityIcon fontSize="small" color="action" />
          </Tooltip>
        )}
      </Box>

      {/* Call Confirmation Dialog */}
      <Dialog
        open={showCallDialog}
        onClose={handleCallCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIcon color="success" />
            Confirm Call
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info" icon={<SecurityIcon />}>
              You are about to call:{" "}
              {/* <strong>{formatPhoneNumber(phoneNumber)}</strong> */}
              {renderPhoneDisplay()}
            </Alert>

            <TextField
              label="Call Reason *"
              value={callReason}
              onChange={(e) => setCallReason(e.target.value)}
              placeholder="e.g., Follow up, Support, Sales call..."
              required
              multiline
              rows={2}
              fullWidth
              // error={
              //   !callReason ||
              //   callReason.trim() === "" ||
              //   (callReason && callReason.trim().length < 3)
              // }
              // helperText={
              //   !callReason || callReason.trim() === ""
              //     ? "Call reason is required"
              //     : callReason && callReason.trim().length < 3
              //     ? "Call reason must be at least 3 characters long"
              //     : `${callReason ? callReason.trim().length : 0}/3+ characters`
              // }
            />

            {/* <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: -1 }}
            >
              * Required field - Call reason helps track call purpose and
              compliance
            </Typography> */}

            <Alert severity="warning">
              This call will be logged for compliance and quality purposes.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCallCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleCallConfirm}
            variant="contained"
            color="success"
            startIcon={<CallIcon />}
          >
            {isCalling ? "Initiating..." : "Make Call"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SecurePhone;
