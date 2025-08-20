"use client";
import getNestedError from "@/utils/getNestedError";
import { MenuItem, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const DSSelect = ({
  name,
  label,
  fullWidth,
  sx,
  options,
  size = "small",
  onChange,
  defaultValue,
  disabled = false,
  isLoading = false,
  isError = false,
  placeholder,
}) => {
  const {
    control,
    formState: { errors },
    trigger, // Add trigger
  } = useFormContext();

  // Direct error access for nested fields
  // const getNestedError = (errors, path) => {
  //   const fields = path.split(".");
  //   return fields.reduce((acc, field) => acc?.[field], errors);
  // };

  const fieldError = getNestedError(errors, name);
  console.log({ errors, fieldError });
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue || ""}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth={fullWidth}
          sx={{
            ...sx,
            "& .MuiOutlinedInput-root": {
              fontSize: "0.95rem",
              fontWeight: 500,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              borderRadius: "12px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(148, 163, 184, 0.3)",
                borderWidth: "1px",
                borderRadius: "12px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8b5cf6",
                borderWidth: "2px",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8b5cf6",
                borderWidth: "2px",
              },
            },
            "& .MuiInputLabel-root": {
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#64748b",
              "&.Mui-focused": {
                color: "#8b5cf6",
                fontWeight: 600,
              },
            },
            "& .MuiFormHelperText-root": {
              fontSize: "0.75rem",
              fontWeight: 500,
              marginLeft: 0,
              marginTop: 1,
            },
            "& .MuiSelect-select": {
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "#475569",
              transition: "color 0.2s ease",
              py: 2,
            },
          }}
          error={!!fieldError}
          select
          label={label}
          disabled={disabled || isLoading}
          placeholder={placeholder}
          size={size}
          value={field.value || ""}
          helperText={fieldError?.message}
          onChange={async (e) => {
            field.onChange(e);
            // Trigger validation immediately after change
            await trigger(name);
            if (onChange) onChange(e.target.value);
          }}
          onBlur={async () => {
            field.onBlur();
            // Also trigger validation on blur
            await trigger(name);
          }}
        >
          <MenuItem value="">{/* <em>{label}</em> */}</MenuItem>
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name || option}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default DSSelect;
