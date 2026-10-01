import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";

import { getCalendarActivities } from "../services/calendarService";

const Calendar = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const [selectedActivity, setSelectedActivity] =
    useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  // LOAD ACTIVITIES
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCalendarActivities();

      setActivities(data);
    } catch (err) {
      console.error(
        "Error loading calendar activities:",
        err
      );

      setError(
        "Unable to load calendar activities. Make sure Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // MONTH INFORMATION
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString(
    "en-IN",
    {
      month: "long",
    }
  );

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  // CREATE CALENDAR CELLS
  const calendarDays = useMemo(() => {
    const days = [];

    // Empty cells before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDay, daysInMonth]);

  // CHANGE MONTH
  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  // TODAY
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // GET ACTIVITIES FOR DAY
  const getActivitiesForDay = (day) => {
    if (!day) return [];

    return activities.filter((activity) => {
      if (!activity.dueDate) return false;

      const date = new Date(activity.dueDate);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    });
  };

  // CHECK TODAY
  const isToday = (day) => {
    if (!day) return false;

    const today = new Date();

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  // FORMAT TIME
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // ACTIVITY COLOR
  const getActivityColor = (type) => {
    switch (type) {
      case "Meeting":
        return "#2563eb";

      case "Call":
        return "#16a34a";

      case "Email":
        return "#9333ea";

      case "Task":
        return "#ea580c";

      default:
        return "#6b7280";
    }
  };

  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Calendar
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mt: 0.5,
            }}
          >
            View your CRM activities and appointments
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<TodayIcon />}
          onClick={handleToday}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Today
        </Button>
      </Box>

      {/* ERROR */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* CALENDAR HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <IconButton
            onClick={handlePreviousMonth}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {monthName} {year}
          </Typography>

          <IconButton
            onClick={handleNextMonth}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* LOADING */}
        {loading ? (
          <Box
            sx={{
              minHeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress />

            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
              }}
            >
              Loading calendar...
            </Typography>
          </Box>
        ) : (
          <>
            {/* WEEK DAYS */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(7, 1fr)",
                bgcolor: "#f9fafb",
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <Box
                  key={day}
                  sx={{
                    p: 1.5,
                    textAlign: "center",
                    borderRight:
                      "1px solid #e5e7eb",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "#6b7280",
                    }}
                  >
                    {day.substring(0, 3)}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* CALENDAR GRID */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(7, 1fr)",
              }}
            >
              {calendarDays.map(
                (day, index) => {
                  const dayActivities =
                    getActivitiesForDay(
                      day
                    );

                  return (
                    <Box
                      key={index}
                      sx={{
                        minHeight: 125,
                        p: 1,
                        borderRight:
                          "1px solid #e5e7eb",
                        borderBottom:
                          "1px solid #e5e7eb",
                        bgcolor:
                          day === null
                            ? "#fafafa"
                            : "#ffffff",
                      }}
                    >
                      {day && (
                        <>
                          {/* DAY NUMBER */}
                          <Box
                            sx={{
                              display:
                                "flex",
                              justifyContent:
                                "flex-end",
                              mb: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                borderRadius:
                                  "50%",
                                bgcolor:
                                  isToday(
                                    day
                                  )
                                    ? "#111827"
                                    : "transparent",
                                color:
                                  isToday(
                                    day
                                  )
                                    ? "#ffffff"
                                    : "#374151",
                                fontWeight:
                                  isToday(
                                    day
                                  )
                                    ? 700
                                    : 500,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight:
                                    "inherit",
                                  color:
                                    "inherit",
                                }}
                              >
                                {day}
                              </Typography>
                            </Box>
                          </Box>

                          {/* ACTIVITIES */}
                          <Box
                            sx={{
                              display:
                                "flex",
                              flexDirection:
                                "column",
                              gap: 0.5,
                            }}
                          >
                            {dayActivities
                              .slice(0, 3)
                              .map(
                                (
                                  activity
                                ) => (
                                  <Box
                                    key={
                                      activity.id
                                    }
                                    onClick={() => {
                                      setSelectedActivity(
                                        activity
                                      );
                                      setDialogOpen(
                                        true
                                      );
                                    }}
                                    sx={{
                                      px: 0.8,
                                      py: 0.5,
                                      borderRadius: 1,
                                      bgcolor: `${getActivityColor(
                                        activity.type
                                      )}15`,
                                      borderLeft: `3px solid ${getActivityColor(
                                        activity.type
                                      )}`,
                                      cursor:
                                        "pointer",
                                      overflow:
                                        "hidden",
                                      "&:hover":
                                        {
                                          bgcolor: `${getActivityColor(
                                            activity.type
                                          )}25`,
                                        },
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display:
                                          "block",
                                        fontWeight:
                                          700,
                                        color:
                                          "#111827",
                                        whiteSpace:
                                          "nowrap",
                                        overflow:
                                          "hidden",
                                        textOverflow:
                                          "ellipsis",
                                      }}
                                    >
                                      {
                                        activity.title
                                      }
                                    </Typography>

                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color:
                                          "#6b7280",
                                        fontSize:
                                          10,
                                      }}
                                    >
                                      {formatTime(
                                        activity.dueDate
                                      )}
                                    </Typography>
                                  </Box>
                                )
                              )}

                            {dayActivities.length >
                              3 && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color:
                                    "#6b7280",
                                  pl: 0.5,
                                  cursor:
                                    "pointer",
                                }}
                              >
                                +
                                {dayActivities.length -
                                  3}{" "}
                                more
                              </Typography>
                            )}
                          </Box>
                        </>
                      )}
                    </Box>
                  );
                }
              )}
            </Box>
          </>
        )}
      </Paper>

      {/* ACTIVITY DETAILS */}
      <Dialog
        open={dialogOpen}
        onClose={() =>
          setDialogOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Activity Details
        </DialogTitle>

        <DialogContent dividers>
          {selectedActivity && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {
                  selectedActivity.title
                }
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 3,
                }}
              >
                <Chip
                  label={
                    selectedActivity.type
                  }
                  size="small"
                  variant="outlined"
                />

                <Chip
                  label={
                    selectedActivity.status
                  }
                  size="small"
                />

                <Chip
                  label={
                    selectedActivity.priority
                  }
                  size="small"
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Date & Time
                  </Typography>

                  <Typography>
                    {selectedActivity.dueDate
                      ? new Date(
                          selectedActivity.dueDate
                        ).toLocaleString(
                          "en-IN",
                          {
                            dateStyle:
                              "full",
                            timeStyle:
                              "short",
                          }
                        )
                      : "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Customer
                  </Typography>

                  <Typography>
                    {selectedActivity.customerName ||
                      "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Lead
                  </Typography>

                  <Typography>
                    {selectedActivity.leadName ||
                      "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Notes
                  </Typography>

                  <Typography>
                    {selectedActivity.notes ||
                      "No notes added."}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() =>
              setDialogOpen(false)
            }
            variant="contained"
            sx={{
              textTransform: "none",
              bgcolor: "#111827",
              "&:hover": {
                bgcolor: "#1f2937",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;