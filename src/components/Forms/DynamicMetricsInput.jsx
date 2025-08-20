import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Grid,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { Controller } from "react-hook-form";

const DynamicMetricsInput = ({
  control,
  name,
  label = "Metrics",
  placeholder = "Add custom metrics",
  error,
  helperText,
  disabled = false,
  defaultValue = {},
}) => {
  const [inputSets, setInputSets] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const addNewInputSet = () => {
    const newSet = {
      id: Date.now() + Math.random(), // Unique ID for each set
      property: "",
      value: "",
    };
    setInputSets((prev) => [...prev, newSet]);
  };

  const removeInputSet = (id) => {
    setInputSets((prev) => prev.filter((set) => set.id !== id));
  };

  const updateInputSet = (id, field, value) => {
    setInputSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, [field]: value } : set))
    );
  };

  const saveInputSet = (id, currentMetrics, onChange) => {
    const set = inputSets.find((s) => s.id === id);
    if (set && set.property.trim() && set.value.trim()) {
      const property = set.property.trim();
      let parsedValue = set.value.trim();

      // Try to parse value as number if possible
      if (!isNaN(set.value) && set.value !== "") {
        parsedValue = set.value.includes(".")
          ? parseFloat(set.value)
          : parseInt(set.value);
      }

      const newMetrics = {
        ...currentMetrics,
        [property]: parsedValue,
      };

      onChange(newMetrics);

      // Remove the input set after saving
      removeInputSet(id);
    }
  };

  const handleDeleteMetric = (key, currentMetrics, onChange) => {
    const newMetrics = { ...currentMetrics };
    delete newMetrics[key];
    onChange(newMetrics);
  };

  const handleEditStart = (key, value) => {
    setEditingKey(key);
    setEditingValue(String(value));
  };

  const handleEditSave = (currentMetrics, onChange) => {
    if (editingKey && editingValue.trim()) {
      let parsedValue = editingValue.trim();
      if (!isNaN(editingValue) && editingValue !== "") {
        parsedValue = editingValue.includes(".")
          ? parseFloat(editingValue)
          : parseInt(editingValue);
      }

      const newMetrics = {
        ...currentMetrics,
        [editingKey]: parsedValue,
      };

      onChange(newMetrics);

      setEditingKey(null);
      setEditingValue("");
    }
  };

  const handleEditCancel = () => {
    setEditingKey(null);
    setEditingValue("");
  };

  const handleEditKeyPress = (e, currentMetrics, onChange) => {
    if (e.key === "Enter") {
      handleEditSave(currentMetrics, onChange);
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const getValueType = (value) => {
    if (typeof value === "number") {
      return value % 1 === 0 ? "integer" : "decimal";
    }
    return typeof value;
  };

  const getValueColor = (value) => {
    if (typeof value === "number") {
      return value % 1 === 0 ? "primary" : "secondary";
    }
    return "default";
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        // Use form value directly, fallback to empty object
        const currentMetrics = value || {};

        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {label}
            </Typography>

            {/* Add Metrics Button */}
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addNewInputSet}
                disabled={disabled}
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                    backgroundColor: "rgba(59, 130, 246, 0.04)",
                  },
                }}
              >
                + Add Metrics
              </Button>
            </Box>

            {/* Dynamic Input Sets */}
            {inputSets.map((set) => (
              <Paper
                key={set.id}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  background: "rgba(59, 130, 246, 0.02)",
                  border: "1px solid rgba(59, 130, 246, 0.1)",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Property name"
                      value={set.property}
                      onChange={(e) =>
                        updateInputSet(set.id, "property", e.target.value)
                      }
                      disabled={disabled}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.875rem",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Value"
                      value={set.value}
                      onChange={(e) =>
                        updateInputSet(set.id, "value", e.target.value)
                      }
                      disabled={disabled}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.875rem",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() =>
                          saveInputSet(set.id, currentMetrics, onChange)
                        }
                        disabled={
                          !set.property.trim() || !set.value.trim() || disabled
                        }
                        sx={{
                          cursor: "pointer",
                          backgroundColor: "darkcyan",
                          "&:hover": {
                            backgroundColor: "success.dark",
                          },
                          fontSize: "0.75rem",
                          color: "white",
                          minWidth: "60px",
                        }}
                      >
                        Save
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => removeInputSet(set.id)}
                        disabled={disabled}
                        sx={{
                          color: "error.main",
                          p: 0.5,
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            {/* Display Existing Metrics */}
            {Object.keys(currentMetrics).length > 0 && (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Current Metrics ({Object.keys(currentMetrics).length})
                </Typography>
                <Grid container spacing={1}>
                  {Object.entries(currentMetrics).map(([key, value]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          background: "rgba(255, 255, 255, 0.8)",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: "#1e293b",
                                mb: 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {key}
                            </Typography>

                            {editingKey === key ? (
                              <TextField
                                fullWidth
                                size="small"
                                value={editingValue}
                                onChange={(e) =>
                                  setEditingValue(e.target.value)
                                }
                                onKeyPress={(e) =>
                                  handleEditKeyPress(
                                    e,
                                    currentMetrics,
                                    onChange
                                  )
                                }
                                autoFocus
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    fontSize: "0.75rem",
                                    height: "32px",
                                  },
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#64748b",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {String(value)}
                                </Typography>
                                <Chip
                                  label={getValueType(value)}
                                  size="small"
                                  color={getValueColor(value)}
                                  variant="outlined"
                                  sx={{
                                    fontSize: "0.625rem",
                                    height: "18px",
                                    minWidth: "auto",
                                    px: 0.5,
                                  }}
                                />
                              </Box>
                            )}
                          </Box>

                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            {editingKey === key ? (
                              <>
                                <Tooltip title="Save">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleEditSave(currentMetrics, onChange)
                                    }
                                    sx={{
                                      color: "success.main",
                                      p: 0.5,
                                    }}
                                  >
                                    <SaveIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel">
                                  <IconButton
                                    size="small"
                                    onClick={handleEditCancel}
                                    sx={{
                                      color: "error.main",
                                      p: 0.5,
                                    }}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditStart(key, value)}
                                    disabled={disabled}
                                    sx={{
                                      color: "info.main",
                                      p: 0.5,
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDeleteMetric(
                                        key,
                                        currentMetrics,
                                        onChange
                                      )
                                    }
                                    disabled={disabled}
                                    sx={{
                                      color: "error.main",
                                      p: 0.5,
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Empty State */}
            {Object.keys(currentMetrics).length === 0 &&
              inputSets.length === 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    background: "rgba(148, 163, 184, 0.05)",
                    border: "1px dashed rgba(148, 163, 184, 0.3)",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No metrics added yet. Click "+ Add Metrics" to get started.
                  </Typography>
                </Paper>
              )}

            {/* Error Display */}
            {error && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, display: "block" }}
              >
                {error.message}
              </Typography>
            )}

            {/* Helper Text */}
            {helperText && !error && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {helperText}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
};

export default DynamicMetricsInput;
