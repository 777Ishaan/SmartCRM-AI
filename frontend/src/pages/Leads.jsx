import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../services/leadService";

const emptyLead = {
  name: "",
  company: "",
  email: "",
  phone: "",
  source: "Website",
  status: "New",
  value: "",
  assignedTo: "",
  notes: "",
};

const getStatusColor = (status) => {
  switch (status) {
    case "New":
      return "info";

    case "Contacted":
      return "warning";

    case "Qualified":
      return "success";

    case "Lost":
      return "error";

    case "Converted":
      return "success";

    default:
      return "default";
  }
};

const Leads = () => {
  // =========================================================
  // CURRENT USER / PERMISSIONS
  // =========================================================

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

  const isAdmin = currentUser?.role === "ADMIN";

  // =========================================================
  // LEAD STATE
  // =========================================================

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =========================================================
  // ADD / EDIT
  // =========================================================

  const [openDialog, setOpenDialog] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({
    ...emptyLead,
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================================================
  // THREE DOT MENU
  // =========================================================

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const menuOpen = Boolean(anchorEl);

  // =========================================================
  // VIEW DIALOG
  // =========================================================

  const [viewDialogOpen, setViewDialogOpen] =
    useState(false);

  // =========================================================
  // DELETE
  // =========================================================

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [deleting, setDeleting] = useState(false);

  // =========================================================
  // LOAD LEADS
  // =========================================================

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLeads();

      setLeads(data);
    } catch (err) {
      console.error("Error loading leads:", err);

      setError(
        "Unable to load leads. Make sure Spring Boot and MySQL are running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // OPEN ADD DIALOG
  // =========================================================

  const handleOpenAddDialog = () => {
    setEditingLead(null);
    setFormData({ ...emptyLead });
    setFormError("");
    setOpenDialog(true);
  };

  // =========================================================
  // OPEN EDIT DIALOG
  // =========================================================

  const handleOpenEditDialog = () => {
    if (!selectedLead) return;

    setFormData({
      name: selectedLead.name || "",
      company: selectedLead.company || "",
      email: selectedLead.email || "",
      phone: selectedLead.phone || "",
      source: selectedLead.source || "Website",
      status: selectedLead.status || "New",
      value:
        selectedLead.value !== null &&
        selectedLead.value !== undefined
          ? selectedLead.value
          : "",
      assignedTo: selectedLead.assignedTo || "",
      notes: selectedLead.notes || "",
    });

    setEditingLead(selectedLead);
    setFormError("");
    setOpenDialog(true);

    handleCloseMenu();
  };

  // =========================================================
  // CLOSE ADD / EDIT
  // =========================================================

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    setEditingLead(null);
    setFormData({ ...emptyLead });
    setFormError("");
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  // =========================================================
  // SAVE LEAD
  // =========================================================

  const handleSaveLead = async () => {
    if (!formData.name.trim()) {
      setFormError("Lead name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setFormError("Email is required.");
      return;
    }

    if (!formData.phone.trim()) {
      setFormError("Phone number is required.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const leadData = {
        ...formData,
        value:
          formData.value === ""
            ? null
            : Number(formData.value),
      };

      // UPDATE
      if (editingLead) {
        const updatedLead = await updateLead(
          editingLead.id,
          leadData
        );

        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === editingLead.id
              ? updatedLead
              : lead
          )
        );

        handleCloseDialog();
        return;
      }

      // CREATE
      const createdLead = await createLead(leadData);

      setLeads((prev) => [
        createdLead,
        ...prev,
      ]);

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving lead:", err);

      setFormError(
        "Failed to save lead. Please check your backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // MENU
  // =========================================================

  const handleOpenMenu = (event, lead) => {
    setAnchorEl(event.currentTarget);
    setSelectedLead(lead);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // =========================================================
  // VIEW
  // =========================================================

  const handleViewLead = () => {
    setViewDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedLead(null);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleOpenDeleteDialog = () => {
    // Extra frontend permission protection
    if (!isAdmin) {
      handleCloseMenu();
      return;
    }

    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) return;

    setDeleteDialogOpen(false);
    setSelectedLead(null);
  };

  const handleDeleteLead = async () => {
    // Extra frontend permission protection
    if (!isAdmin) {
      return;
    }

    if (!selectedLead) return;

    try {
      setDeleting(true);

      await deleteLead(selectedLead.id);

      setLeads((prev) =>
        prev.filter(
          (lead) =>
            lead.id !== selectedLead.id
        )
      );

      setDeleteDialogOpen(false);
      setSelectedLead(null);
    } catch (err) {
      console.error("Error deleting lead:", err);

      setError(
        "Failed to delete lead. Please try again."
      );

      setDeleteDialogOpen(false);
      setSelectedLead(null);
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredLeads = leads.filter((lead) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      (lead.name || "")
        .toLowerCase()
        .includes(searchValue) ||
      (lead.company || "")
        .toLowerCase()
        .includes(searchValue) ||
      (lead.email || "")
        .toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box>
      {/* PAGE HEADER */}

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
            Lead Management
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mt: 0.5,
            }}
          >
            Track and manage your potential customers
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            py: 1.1,
            bgcolor: "#111827",
            "&:hover": {
              bgcolor: "#1f2937",
            },
          }}
        >
          Add Lead
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

      {/* SEARCH / FILTER */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #e5e7eb",
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Search leads..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            size="small"
            sx={{
              minWidth: 300,
              flex: 1,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: "#9ca3af",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <FormControl
            size="small"
            sx={{ minWidth: 170 }}
          >
            <InputLabel>Status</InputLabel>

            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <MenuItem value="All">
                All Status
              </MenuItem>

              <MenuItem value="New">
                New
              </MenuItem>

              <MenuItem value="Contacted">
                Contacted
              </MenuItem>

              <MenuItem value="Qualified">
                Qualified
              </MenuItem>

              <MenuItem value="Converted">
                Converted
              </MenuItem>

              <MenuItem value="Lost">
                Lost
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* LEADS TABLE */}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell sx={{ fontWeight: 700 }}>
                Lead
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Company
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Contact
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Source
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Value
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Status
              </TableCell>

              <TableCell
                align="right"
                sx={{ fontWeight: 700 }}
              >
                More
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* LOADING */}

            {loading && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  <Box
                    sx={{
                      py: 6,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <CircularProgress size={30} />

                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280" }}
                    >
                      Loading leads...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {/* DATA */}

            {!loading &&
              filteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  hover
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {lead.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4b5563",
                      }}
                    >
                      {lead.company || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4b5563",
                      }}
                    >
                      {lead.email}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9ca3af",
                      }}
                    >
                      {lead.phone}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4b5563",
                      }}
                    >
                      {lead.source || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {lead.value !== null &&
                      lead.value !== undefined
                        ? `₹${Number(
                            lead.value
                          ).toLocaleString("en-IN")}`
                        : "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={lead.status}
                      color={getStatusColor(
                        lead.status
                      )}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        minWidth: 80,
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(event) =>
                        handleOpenMenu(
                          event,
                          lead
                        )
                      }
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {/* EMPTY */}

            {!loading &&
              filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                  >
                    <Typography
                      sx={{
                        py: 5,
                        color: "#6b7280",
                      }}
                    >
                      No leads found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* THREE DOT MENU */}

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleViewLead}>
          <VisibilityIcon
            fontSize="small"
            sx={{
              mr: 1.5,
              color: "#6b7280",
            }}
          />
          View Details
        </MenuItem>

        <MenuItem onClick={handleOpenEditDialog}>
          <EditIcon
            fontSize="small"
            sx={{
              mr: 1.5,
              color: "#6b7280",
            }}
          />
          Edit Lead
        </MenuItem>

        {/* DELETE ONLY FOR ADMIN */}

        {isAdmin && (
          <>
            <Divider />

            <MenuItem
              onClick={handleOpenDeleteDialog}
              sx={{
                color: "#dc2626",
                "&:hover": {
                  bgcolor: "#fef2f2",
                },
              }}
            >
              <DeleteIcon
                fontSize="small"
                sx={{ mr: 1.5 }}
              />
              Delete Lead
            </MenuItem>
          </>
        )}
      </Menu>

      {/* ADD / EDIT DIALOG */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingLead
            ? "Edit Lead"
            : "Add Lead"}
        </DialogTitle>

        <DialogContent dividers>
          {formError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {formError}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="Lead Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>
                Lead Source
              </InputLabel>

              <Select
                name="source"
                value={formData.source}
                label="Lead Source"
                onChange={handleChange}
              >
                <MenuItem value="Website">
                  Website
                </MenuItem>

                <MenuItem value="Referral">
                  Referral
                </MenuItem>

                <MenuItem value="Social Media">
                  Social Media
                </MenuItem>

                <MenuItem value="Advertisement">
                  Advertisement
                </MenuItem>

                <MenuItem value="Cold Call">
                  Cold Call
                </MenuItem>

                <MenuItem value="Other">
                  Other
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>
                Status
              </InputLabel>

              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="New">
                  New
                </MenuItem>

                <MenuItem value="Contacted">
                  Contacted
                </MenuItem>

                <MenuItem value="Qualified">
                  Qualified
                </MenuItem>

                <MenuItem value="Converted">
                  Converted
                </MenuItem>

                <MenuItem value="Lost">
                  Lost
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Potential Value"
              name="value"
              type="number"
              value={formData.value}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    ₹
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Assigned To"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              sx={{
                gridColumn: "1 / -1",
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={saving}
            sx={{
              textTransform: "none",
              color: "#6b7280",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveLead}
            disabled={saving}
            sx={{
              textTransform: "none",
              bgcolor: "#111827",
              "&:hover": {
                bgcolor: "#1f2937",
              },
            }}
          >
            {saving ? (
              <CircularProgress
                size={22}
                sx={{
                  color: "white",
                }}
              />
            ) : editingLead ? (
              "Save Changes"
            ) : (
              "Add Lead"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* VIEW DETAILS */}

      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Lead Details
        </DialogTitle>

        <DialogContent dividers>
          {selectedLead && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                {selectedLead.name}
              </Typography>

              <Chip
                label={selectedLead.status}
                color={getStatusColor(
                  selectedLead.status
                )}
                size="small"
                sx={{ mb: 3 }}
              />

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
                    Company
                  </Typography>

                  <Typography>
                    {selectedLead.company ||
                      "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Email
                  </Typography>

                  <Typography>
                    {selectedLead.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Phone
                  </Typography>

                  <Typography>
                    {selectedLead.phone}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Source
                  </Typography>

                  <Typography>
                    {selectedLead.source ||
                      "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Potential Value
                  </Typography>

                  <Typography>
                    {selectedLead.value !==
                      null &&
                    selectedLead.value !==
                      undefined
                      ? `₹${Number(
                          selectedLead.value
                        ).toLocaleString(
                          "en-IN"
                        )}`
                      : "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Assigned To
                  </Typography>

                  <Typography>
                    {selectedLead.assignedTo ||
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
                    {selectedLead.notes ||
                      "No notes added."}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseViewDialog}
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

      {/* DELETE CONFIRMATION */}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Delete Lead?
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{ color: "#4b5563" }}
          >
            Are you sure you want to delete{" "}
            <strong>
              {selectedLead?.name}
            </strong>
            ?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#9ca3af",
              mt: 1,
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={deleting}
            sx={{
              textTransform: "none",
              color: "#6b7280",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteLead}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{
              textTransform: "none",
            }}
          >
            {deleting ? (
              <CircularProgress
                size={22}
                sx={{
                  color: "white",
                }}
              />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Leads;