import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getCustomersForActivity,
  getLeadsForActivity,
} from "../services/activityService";

const emptyForm = {
  title: "",
  type: "Task",
  status: "Pending",
  priority: "Medium",
  dueDate: "",
  customerId: "",
  leadId: "",
  notes: "",
};

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        activitiesData,
        customersData,
        leadsData,
      ] = await Promise.all([
        getActivities(),
        getCustomersForActivity(),
        getLeadsForActivity(),
      ]);

      setActivities(activitiesData);
      setCustomers(customersData);
      setLeads(leadsData);
    } catch (error) {
      console.error("Failed to load activities data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpenForm(true);
  };

  const handleEdit = (activity) => {
    setForm({
      title: activity.title || "",
      type: activity.type || "Task",
      status: activity.status || "Pending",
      priority: activity.priority || "Medium",
      dueDate: activity.dueDate
        ? activity.dueDate.substring(0, 16)
        : "",
      customerId: activity.customerId
        ? String(activity.customerId)
        : "",
      leadId: activity.leadId
        ? String(activity.leadId)
        : "",
      notes: activity.notes || "",
    });

    setEditingId(activity.id);
    setOpenForm(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("Please enter an activity title.");
      return;
    }

    const activityData = {
      title: form.title,
      type: form.type,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate
        ? `${form.dueDate}:00`
        : null,
      customerId: form.customerId
        ? Number(form.customerId)
        : null,
      leadId: form.leadId
        ? Number(form.leadId)
        : null,
      notes: form.notes,
    };

    try {
      if (editingId) {
        await updateActivity(editingId, activityData);
      } else {
        await createActivity(activityData);
      }

      setOpenForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadData();
    } catch (error) {
      console.error("Failed to save activity:", error);
      alert("Failed to save activity.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmed) return;

    try {
      await deleteActivity(id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete activity:", error);
      alert("Failed to delete activity.");
    }
  };

  const handleView = (activity) => {
    setSelectedActivity(activity);
    setOpenView(true);
  };

  const getCustomerName = (customerId, fallbackName) => {
    if (!customerId) return fallbackName || "—";

    const customer = customers.find(
      (item) => item.id === Number(customerId)
    );

    return customer?.name || fallbackName || "—";
  };

  const getLeadName = (leadId, fallbackName) => {
    if (!leadId) return fallbackName || "—";

    const lead = leads.find(
      (item) => item.id === Number(leadId)
    );

    return lead?.name || fallbackName || "—";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";

      case "Cancelled":
        return "error";

      case "Scheduled":
        return "info";

      default:
        return "warning";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";

      case "Low":
        return "success";

      default:
        return "warning";
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      activity.title?.toLowerCase().includes(searchText) ||
      activity.customerName?.toLowerCase().includes(searchText) ||
      activity.leadName?.toLowerCase().includes(searchText) ||
      activity.notes?.toLowerCase().includes(searchText);

    const matchesType =
      !typeFilter || activity.type === typeFilter;

    const matchesStatus =
      !statusFilter || activity.status === statusFilter;

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus
    );
  });

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <Box>
      {/* Header */}
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
            variant="h4"
            fontWeight={700}
          >
            Activities
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage tasks, calls, meetings and emails.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Activity
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search activities..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>

                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) =>
                    setTypeFilter(e.target.value)
                  }
                >
                  <MenuItem value="">
                    All Types
                  </MenuItem>

                  <MenuItem value="Task">
                    Task
                  </MenuItem>

                  <MenuItem value="Call">
                    Call
                  </MenuItem>

                  <MenuItem value="Meeting">
                    Meeting
                  </MenuItem>

                  <MenuItem value="Email">
                    Email
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>

                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  <MenuItem value="">
                    All Statuses
                  </MenuItem>

                  <MenuItem value="Pending">
                    Pending
                  </MenuItem>

                  <MenuItem value="Scheduled">
                    Scheduled
                  </MenuItem>

                  <MenuItem value="Completed">
                    Completed
                  </MenuItem>

                  <MenuItem value="Cancelled">
                    Cancelled
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Activities */}
      <Grid container spacing={3}>
        {filteredActivities.map((activity) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={activity.id}
          >
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {activity.title}
                  </Typography>

                  <Chip
                    label={activity.type}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={activity.status}
                    color={getStatusColor(
                      activity.status
                    )}
                    size="small"
                    sx={{ mr: 1 }}
                  />

                  <Chip
                    label={activity.priority}
                    color={getPriorityColor(
                      activity.priority
                    )}
                    size="small"
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Due: {formatDate(activity.dueDate)}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 0.5 }}
                >
                  <strong>Customer:</strong>{" "}
                  {getCustomerName(
                    activity.customerId,
                    activity.customerName
                  )}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 2 }}
                >
                  <strong>Lead:</strong>{" "}
                  {getLeadName(
                    activity.leadId,
                    activity.leadName
                  )}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  <IconButton
                    color="info"
                    onClick={() =>
                      handleView(activity)
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleEdit(activity)
                    }
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDelete(activity.id)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {filteredActivities.length === 0 && (
          <Grid item xs={12}>
            <Card
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <Typography color="text.secondary">
                No activities found.
              </Typography>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Add / Edit Dialog */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingId
            ? "Edit Activity"
            : "Add Activity"}
        </DialogTitle>

        <DialogContent>
          <Grid
            container
            spacing={2}
            sx={{ mt: 0.5 }}
          >
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Activity Title"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>

                <Select
                  name="type"
                  value={form.type}
                  label="Type"
                  onChange={handleChange}
                >
                  <MenuItem value="Task">
                    Task
                  </MenuItem>

                  <MenuItem value="Call">
                    Call
                  </MenuItem>

                  <MenuItem value="Meeting">
                    Meeting
                  </MenuItem>

                  <MenuItem value="Email">
                    Email
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>

                <Select
                  name="status"
                  value={form.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="Pending">
                    Pending
                  </MenuItem>

                  <MenuItem value="Scheduled">
                    Scheduled
                  </MenuItem>

                  <MenuItem value="Completed">
                    Completed
                  </MenuItem>

                  <MenuItem value="Cancelled">
                    Cancelled
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>

                <Select
                  name="priority"
                  value={form.priority}
                  label="Priority"
                  onChange={handleChange}
                >
                  <MenuItem value="High">
                    High
                  </MenuItem>

                  <MenuItem value="Medium">
                    Medium
                  </MenuItem>

                  <MenuItem value="Low">
                    Low
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date & Time"
                type="datetime-local"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Customer Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>
                  Customer
                </InputLabel>

                <Select
                  name="customerId"
                  value={form.customerId}
                  label="Customer"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    No Customer
                  </MenuItem>

                  {customers.map((customer) => (
                    <MenuItem
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Lead Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>
                  Lead
                </InputLabel>

                <Select
                  name="leadId"
                  value={form.leadId}
                  label="Lead"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    No Lead
                  </MenuItem>

                  {leads.map((lead) => (
                    <MenuItem
                      key={lead.id}
                      value={lead.id}
                    >
                      {lead.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpenForm(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Activity Details
        </DialogTitle>

        <DialogContent>
          {selectedActivity && (
            <Box sx={{ pt: 1 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 2 }}
              >
                {selectedActivity.title}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Type:</strong>{" "}
                {selectedActivity.type}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Status:</strong>{" "}
                {selectedActivity.status}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Priority:</strong>{" "}
                {selectedActivity.priority}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Due:</strong>{" "}
                {formatDate(
                  selectedActivity.dueDate
                )}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Customer:</strong>{" "}
                {getCustomerName(
                  selectedActivity.customerId,
                  selectedActivity.customerName
                )}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Lead:</strong>{" "}
                {getLeadName(
                  selectedActivity.leadId,
                  selectedActivity.leadName
                )}
              </Typography>

              <Typography sx={{ mt: 2 }}>
                <strong>Notes:</strong>
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {selectedActivity.notes ||
                  "No notes added."}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenView(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Activities;