import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const SidebarItems = ({ item }) => {
  // Validate item structure
  if (!item || typeof item !== "object") {
    return null;
  }

  const pathName = usePathname();
  const linkPath = `/${item.path}`;
  const hasChildren =
    item.child && Array.isArray(item.child) && item.child.length > 0;

  const isActive = !hasChildren && pathName === linkPath;
  const isParentActive =
    hasChildren &&
    item.child.some((child) => pathName === `/dashboard/${child.path}`);

  const [open, setOpen] = useState(isParentActive);
  useEffect(() => {
    if (isParentActive) setOpen(true);
  }, [isParentActive]);

  const toggleOpen = () => {
    if (hasChildren) setOpen((prev) => !prev);
  };

  // Safely get title - ensure it's a string
  const itemTitle = typeof item.title === "string" ? item.title : "Menu Item";

  // Safely get icon - ensure it's a valid component
  const ItemIcon =
    item.icon && typeof item.icon === "function" ? item.icon : null;

  return (
    <>
      <ListItem disablePadding sx={{ margin: 0 }}>
        <ListItemButton
          component={!hasChildren ? Link : "div"}
          href={!hasChildren ? linkPath : undefined}
          onClick={toggleOpen}
          sx={{
            position: "relative",
            mx: 0.5,
            my: 0.5,
            minHeight: 48,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background:
              isActive || isParentActive
                ? "linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)"
                : "transparent",
            color:
              isActive || isParentActive
                ? "#ffffff"
                : "rgba(255, 255, 255, 0.85)",
            fontWeight: isActive || isParentActive ? 600 : 500,
            borderLeft:
              isActive || isParentActive
                ? "3px solid #ffffff"
                : "3px solid transparent",
            "& svg": {
              color:
                isActive || isParentActive
                  ? "#ffffff"
                  : "rgba(255, 255, 255, 0.7)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            },
            "&:hover": {
              background:
                isActive || isParentActive
                  ? "linear-gradient(90deg, #7c3aed 0%, #5b21b6 100%)"
                  : "rgba(139, 92, 246, 0.15)",
              color: "#ffffff",
              transform: "translateX(4px)",
              borderLeft: "3px solid #8b5cf6",
              "& svg": {
                color: "#ffffff",
                transform: "scale(1.1)",
              },
            },
            "&:active": {
              transform: "translateX(2px)",
            },
            paddingY: "12px",
            paddingX: "16px",
            zIndex: 2,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {ItemIcon && <ItemIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText
            primary={itemTitle}
            primaryTypographyProps={{
              fontSize: "0.9rem",
              fontWeight: "inherit",
              letterSpacing: "0.025em",
              lineHeight: 1.2,
            }}
          />
          {hasChildren && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 20,
                height: 20,
                background: "rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {open ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              )}
            </Box>
          )}
        </ListItemButton>
      </ListItem>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ ml: 2 }}>
            {item.child.map((child, childIndex) => {
              // Validate child structure
              if (!child || typeof child !== "object") {
                return null;
              }

              const childPath = `/dashboard/${child.path}`;
              const childActive = pathName === childPath;

              // Safely get child title and icon
              const childTitle =
                typeof child.title === "string" ? child.title : "Sub Menu";
              const ChildIcon =
                child.icon && typeof child.icon === "function"
                  ? child.icon
                  : null;

              return (
                <ListItem key={`${childTitle}-${childIndex}`} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={childPath}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      minHeight: 40,
                      pl: 3,
                      py: 1,
                      background: childActive
                        ? "linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)"
                        : "transparent",
                      color: childActive
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.8)",
                      fontWeight: childActive ? 600 : 500,
                      borderLeft: childActive
                        ? "2px solid #ffffff"
                        : "2px solid transparent",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "& svg": {
                        color: childActive
                          ? "#ffffff"
                          : "rgba(255, 255, 255, 0.6)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      },
                      "&:hover": {
                        background: childActive
                          ? "linear-gradient(90deg, #7c3aed 0%, #5b21b6 100%)"
                          : "rgba(139, 92, 246, 0.12)",
                        color: "#ffffff",
                        transform: "translateX(4px)",
                        borderLeft: "2px solid #8b5cf6",
                        "& svg": {
                          color: "#ffffff",
                          transform: "scale(1.1)",
                        },
                      },
                      "&:active": {
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {ChildIcon && <ChildIcon fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={childTitle}
                      primaryTypographyProps={{
                        fontSize: "0.8rem",
                        fontWeight: "inherit",
                        letterSpacing: "0.025em",
                        lineHeight: 1.2,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default SidebarItems;
