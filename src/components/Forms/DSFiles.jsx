"use client";
import { FormControl, SxProps, Typography, Box, Input } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Controller, useFormContext } from "react-hook-form";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const DSFiles = ({
  name,
  label,
  fullWidth = true,
  sx,
  size = "small",
  type = "file",
  required = false,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, ...field },
        fieldState: { error },
      }) => (
        <Box
          component="label"
          sx={{
            ...sx,
            // display: "inline-flex",
            // alignItems: "center",
            // justifyContent: "center",
            // border: "1px solid gray",
            // width: "100%",
            // padding: "8px",
            // borderRadius: "4px",
            // cursor: "pointer",
            // transition: "border-color 0.2s",
            // "&:hover": {
            //   borderColor: "rgba(0, 0, 0, 0.87)",
            // },
          }}>
          <CloudUploadIcon sx={{ marginRight: "8px" }} />
          <Typography variant="h6" component="span">
            {label || "Upload File"}
          </Typography>
          <VisuallyHiddenInput
            {...field}
            type={type}
            required={required}
            multiple // Allows multiple file selection
            onChange={(e) => {
              const files = e.target.files;
              onChange(files ? Array.from(files) : []);
            }}
          />
        </Box>
      )}
    />
  );
};

export default DSFiles;
