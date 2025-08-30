import React, { useState } from "react";
import {
  TextField,
  Chip,
  Box,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useFormContext } from "react-hook-form";
import getNestedError from "@/utils/getNestedError";

const DSKeywordsInput = ({
  name,
  label,
  fullWidth = true,
  sx,
  defaultValue,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [inputValue, setInputValue] = useState("");

  const error = getNestedError(errors, name);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        validate: (value) => {
          // Custom validation for keywords array
          if (!value || !Array.isArray(value)) {
            return true; // Let required validation handle empty arrays
          }
          if (value.length === 0) {
            return true; // Let required validation handle this
          }
          // Check for empty strings in the array
          if (value.some((item) => !item || item.trim() === "")) {
            return "Keywords cannot be empty";
          }
          return true;
        },
      }}
      render={({ field: { onChange, value } }) => {
        const keywords = value || [];

        const handleAddKeyword = () => {
          if (inputValue.trim() !== "") {
            const newKeywords = [...keywords, inputValue.trim()];
            onChange(newKeywords);
            setInputValue("");
          }
        };

        const handleDeleteKeyword = (keywordToDelete) => {
          const newKeywords = keywords.filter(
            (keyword) => keyword !== keywordToDelete
          );
          onChange(newKeywords);
        };

        const handleKeyDown = (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleAddKeyword();
          }
        };

        return (
          <Box sx={sx}>
            <TextField
              fullWidth={fullWidth}
              label={label}
              variant="outlined"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              error={!!error}
              helperText={error?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.95rem",
                  fontWeight: 500,
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
                  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#f44336",
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
                  "&.Mui-error": {
                    color: "#f44336",
                  },
                },
                "& .MuiFormHelperText-root": {
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  marginLeft: 0,
                  marginTop: 1,
                  color: "#f44336",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleAddKeyword}
                      color="primary"
                      disabled={!!error}
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
              {keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleDeleteKeyword(keyword)}
                  sx={{
                    "& .MuiChip-deleteIcon": {
                      color: "rgba(0, 0, 0, 0.26)",
                      "&:hover": {
                        color: "rgba(0, 0, 0, 0.4)",
                      },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default DSKeywordsInput;
