import React from "react";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
} from "@mui/material";

const Topbar = () => {
  const storedUser = localStorage.getItem("user");

  let currentUser = null;

  try {
    currentUser = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Unable to read logged-in user:",
      error
    );
  }

  const userName = currentUser?.name || "User";

  const userRole = currentUser?.role
    ? currentUser.role
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        )
    : "User";

  // Get first letter of user's name for avatar
  const avatarLetter = userName
    .charAt(0)
    .toUpperCase();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        ml: "250px",
        width: "calc(100% - 250px)",
        bgcolor: "#ffffff",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "70px !important",
          display: "flex",
          justifyContent: "flex-end",
          px: 4,
        }}
      >
        {/* USER INFORMATION */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              textAlign: "right",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.3,
              }}
            >
              {userName}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "#6b7280",
                lineHeight: 1.3,
              }}
            >
              {userRole}
            </Typography>
          </Box>

          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#111827",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {avatarLetter}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;