"use client";
import React from "react";
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const TableSkeleton = ({
  rowCount = 5,
  columns = [],
  title,
  subtitle,
  showActions = true,
  selectable = false,
}) => {
  // Calculate total columns for colSpan
  const totalColumns =
    columns.length + (showActions ? 1 : 0) + (selectable ? 1 : 0);

  return (
    <Box
      sx={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        position: "relative",
        width: "100%",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background:
            "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 50%, #3b82f6 100%)",
        },
      }}
    >
      {/* Table Header */}
      {(title || subtitle) && (
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
            background: "rgba(59, 130, 246, 0.02)",
          }}
        >
          {title && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
                fontSize: { xs: "1rem", sm: "1.125rem" },
                mb: subtitle ? 0.5 : 0,
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Table Content */}
      <Box
        sx={{
          overflow: "auto",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <TableContainer
          sx={{
            minWidth: { xs: 600, sm: "auto" },
            maxWidth: "100%",
            mx: 0,
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)",
                  "& th": {
                    borderBottom: "2px solid rgba(148, 163, 184, 0.2)",
                    background: "transparent",
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 1, sm: 2 },
                    whiteSpace: "nowrap",
                  },
                }}
              >
                {/* Selection checkbox column */}
                {selectable && (
                  <TableCell
                    align="center"
                    sx={{
                      width: 50,
                      px: 1,
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={20}
                      height={20}
                      sx={{
                        backgroundColor: "rgba(148, 163, 184, 0.3)",
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                )}
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id || index}
                    align={column.align || "center"}
                  >
                    <Skeleton
                      variant="text"
                      width={
                        column.label?.length ? column.label.length * 8 : 60
                      }
                      height={20}
                      sx={{
                        backgroundColor: "rgba(148, 163, 184, 0.3)",
                      }}
                    />
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell
                    align="center"
                    sx={{ width: { xs: 120, sm: 140 } }}
                  >
                    <Skeleton
                      variant="text"
                      width={60}
                      height={20}
                      sx={{
                        backgroundColor: "rgba(148, 163, 184, 0.3)",
                      }}
                    />
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(rowCount)].map((_, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  sx={{
                    background:
                      rowIndex % 2 === 0
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(248, 250, 252, 0.5)",
                    "& td": {
                      borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 1, sm: 2 },
                    },
                  }}
                >
                  {/* Selection checkbox */}
                  {selectable && (
                    <TableCell align="center" sx={{ px: 1 }}>
                      <Skeleton
                        variant="rectangular"
                        width={20}
                        height={20}
                        sx={{
                          backgroundColor: "rgba(148, 163, 184, 0.2)",
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                  )}

                  {/* Column cells */}
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={column.id || colIndex}
                      align={column.align || "center"}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        {/* Avatar/Icon placeholder */}
                        {(column.id === "leadInfo" ||
                          column.id === "userInfo" ||
                          column.id === "profile" ||
                          column.label?.toLowerCase().includes("name")) && (
                          <Skeleton
                            variant="circular"
                            width={32}
                            height={32}
                            sx={{
                              backgroundColor: "rgba(148, 163, 184, 0.2)",
                            }}
                          />
                        )}

                        {/* Text content */}
                        <Box sx={{ flex: 1 }}>
                          <Skeleton
                            variant="text"
                            width={colIndex % 2 === 0 ? "80%" : "60%"}
                            height={20}
                            sx={{
                              backgroundColor: "rgba(148, 163, 184, 0.2)",
                              mb: 0.5,
                            }}
                          />
                          {colIndex % 3 === 0 && (
                            <Skeleton
                              variant="text"
                              width="40%"
                              height={16}
                              sx={{
                                backgroundColor: "rgba(148, 163, 184, 0.15)",
                              }}
                            />
                          )}
                        </Box>

                        {/* Status chips for certain columns */}
                        {(column.id === "status" ||
                          column.id === "priority" ||
                          column.id === "role") && (
                          <Skeleton
                            variant="rectangular"
                            width={60}
                            height={24}
                            sx={{
                              backgroundColor: "rgba(148, 163, 184, 0.2)",
                              borderRadius: 12,
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>
                  ))}

                  {/* Actions column */}
                  {showActions && (
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 0.5,
                        }}
                      >
                        <Skeleton
                          variant="circular"
                          width={32}
                          height={32}
                          sx={{
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                          }}
                        />
                        <Skeleton
                          variant="circular"
                          width={32}
                          height={32}
                          sx={{
                            backgroundColor: "rgba(16, 185, 129, 0.2)",
                          }}
                        />
                        {rowIndex % 2 === 0 && (
                          <Skeleton
                            variant="circular"
                            width={32}
                            height={32}
                            sx={{
                              backgroundColor: "rgba(239, 68, 68, 0.2)",
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default TableSkeleton;
