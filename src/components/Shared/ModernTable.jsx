import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  LinearProgress,
  useTheme,
  Checkbox,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";

const ModernTable = ({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onMore,
  showActions = true,
  title,
  subtitle,
  emptyMessage = "No data available",
  customActions = false,
  renderActions,
  // Selection props
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onSelectAll,
}) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "success":
      case "completed":
        return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
      case "pending":
      case "warning":
        return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
      case "inactive":
      case "error":
      case "failed":
        return { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" };
      case "processing":
      case "info":
        return { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" };
      default:
        return { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" };
    }
  };

  const formatValue = (value, type) => {
    if (value === null || value === undefined) return "-";

    switch (type) {
      case "status":
        const statusConfig = getStatusColor(value);
        return (
          <Chip
            label={value}
            size="small"
            sx={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              border: `1px solid ${statusConfig.border}`,
              fontWeight: 600,
              fontSize: "0.75rem",
              height: "24px",
            }}
          />
        );
      case "avatar":
        return (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.875rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            }}
          >
            {typeof value === "string" ? value.charAt(0).toUpperCase() : "U"}
          </Avatar>
        );
      case "progress":
        const numValue = parseFloat(value) || 0;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={numValue}
              sx={{
                width: 60,
                height: 6,
                backgroundColor: "rgba(148, 163, 184, 0.2)",
                "& .MuiLinearProgress-bar": {
                  background:
                    "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, minWidth: 30 }}
            >
              {numValue}%
            </Typography>
          </Box>
        );
      case "date":
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      case "number":
        return new Intl.NumberFormat("en-US").format(value);
      default:
        return value;
    }
  };

  const handleSelectRow = (rowId) => {
    if (onSelectionChange && rowId) {
      const newSelection = selectedRows.includes(rowId)
        ? selectedRows.filter((id) => id !== rowId)
        : [...selectedRows, rowId];
      onSelectionChange(newSelection);
    }
  };

  const handleSelectAll = () => {
    if (onSelectAll) {
      if (selectedRows.length === data.length) {
        onSelectAll([]); // Deselect all
      } else {
        const allIds = data
          .map((row, index) => row.id || row._id || index)
          .filter((id) => id !== undefined);
        onSelectAll(allIds); // Select all
      }
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < data.length;

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Loading data...
        </Typography>
      </Box>
    );
  }

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
              {selectable && selectedRows.length > 0 && (
                <span
                  style={{
                    marginLeft: "8px",
                    color: "#3b82f6",
                    fontWeight: 500,
                  }}
                >
                  • {selectedRows.length} selected
                </span>
              )}
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
          "& .MuiTableContainer-root": {
            maxWidth: "100%",
          },
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
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                      sx={{
                        color: "rgba(59, 130, 246, 0.5)",
                        "&.Mui-checked": {
                          color: "#3b82f6",
                        },
                        "&.MuiCheckbox-indeterminate": {
                          color: "#3b82f6",
                        },
                      }}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || "center"}>
                    {column.label}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell
                    align="center"
                    sx={{ width: { xs: 120, sm: 140 } }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (showActions ? 1 : 0) +
                      (selectable ? 1 : 0)
                    }
                    sx={{
                      textAlign: "center",
                      py: 6,
                      color: "#64748b",
                      fontSize: "0.875rem",
                    }}
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    sx={{
                      background:
                        index % 2 === 0
                          ? "rgba(255, 255, 255, 0.5)"
                          : "rgba(248, 250, 252, 0.5)",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.05)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      },
                      // Highlight selected rows
                      ...(selectable &&
                        selectedRows.includes(row.id || row._id || index) && {
                          background: "rgba(59, 130, 246, 0.1)",
                          border: "2px solid rgba(59, 130, 246, 0.3)",
                          "&:hover": {
                            background: "rgba(59, 130, 246, 0.15)",
                          },
                        }),
                      "& td": {
                        borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
                        py: { xs: 1.5, sm: 2 },
                        px: { xs: 1, sm: 2 },
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        color: "#334155",
                        whiteSpace: "nowrap",
                      },
                    }}
                  >
                    {/* Selection checkbox for each row */}
                    {selectable && (
                      <TableCell align="center" sx={{ px: 1 }}>
                        <Checkbox
                          checked={selectedRows.includes(
                            row.id || row._id || index
                          )}
                          onChange={() =>
                            handleSelectRow(row.id || row._id || index)
                          }
                          sx={{
                            color: "rgba(59, 130, 246, 0.5)",
                            "&.Mui-checked": {
                              color: "#3b82f6",
                            },
                          }}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align || "center"}
                      >
                        {typeof column.render === "function"
                          ? column.render(row)
                          : formatValue(row[column.id], column.type)}
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell align="center">
                        {customActions &&
                        typeof renderActions === "function" ? (
                          renderActions(row)
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 0.5,
                            }}
                          >
                            {onView && (
                              <Tooltip title="View">
                                <IconButton
                                  size="small"
                                  onClick={() => onView(row)}
                                  sx={{
                                    background: "rgba(59, 130, 246, 0.1)",
                                    color: "#3b82f6",
                                    "&:hover": {
                                      background: "rgba(59, 130, 246, 0.2)",
                                      transform: "scale(1.1)",
                                    },
                                    transition:
                                      "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                  }}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onEdit && (
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => onEdit(row)}
                                  sx={{
                                    background: "rgba(16, 185, 129, 0.1)",
                                    color: "#10b981",
                                    "&:hover": {
                                      background: "rgba(16, 185, 129, 0.2)",
                                      transform: "scale(1.1)",
                                    },
                                    transition:
                                      "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onDelete && (
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => onDelete(row)}
                                  sx={{
                                    background: "rgba(239, 68, 68, 0.1)",
                                    color: "#ef4444",
                                    "&:hover": {
                                      background: "rgba(239, 68, 68, 0.2)",
                                      transform: "scale(1.1)",
                                    },
                                    transition:
                                      "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onMore && (
                              <Tooltip title="More options">
                                <IconButton
                                  size="small"
                                  onClick={() => onMore(row)}
                                  sx={{
                                    background: "rgba(148, 163, 184, 0.1)",
                                    color: "#64748b",
                                    "&:hover": {
                                      background: "rgba(148, 163, 184, 0.2)",
                                      transform: "scale(1.1)",
                                    },
                                    transition:
                                      "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                  }}
                                >
                                  <MoreIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ModernTable;
