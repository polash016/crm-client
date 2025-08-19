"use client";

import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Stack,
  Chip,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiCalendar,
  FiStar,
} from "react-icons/fi";

const DashboardPage = () => {
  // Mock data for demonstration
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: FiUsers,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: FiShoppingCart,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: "Revenue",
      value: "$45,678",
      change: "+15.3%",
      trend: "up",
      icon: FiDollarSign,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: "-2.1%",
      trend: "down",
      icon: FiTrendingUp,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "placed a new order",
      target: "Product XYZ",
      time: "2 minutes ago",
      avatar: "JD",
      type: "order",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "updated profile",
      target: "Personal Information",
      time: "15 minutes ago",
      avatar: "JS",
      type: "profile",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "created new role",
      target: "Senior Manager",
      time: "1 hour ago",
      avatar: "MJ",
      type: "role",
    },
    {
      id: 4,
      user: "Sarah Wilson",
      action: "completed task",
      target: "Customer Support",
      time: "2 hours ago",
      avatar: "SW",
      type: "task",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "order":
        return <FiShoppingCart size={16} />;
      case "profile":
        return <FiUsers size={16} />;
      case "role":
        return <FiStar size={16} />;
      case "task":
        return <FiActivity size={16} />;
      default:
        return <FiActivity size={16} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "order":
        return "#10b981";
      case "profile":
        return "#3b82f6";
      case "role":
        return "#8b5cf6";
      case "task":
        return "#f59e0b";
      default:
        return "#64748b";
    }
  };
 
  return (
    <Box sx={{ p: 0 }}>
      {/* Welcome Header */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          borderRadius: "20px",
          color: "white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            letterSpacing: "-0.02em",
          }}
        >
          Welcome to Digital Sheba CRM
        </Typography>
        <Typography
          variant="body1"
          sx={{
            opacity: 0.9,
            fontSize: "1.1rem",
            maxWidth: "600px",
          }}
        >
          Manage your customers, track orders, and grow your business with our comprehensive CRM solution.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "16px",
                    background: stat.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <stat.icon size={24} color={stat.color} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: "1.75rem",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: stat.trend === "up" ? "#10b981" : "#ef4444",
                  }}
                >
                  {stat.trend === "up" ? (
                    <FiTrendingUp size={16} />
                  ) : (
                    <FiTrendingDown size={16} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    {stat.change}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                  }}
                >
                  from last month
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
              height: "fit-content",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  mr: 2,
                }}
              >
                <FiActivity size={20} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#1e293b",
                    fontSize: "1.125rem",
                  }}
                >
                  Recent Activities
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.875rem",
                  }}
                >
                  Latest updates from your team
                </Typography>
              </Box>
            </Box>

            <Stack spacing={2}>
              {recentActivities.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.7)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    {activity.avatar}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "#1e293b",
                        fontSize: "0.875rem",
                      }}
                    >
                      <strong>{activity.user}</strong> {activity.action}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontSize: "0.75rem",
                      }}
                    >
                      {activity.target} • {activity.time}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: `${getActivityColor(activity.type)}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: getActivityColor(activity.type),
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Quick Actions & Progress */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Quick Actions */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1e293b",
                  mb: 2,
                  fontSize: "1.125rem",
                }}
              >
                Quick Actions
              </Typography>
              
              <Stack spacing={2}>
                {[
                  { label: "Add New User", icon: FiUsers, color: "#3b82f6" },
                  { label: "Create Role", icon: FiStar, color: "#8b5cf6" },
                  { label: "New Order", icon: FiShoppingCart, color: "#10b981" },
                  { label: "Schedule Meeting", icon: FiCalendar, color: "#f59e0b" },
                ].map((action, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      cursor: "pointer",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.7)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        background: `${action.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: action.color,
                        mr: 2,
                      }}
                    >
                      <action.icon size={18} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "#1e293b",
                        fontSize: "0.875rem",
                      }}
                    >
                      {action.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Progress Overview */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1e293b",
                  mb: 2,
                  fontSize: "1.125rem",
                }}
              >
                Monthly Goals
              </Typography>
              
              <Stack spacing={3}>
                {[
                  { label: "Sales Target", value: 75, color: "#10b981" },
                  { label: "Customer Acquisition", value: 60, color: "#3b82f6" },
                  { label: "Team Performance", value: 85, color: "#8b5cf6" },
                ].map((goal, index) => (
                  <Box key={index}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#64748b",
                          fontSize: "0.875rem",
                        }}
                      >
                        {goal.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: "0.875rem",
                        }}
                      >
                        {goal.value}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={goal.value}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(148, 163, 184, 0.2)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${goal.color} 0%, ${goal.color}80 100%)`,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
