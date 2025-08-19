import React, { useState } from "react";
import {
  TextField,
  Chip,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useFormContext } from "react-hook-form";

const DSKeywordsInput = ({
  name,
  label,
  fullWidth = true,
  sx,
  defaultValue,
}) => {
  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState("");

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleAddKeyword}
                      color="primary"
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
