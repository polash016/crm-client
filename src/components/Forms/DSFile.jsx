"use client";
import { Typography, Input, Box, FormHelperText } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Controller, useFormContext } from "react-hook-form";

const DSFile = ({
  name,
  label,
  fullWidth,
  sx,
  size = "small",
  type = "file",
  hideInput = false,
  onFileChange, // ✅ accept prop from parent
  required = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Get nested error if any
  const getNestedError = (errors, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], errors);
  };

  const fieldError = getNestedError(errors, name);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, ...field },
        fieldState: { error },
      }) => {
        const handleChange = (e) => {
          const file = e.target.files?.[0];
          onChange(file); // set in react-hook-form
          if (onFileChange) onFileChange(file); // ✅ update preview in parent
        };

        return (
          <div className="space-y-1">
            {!hideInput ? (
              <>
                <Box
                  component="label"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${!!fieldError ? "#d32f2f" : "gray"}`,
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    "&:hover": {
                      borderColor: !!fieldError
                        ? "#d32f2f"
                        : "rgba(0, 0, 0, 0.87)",
                    },
                    ...sx,
                  }}>
                  <CloudUploadIcon
                    sx={{
                      marginRight: "8px",
                      color: !!fieldError ? "#d32f2f" : "inherit",
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{ color: !!fieldError ? "#d32f2f" : "inherit" }}>
                    {label || "Upload File"}
                  </Typography>
                  <Input
                    {...field}
                    required={required}
                    size={size}
                    type={type}
                    onChange={handleChange}
                    sx={{ display: "none" }}
                  />
                </Box>
                {fieldError && (
                  <FormHelperText error sx={{ ml: 1 }}>
                    {fieldError.message}
                  </FormHelperText>
                )}
              </>
            ) : (
              <>
                <Input
                  {...field}
                  size={size}
                  type={type}
                  hidden
                  onChange={handleChange}
                  sx={{ display: "none" }}
                />
                {fieldError && (
                  <FormHelperText error sx={{ mt: 2 }}>
                    {fieldError.message}
                  </FormHelperText>
                )}
              </>
            )}
          </div>
        );
      }}
    />
  );
};

export default DSFile;
