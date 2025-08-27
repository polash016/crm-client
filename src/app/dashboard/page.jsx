"use client";

import React from "react";
import { Box, Typography, Card, CardContent, Stack, Chip } from "@mui/material";
import { FiClock, FiCode, FiSettings, FiUsers } from "react-icons/fi";
import { Rocket } from "@mui/icons-material";

const DashboardPage = () => {
  const features = [
    {
      icon: FiCode,
      title: "Advanced Analytics",
      description: "Deep insights into your business performance",
      color: "#3b82f6",
    },
    {
      icon: FiUsers,
      title: "Customer Management",
      description: "Comprehensive customer relationship tools",
      color: "#10b981",
    },
    {
      icon: FiSettings,
      title: "Automation",
      description: "Streamline your business processes",
      color: "#8b5cf6",
    },
    {
      icon: Rocket,
      title: "Performance",
      description: "Lightning-fast operations and reporting",
      color: "#f59e0b",
    },
  ];

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
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
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
          Manage your customers, track orders, and grow your business with our
          comprehensive CRM solution.
        </Typography>
      </Box>

      {/* Development Ongoing Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
          px: 3,
        }}
      >
        <Box sx={{ maxWidth: 800, width: "100%", textAlign: "center" }}>
          {/* Main Development Card */}
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
              borderRadius: "24px",
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background:
                  "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)",
              },
            }}
          >
            <CardContent sx={{ p: 6 }}>
              {/* Animated Icon */}
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 3rem",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "140%",
                    height: "140%",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    opacity: 0.2,
                    animation: "pulse 2s infinite",
                  },
                }}
              >
                <FiCode size={50} color="white" />
              </Box>

              {/* Main Title */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                  mb: 2,
                  letterSpacing: "-0.02em",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                🚀 Development Ongoing
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "#64748b",
                  mb: 4,
                  fontWeight: 400,
                  fontSize: "1.125rem",
                  maxWidth: "600px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                We're working hard to bring you an amazing CRM experience.
                Exciting new features are on the way!
              </Typography>

              {/* Status Badge */}
              <Box sx={{ mb: 4 }}>
                <Chip
                  icon={<FiClock size={16} />}
                  label="Coming Soon"
                  sx={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    px: 2,
                    py: 1,
                    "& .MuiChip-icon": {
                      color: "white",
                    },
                  }}
                />
              </Box>

              {/* Feature Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  mb: 4,
                }}
              >
                {features.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 3,
                      background: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
                        background: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        background: `${feature.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: feature.color,
                        mb: 2,
                      }}
                    >
                      <feature.icon size={24} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#1e293b",
                        mb: 1,
                        fontSize: "1rem",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748b",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Progress Indicator */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    mb: 2,
                    fontWeight: 500,
                  }}
                >
                  Development Progress
                </Typography>
                <Box
                  sx={{
                    height: 8,
                    backgroundColor: "rgba(148, 163, 184, 0.2)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: "75%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)",
                      borderRadius: 4,
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        animation: "shimmer 2s infinite",
                      },
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    mt: 1,
                    display: "block",
                    fontSize: "0.75rem",
                  }}
                >
                  75% Complete • Expected Launch: Soon
                </Typography>
              </Box>

              {/* Footer Message */}
              <Typography
                variant="body2"
                sx={{
                  color: "#94a3b8",
                  fontStyle: "italic",
                  fontSize: "0.875rem",
                }}
              >
                Thank you for your patience! We're building something amazing
                just for you.
              </Typography>
            </CardContent>
          </Card>

          {/* Floating Elements for Visual Appeal */}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "5%",
              width: 20,
              height: 20,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              borderRadius: "50%",
              opacity: 0.6,
              animation: "float 3s ease-in-out infinite",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "20%",
              right: "8%",
              width: 15,
              height: 15,
              background: "linear-gradient(135deg, #10b981, #3b82f6)",
              borderRadius: "50%",
              opacity: 0.5,
              animation: "float 4s ease-in-out infinite reverse",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "15%",
              left: "10%",
              width: 25,
              height: 25,
              background: "linear-gradient(135deg, #f59e0b, #10b981)",
              borderRadius: "50%",
              opacity: 0.4,
              animation: "float 5s ease-in-out infinite",
            }}
          />
        </Box>
      </Box>

      {/* Custom CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
      `}</style>
    </Box>
  );
};

export default DashboardPage;
