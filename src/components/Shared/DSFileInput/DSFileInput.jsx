"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { Upload } from "@mui/icons-material";
import { FiFileText } from "react-icons/fi";

const DSFileInput = ({
  name,
  label,
  description,
  accept,
  multiple = false,
  disabled = false,
  required = false,
  sx = {},
  buttonText = "Choose file or drag and drop",
  showFileInfo = true,
  helperText,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const fieldError = errors[name];

  const handleFileChange = (event, onChange) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onChange(multiple ? Array.from(files) : files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, onChange) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      onChange(multiple ? Array.from(files) : files[0]);
    }
  };

  const getFileDisplayName = (value) => {
    if (!value) return buttonText;

    if (multiple && Array.isArray(value)) {
      if (value.length === 1) return value[0].name;
      return `${value.length} files selected`;
    }

    return value.name;
  };

  const getFileSize = (file) => {
    if (file.size < 1024) return `${file.size} B`;
    if (file.size < 1024 * 1024) return `${(file.size / 1024).toFixed(1)} KB`;
    return `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Box sx={sx}>
          {label && (
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {label}
              {required && <span style={{ color: "error.main" }}> *</span>}
            </Typography>
          )}

          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>
          )}

          <input
            accept={accept}
            style={{ display: "none" }}
            id={`file-input-${name}`}
            type="file"
            multiple={multiple}
            onChange={(event) => handleFileChange(event, onChange)}
            disabled={disabled}
          />

          <label htmlFor={`file-input-${name}`}>
            <Button
              variant="outlined"
              component="span"
              startIcon={<Upload />}
              disabled={disabled}
              sx={{
                width: "100%",
                py: 2,
                borderStyle: "dashed",
                borderWidth: 2,
                "&:hover": {
                  borderStyle: "solid",
                  borderColor: "primary.main",
                },
                cursor: disabled ? "not-allowed" : "pointer",
              }}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, onChange)}
            >
              {getFileDisplayName(value)}
            </Button>
          </label>

          {/* File Information */}
          {showFileInfo && value && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "success.50", borderRadius: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <FiFileText color="success" size={16} />
                <Typography
                  variant="caption"
                  color="success.main"
                  fontWeight={500}
                >
                  File selected
                </Typography>
              </Box>

              {multiple && Array.isArray(value) ? (
                value.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {file.name} ({getFileSize(file)})
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="caption" color="text.secondary">
                  {value.name} ({getFileSize(value)})
                </Typography>
              )}
            </Box>
          )}

          {/* Error Message */}
          {fieldError && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: "block" }}
            >
              {fieldError.message}
            </Typography>
          )}

          {/* Helper Text */}
          {helperText && !fieldError && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              {helperText}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};

export default DSFileInput;
