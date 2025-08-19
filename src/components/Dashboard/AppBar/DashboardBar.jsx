"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyProfileQuery } from "@/redux/api/userApi";

const DashboardBar = ({ onMenuClick }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { data: profileData } = useGetMyProfileQuery();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 280px)` },
        ml: { sm: "280px" },
        background: "linear-gradient(90deg, #1e293b 0%, #334155 100%)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 50%, #3b82f6 100%)",
        },
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            display: { sm: "none" },
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            "&:hover": {
              background: "rgba(59, 130, 246, 0.2)",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.95)",
              fontSize: "1.1rem",
              letterSpacing: "0.5px",
            }}
          >
            Welcome back, {profileData?.data?.name?.split(" ")[0] || user?.name?.split(" ")[0] || "User"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(148, 163, 184, 0.8)",
              fontSize: "0.8rem",
              fontWeight: 400,
              mt: 0.5,
            }}
          >
            Here's what's happening with your CRM today
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            color="inherit"
            sx={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              "&:hover": {
                background: "rgba(59, 130, 246, 0.2)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            onClick={handleMenu}
            size="small"
            sx={{
              ml: 1,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              border: "2px solid rgba(255, 255, 255, 0.1)",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: "0.9rem",
                fontWeight: 600,
                background: "transparent",
              }}
            >
              {profileData?.data?.name?.charAt(0)?.toUpperCase() || 
               user?.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              background: "rgba(30, 41, 59, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              mt: 1,
              minWidth: 200,
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
              background: "rgba(59, 130, 246, 0.05)",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "rgba(255, 255, 255, 0.95)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              {profileData?.data?.name || user?.name || "User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(148, 163, 184, 0.8)",
                fontSize: "0.75rem",
                display: "block",
                mt: 0.5,
              }}
            >
              {profileData?.data?.email || user?.email || "user@example.com"}
            </Typography>
          </Box>

          <MenuItem
            onClick={handleClose}
            sx={{
              py: 1.5,
              px: 2,
              color: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                background: "rgba(59, 130, 246, 0.1)",
                color: "#ffffff",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Profile
            </Typography>
          </MenuItem>

          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 2,
              color: "rgba(239, 68, 68, 0.9)",
              "&:hover": {
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Log Out
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardBar;
