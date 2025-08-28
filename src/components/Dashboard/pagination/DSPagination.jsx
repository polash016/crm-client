import React from "react";
import {
  Box,
  Typography,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

const DSPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}) => {
  const handleLimitChange = (event) => {
    const newLimit = Number(event.target.value);
    onLimitChange(newLimit);
  };

  const handlePageChange = (event, page) => {
    onPageChange(page);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, sm: 3 },
        py: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          fontWeight: 500,
        }}
      >
        Showing page{" "}
        <Typography
          component="span"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {currentPage}
        </Typography>{" "}
        of{" "}
        <Typography
          component="span"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {totalPages}
        </Typography>
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          flexWrap: "wrap",
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          variant="outlined"
          shape="rounded"
          size="small"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              minWidth: { xs: "28px", sm: "32px" },
              height: { xs: "28px", sm: "32px" },
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel id="rows-per-page-label" sx={{ fontSize: "0.875rem" }}>
            Rows
          </InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={limit}
            onChange={handleLimitChange}
            label="Rows"
            sx={{
              fontSize: "0.875rem",
              "& .MuiSelect-select": {
                py: 1,
              },
            }}
          >
            {[5, 30, 50, 100, 130, 150, 200].map((number) => (
              <MenuItem
                key={number}
                value={number}
                sx={{ fontSize: "0.875rem" }}
              >
                {number}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default DSPagination;
