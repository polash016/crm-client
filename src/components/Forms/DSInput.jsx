"use client";
import getNestedError from "@/utils/getNestedError";
import { SxProps, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const DSInput = ({
  name,
  label,
  type = "text",
  size = "medium",
  fullWidth,
  defaultValue,
  sx,
  placeholder,
  multiline = false,
  rows = 1,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = getNestedError(errors, name);

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      rules={{
        valueAsNumber: type === "number",
        setValueAs: (value) => {
          if (type === "number") {
            if (value === "" || value === null || value === undefined) {
              return undefined;
            }
            const num = Number(value);
            return Number.isNaN(num) ? undefined : num;
          }
          return value;
        },
      }}
      render={({ field }) => (
        <TextField
          {...field}
          sx={{
            ...sx,
            position: "relative",
            "& .MuiOutlinedInput-root": {
              fontSize: "0.95rem",
              fontWeight: 500,
              position: "relative",
              // backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
          }}
          type={type}
          variant="outlined"
          size={size}
          fullWidth={fullWidth}
          placeholder={placeholder}
          label={label}
          error={!!error}
          helperText={error?.message}
          multiline={multiline}
          rows={rows}
          onBlur={() => {
            field.onBlur();
          }}
          inputProps={
            type === "number"
              ? { inputMode: "numeric", step: "any" }
              : undefined
          }
        />
      )}
    />
  );
};

export default DSInput;
