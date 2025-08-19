import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";

const DSFileWithPreview = ({ name, label, sx, required, defaultValue }) => {
  const { control } = useFormContext();
  const [preview, setPreview] = useState(null);

  // Initialize preview with defaultValue if available
  useEffect(() => {
    if (
      defaultValue &&
      typeof defaultValue === "string" &&
      defaultValue.trim() !== ""
    ) {
      setPreview(defaultValue);
    }
  }, [defaultValue]);

  const handleFileChange = (event, onChange) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const handleRemoveFile = (onChange) => {
    setPreview(null);
    onChange(null);
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ...field } }) => (
        <Box
          sx={{
            ...sx,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            background: "#f8fafc",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
            minHeight: 120,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <input
            type="file"
            id={name}
            onChange={(e) => handleFileChange(e, onChange)}
            accept="image/*"
            style={{ display: "none" }}
            {...field}
          />
          <label htmlFor={name} style={{ width: "100%", height: "100%" }}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                minHeight: 120,
              }}
            >
              {!preview ? (
                <Box textAlign="center" sx={{ color: "#64748b" }}>
                  <div>{label}</div>
                  <div className="text-xs text-gray-400">Size (800 x 800)</div>
                </Box>
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 180,
                    borderRadius: 12,
                    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)",
                    background: "#fff",
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/180?text=Error";
                  }}
                />
              )}
            </Box>
          </label>
          {preview && (
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFile(onChange);
              }}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "#ef4444",
                color: "#fff",
                boxShadow: 2,
                zIndex: 2,
                "&:hover": { background: "#dc2626" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    />
  );
};

export default DSFileWithPreview;
