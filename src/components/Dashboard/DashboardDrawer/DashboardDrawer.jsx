"use client";

import React, { useState } from "react";
import {
  Box,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";
import DashboardBar from "../AppBar/DashboardBar";

const drawerWidth = 280;

const DashboardDrawer = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        borderRight: "1px solid rgba(148, 163, 184, 0.2)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)",
        },
      }}
    >
      <Sidebar />
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
            borderRight: "1px solid rgba(148, 163, 184, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
            borderRight: "1px solid rgba(148, 163, 184, 0.2)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100vw - ${drawerWidth}px)` },
          minHeight: "100vh",
          position: "relative",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          ml: { sm: `${drawerWidth}px` },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: "linear-gradient(180deg, rgba(59, 130, 246, 0.03) 0%, transparent 100%)",
            pointerEvents: "none",
          },
        }}
      >
        {/* Content Area */}
        <Box
          sx={{
            pt: { xs: 8, sm: 9 },
            pl: { xs: 1, sm: 2, md: 3 },
            pr: { xs: 1, sm: 2, md: 3 },
            pb: 4,
            minHeight: "100vh",
            position: "relative",
            zIndex: 1,
            width: "100%",
            overflow: "auto",
          }}
        >
          {/* App Bar with Notifications and Profile */}
          <DashboardBar onMenuClick={handleDrawerToggle} />

          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardDrawer;
