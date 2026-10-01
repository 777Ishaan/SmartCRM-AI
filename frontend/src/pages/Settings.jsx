import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Settings
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Manage your SmartCRM preferences.
      </Typography>

      <Card elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 3 }}>
        <CardContent>
          <Typography>
            Settings will be built here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;