import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";

const DSFilesWithPreview = ({ name, label, sx, required, defaultValue }) => {
  const { control } = useFormContext();
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);

  // Initialize previews with defaultValue if available
  useEffect(() => {
    if (
      defaultValue &&
      Array.isArray(defaultValue) &&
      defaultValue.length > 0
    ) {
      // Filter out empty strings and map valid URLs
      const validUrls = defaultValue.filter(
        (url) => url && typeof url === "string" && url.trim() !== ""
      );
      setPreviews(validUrls);
    }
  }, [defaultValue]);

  const handleFilesChange = (event, onChange) => {
    const newFiles = Array.from(event.target.files);
    const newPreviews = newFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    });

    Promise.all(newPreviews).then((results) => {
      // Update both previews and files
      const updatedPreviews = [...previews, ...results];
      const updatedFiles = [...files, ...newFiles];
      setPreviews(updatedPreviews);
      setFiles(updatedFiles);
      // Pass the actual File objects to form
      onChange(updatedFiles);
    });
  };

  const handleRemoveFile = (index, onChange) => {
    const newPreviews = [...previews];
    const newFiles = [...files];
    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);
    setPreviews(newPreviews);
    setFiles(newFiles);
    onChange(newFiles);
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
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
            onChange={(e) => handleFilesChange(e, onChange)}
            accept="image/*"
            multiple
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
              {!previews.length ? (
                <Box textAlign="center" sx={{ color: "#64748b" }}>
                  <div>{label}</div>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    overflowX: "auto",
                    width: "100%",
                    py: 1,
                    px: 1,
                    scrollbarWidth: "thin",
                    scrollbarColor: "#cbd5e1 #f8fafc",
                  }}
                >
                  {previews.map((preview, index) => (
                    <Box
                      key={index}
                      position="relative"
                      sx={{
                        minWidth: 100,
                        width: 100,
                        height: 100,
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        background: "#fff",
                        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100?text=Error";
                        }}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index, onChange);
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
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </label>
        </Box>
      )}
    />
  );
};

export default DSFilesWithPreview;
