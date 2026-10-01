import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { getAnalytics } from "../services/api";

const COLORS = [
  "#1976d2",
  "#9c27b0",
  "#2e7d32",
  "#ed6c02",
  "#757575",
  "#d32f2f",
];

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 3,
  height: "100%",
  width: "100%",
};

const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <Card elevation={0} sx={cardStyle}>
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={1}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "1.8rem",
                  sm: "2rem",
                },
              }}
            >
              {value}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mt={1}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(25, 118, 210, 0.08)",
              color: "primary.main",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAnalytics();

        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load analytics:", err);

        setError(
          "Unable to load analytics data. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Analytics
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Analyze customers, leads, activities and pipeline.
        </Typography>

        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  if (!analytics) {
    return null;
  }

  const leadSources = analytics.leadSources || [];
  const leadStatuses = analytics.leadStatuses || [];
  const pipelineByStatus =
    analytics.pipelineByStatus || [];

  const customerStatuses =
    analytics.customerStatuses || [];

  const activityTypes =
    analytics.activityTypes || [];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* =========================
          PAGE HEADER
      ========================= */}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            fontSize: {
              xs: "1.8rem",
              sm: "2.125rem",
            },
          }}
        >
          Analytics
        </Typography>

        <Typography color="text.secondary" mt={0.5}>
          Analyze customers, leads, activities and pipeline.
        </Typography>
      </Box>

      {/* =========================
          KPI CARDS
      ========================= */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Customers"
            value={analytics.totalCustomers}
            subtitle="Customers in CRM"
            icon={<PeopleIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Leads"
            value={analytics.totalLeads}
            subtitle="Leads in CRM"
            icon={<TrendingUpIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pipeline Value"
            value={formatCurrency(
              analytics.pipelineValue
            )}
            subtitle="Based on lead value"
            icon={<AttachMoneyIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Completed Activities"
            value={analytics.completedActivities}
            subtitle={`${analytics.pendingActivities} pending`}
            icon={<CheckCircleIcon />}
          />
        </Grid>
      </Grid>

      {/* =========================
          LEAD ANALYTICS
      ========================= */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        {/* Lead Sources */}

        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Lead Sources
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  height: 320,
                  minWidth: 0,
                }}
              >
                {leadSources.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={leadSources}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={90}
                        label
                      >
                        {leadSources.map(
                          (entry, index) => (
                            <Cell
                              key={`source-${index}`}
                              fill={
                                COLORS[
                                  index %
                                    COLORS.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      No lead source data available.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Lead Status */}

        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
              >
                Lead Status
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  height: 320,
                  minWidth: 0,
                }}
              >
                {leadStatuses.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={leadStatuses}
                      margin={{
                        top: 5,
                        right: 20,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis dataKey="name" />

                      <YAxis allowDecimals={false} />

                      <Tooltip />

                      <Bar
                        dataKey="value"
                        fill="#1976d2"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      No lead status data available.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* =========================
          CUSTOMER + ACTIVITY
      ========================= */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        {/* Customer Segmentation */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Customer Segmentation
                </Typography>

                <Chip
                  label="Customers"
                  size="small"
                  variant="outlined"
                />
              </Stack>

              <Box
                sx={{
                  width: "100%",
                  height: 320,
                  minWidth: 0,
                }}
              >
                {customerStatuses.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={customerStatuses}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={95}
                        label
                      >
                        {customerStatuses.map(
                          (entry, index) => (
                            <Cell
                              key={`customer-${index}`}
                              fill={
                                COLORS[
                                  index %
                                    COLORS.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      No customer status data available.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Breakdown */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Activity Breakdown
                </Typography>

                <Chip
                  label="Activity Types"
                  size="small"
                  variant="outlined"
                />
              </Stack>

              <Box
                sx={{
                  width: "100%",
                  height: 320,
                  minWidth: 0,
                }}
              >
                {activityTypes.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={activityTypes}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis dataKey="name" />

                      <YAxis allowDecimals={false} />

                      <Tooltip />

                      <Bar
                        dataKey="value"
                        fill="#9c27b0"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      No activity type data available.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* =========================
          PIPELINE
      ========================= */}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Card elevation={0} sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Pipeline by Lead Status
                </Typography>

                <Chip
                  label="Current"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Box
                sx={{
                  width: "100%",
                  height: 340,
                  minWidth: 0,
                }}
              >
                {pipelineByStatus.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={pipelineByStatus}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        type="number"
                        tickFormatter={(value) =>
                          `₹${Number(
                            value
                          ).toLocaleString("en-IN")}`
                        }
                      />

                      <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                      />

                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(value)
                        }
                      />

                      <Bar
                        dataKey="value"
                        fill="#2e7d32"
                        radius={[
                          0,
                          6,
                          6,
                          0,
                        ]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      No pipeline data available.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;