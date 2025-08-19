import React from "react";
import List from "@mui/material/List";
import { Box, Stack, Typography, Divider } from "@mui/material";
import { drawerItems } from "@/utils/drawerItems";
import SidebarItems from "./SidebarItems";
import { getUserInfo } from "@/services/auth.service";
import { useGetUserByIdQuery } from "@/redux/api/userApi";
import { useAuth } from "@/hooks/useAuth";
import SidebarSkeleton from "@/components/Shared/SidebarSkeleton";
import logo from "@/assets/ds_logo.png";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const user = getUserInfo();
  const { data, isLoading, isError } = useGetUserByIdQuery({ id: user?.id });
  const { updateUser } = useAuth();

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  // Safely extract user data and ensure it's valid
  const userData = data?.data;
  
  // Safely extract permissions and ensure it's an array
  const permissions = userData?.permissions;
  const permissionsArray = Array.isArray(permissions) ? permissions : [];
  
  // Safely extract user name and role
  const userName = typeof userData?.name === 'string' ? userData.name : 'User';
  const userRole = typeof userData?.userType === 'string' ? userData.userType : 'Employee';
  
  // Get first character of name safely
  const userInitial = userName.charAt(0).toUpperCase();
  
  // Update user data safely
  if (userData) {
    updateUser(userData);
  }

  console.log("User data:", userData);
  console.log("Permissions array:", permissionsArray);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        px: 0,
        py: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        background: "linear-gradient(180deg,rgb(17, 44, 87) 0%,rgb(36, 65, 107) 30%,rgb(30, 61, 104) 70%,rgb(7, 22, 43) 100%)",
        borderRight: "1px solid rgba(148, 163, 184, 0.2)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.4) 50%, transparent 100%)",
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
          position: "relative",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              background: "rgba(59, 130, 246, 0.1)",
              p: 2,
              border: "1px solid rgba(59, 130, 246, 0.2)",
              boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 30px rgba(59, 130, 246, 0.25)",
                background: "rgba(59, 130, 246, 0.15)",
              },
            }}
          >
            <Image 
              src={logo} 
              alt="Digital Sheba Logo" 
              width={200} 
              height={0}
              style={{
                filter: "brightness(1.1) contrast(1.1)",
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(203, 213, 225, 0.9)",
              fontWeight: 600,
              letterSpacing: "1px",
              textAlign: "center",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              paddingTop: "10px",
            }}
          >
            CRM Dashboard
          </Typography>
        </Link>
      </Box>

      {/* User Info Section */}
      {userData && (
        <Box
          sx={{
            mx: 2,
            mb: 3,
            p: 2.5,
            background: "rgba(59, 130, 246, 0.08)",
            border: "1px solid rgba(59, 130, 246, 0.15)",
            borderLeft: "3px solid #3b82f6",
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
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 42,
                height: 42,
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "1.1rem",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {userInitial}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.95)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(203, 213, 225, 0.8)",
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                  fontWeight: 500,
                }}
              >
                {userRole}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      <Divider 
        sx={{ 
          mx: 2, 
          mb: 2, 
          borderColor: "rgba(203, 213, 225, 0.2)",
          opacity: 0.6,
        }} 
      />

      {/* Navigation Items */}
      <List 
        sx={{ 
          zIndex: 2,
          flex: 1,
          px: 1,
        }}
      >
        {(() => {
          const items = drawerItems(permissionsArray);
          console.log("Generated drawer items:", items);
          
          return items.map((item, index) => {
            console.log(`Rendering item ${index}:`, item);
            return <SidebarItems key={index} item={item} />;
          });
        })()}
      </List>

      {/* Footer Section */}
      <Box
        sx={{
          mt: "auto",
          p: 2,
          textAlign: "center",
          borderTop: "1px solid rgba(148, 163, 184, 0.1)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "rgba(203, 213, 225, 0.7)",
            fontSize: "0.7rem",
            letterSpacing: "0.5px",
            fontWeight: 500,
          }}
        >
          Digital Sheba CRM
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "rgba(203, 213, 225, 0.5)",
            fontSize: "0.65rem",
            mt: 0.5,
            fontWeight: 400,
          }}
        >
          v2.0.0
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
