import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { getCurrentUser, isAdmin } from "../utils/auth";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Customers", icon: <PeopleIcon />, path: "/customers" },
  { text: "Leads", icon: <TrendingUpIcon />, path: "/leads" },
  { text: "Activities", icon: <EventNoteIcon />, path: "/activities" },
  { text: "Calendar", icon: <CalendarMonthIcon />, path: "/calendar" },
  { text: "Documents", icon: <DescriptionIcon />, path: "/documents" },
  { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
  {
    text: "AI Copilot",
    icon: <AutoAwesomeIcon />,
    path: "/ai-copilot",
    ai: true,
  },
];

const NavItem = ({ item }) => (
  <NavLink
    to={item.path}
    end={item.path === "/"}
    style={{
      textDecoration: "none",
      color: "inherit",
    }}
  >
    {({ isActive }) => {
      const textColor = isActive
        ? "#ffffff"
        : item.ai
        ? "#c084fc"
        : "#d1d5db";

      return (
        <ListItemButton
          sx={{
            borderRadius: 2,
            mb: 0.5,
            color: textColor,
            bgcolor: isActive ? "#1f2937" : "transparent",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "#1f2937",
              color: "#ffffff",
              transform: "translateX(2px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: "inherit",
            }}
          >
            {item.icon}
          </ListItemIcon>

          <ListItemText
            primary={item.text}
            slotProps={{
              primary: {
                sx: {
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                },
              },
            }}
          />
        </ListItemButton>
      );
    }}
  </NavLink>
);

export default function Sidebar() {
  const currentUser = getCurrentUser();
  const admin = isAdmin();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        bgcolor: "#111827",
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: "1px solid #1f2937",
        zIndex: 1200,
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          SmartCRM
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#9ca3af",
          }}
        >
          AI-Powered CRM
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "#1f2937",
        }}
      />

      {/* Navigation */}
      <List
        component="nav"
        sx={{
          px: 1.5,
          py: 2,
          flex: 1,
          overflowY: "auto",
        }}
      >
        {menuItems.map((item) => (
          <NavItem
            key={item.text}
            item={item}
          />
        ))}

        {/* ADMIN ONLY */}
        {admin && (
          <NavItem
            item={{
              text: "Users",
              icon: <ManageAccountsIcon />,
              path: "/users",
            }}
          />
        )}
      </List>

      <Divider
        sx={{
          borderColor: "#1f2937",
          mb: 1.5,
        }}
      />

      {/* Bottom */}
      <Box
        sx={{
          px: 1.5,
          pb: 2,
        }}
      >
        <NavItem
          item={{
            text: "Settings",
            icon: <SettingsIcon />,
            path: "/settings",
          }}
        />

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#d1d5db",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "#1f2937",
              color: "#ffffff",
              transform: "translateX(2px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: "inherit",
            }}
          >
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            slotProps={{
              primary: {
                sx: {
                  fontSize: 14,
                },
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}