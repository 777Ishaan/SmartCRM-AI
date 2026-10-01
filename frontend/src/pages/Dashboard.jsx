import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Chip,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { getDashboardStats } from "../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await getDashboardStats();

      setStats(data);
      setError("");
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          title: "Total Customers",
          value: stats.totalCustomers,
          icon: <PeopleIcon />,
          subtitle: "Customers in CRM",
        },
        {
          title: "Total Leads",
          value: stats.totalLeads,
          icon: <TrendingUpIcon />,
          subtitle: "Active leads",
        },
        {
          title: "Pipeline Value",
          value: `₹${Number(
            stats.pipelineValue || 0
          ).toLocaleString("en-IN")}`,
          icon: <AttachMoneyIcon />,
          subtitle: "Total potential value",
        },
        {
          title: "Pending Activities",
          value: stats.pendingActivities,
          icon: <PendingActionsIcon />,
          subtitle: "Activities pending",
        },
        {
          title: "Completed Activities",
          value: stats.completedActivities,
          icon: <CheckCircleIcon />,
          subtitle: "Activities completed",
        },
      ]
    : [];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {/* =========================
          HEADER
          ========================= */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#111827",
            mb: 0.5,
            fontSize: {
              xs: "1.8rem",
              sm: "2.125rem",
            },
          }}
        >
          Dashboard
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#6b7280",
          }}
        >
          Welcome back, Ishaan. Here's what's happening with your CRM.
        </Typography>
      </Box>

      {/* =========================
          LOADING
          ========================= */}

      {loading && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* =========================
          ERROR
          ========================= */}

      {!loading && error && (
        <Card
          elevation={0}
          sx={{
            width: "100%",
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography color="error">
            {error}
          </Typography>
        </Card>
      )}

      {/* =========================
          DASHBOARD CONTENT
          ========================= */}

      {!loading && stats && (
        <>
          {/* =========================
              STATISTICS
              ========================= */}

          <Grid
            container
            spacing={2}
            sx={{
              width: "100%",
              mb: 3,
            }}
          >
            {statCards.map((card) => (
              <Grid
                key={card.title}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 2.4,
                }}
                sx={{
                  minWidth: 0,
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    width: "100%",
                    height: "100%",
                    minWidth: 0,
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    boxShadow:
                      "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      "&:last-child": {
                        pb: 3,
                      },
                    }}
                  >
                    {/* Icon + Live */}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          flexShrink: 0,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#eef2ff",
                          color: "#4f46e5",
                        }}
                      >
                        {card.icon}
                      </Box>

                      <Chip
                        label="Live"
                        size="small"
                        sx={{
                          fontSize: "11px",
                          fontWeight: 600,
                          height: 24,
                        }}
                      />
                    </Box>

                    {/* Title */}

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6b7280",
                        mb: 0.5,
                      }}
                    >
                      {card.title}
                    </Typography>

                    {/* Value */}

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#111827",
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {card.value}
                    </Typography>

                    {/* Subtitle */}

                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9ca3af",
                      }}
                    >
                      {card.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* =========================
              CRM OVERVIEW + ACTIVITIES
              ========================= */}

          <Grid
            container
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            {/* CRM OVERVIEW */}

            <Grid
              size={{
                xs: 12,
                md: 8,
              }}
              sx={{
                minWidth: 0,
              }}
            >
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  height: "100%",
                  minWidth: 0,
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    CRM Overview
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      mb: 3,
                    }}
                  >
                    Current CRM activity at a glance.
                  </Typography>

                  <Box
                    sx={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, minmax(0, 1fr))",
                      },
                      gap: 2,
                    }}
                  >
                    {/* Customers */}

                    <Box
                      sx={{
                        minWidth: 0,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={0.5}
                      >
                        Customers
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight={700}
                      >
                        {stats.totalCustomers}
                      </Typography>
                    </Box>

                    {/* Leads */}

                    <Box
                      sx={{
                        minWidth: 0,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={0.5}
                      >
                        Leads
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight={700}
                      >
                        {stats.totalLeads}
                      </Typography>
                    </Box>

                    {/* Pipeline */}

                    <Box
                      sx={{
                        minWidth: 0,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={0.5}
                      >
                        Pipeline
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ₹
                        {Number(
                          stats.pipelineValue || 0
                        ).toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* ACTIVITIES */}

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
              sx={{
                minWidth: 0,
              }}
            >
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  height: "100%",
                  minWidth: 0,
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Activities
                  </Typography>

                  {/* Pending */}

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={0.5}
                    >
                      Pending
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={700}
                    >
                      {stats.pendingActivities}
                    </Typography>
                  </Box>

                  {/* Completed */}

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={0.5}
                    >
                      Completed
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={700}
                    >
                      {stats.completedActivities}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;