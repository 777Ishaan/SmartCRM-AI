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
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customerService";

const emptyCustomer = {
  name: "",
  company: "",
  email: "",
  phone: "",
  status: "Regular",
  notes: "",
};

const getStatusColor = (status) => {
  switch (status) {
    case "VIP":
      return "success";
    case "Lead":
      return "warning";
    case "Regular":
      return "default";
    default:
      return "default";
  }
};

const Customers = () => {
  // =============================
  // CURRENT USER / ROLE
  // =============================

  const storedUser = localStorage.getItem("user");

  let currentUser = null;

  try {
    currentUser = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error("Unable to read logged-in user:", error);
  }

  const isAdmin = currentUser?.role === "ADMIN";

  // =============================
  // CUSTOMER STATE
  // =============================

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =============================
  // SEARCH / FILTER
  // =============================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =============================
  // ADD / EDIT
  // =============================

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ ...emptyCustomer });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // =============================
  // THREE DOT MENU
  // =============================

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const menuOpen = Boolean(anchorEl);

  // =============================
  // VIEW DIALOG
  // =============================

  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // =============================
  // DELETE
  // =============================

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // =============================
  // LOAD CUSTOMERS FROM MYSQL
  // =============================

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomers();

      setCustomers(data);
    } catch (err) {
      console.error("Error loading customers:", err);

      setError(
        "Unable to load customers. Make sure Spring Boot and MySQL are running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ADD CUSTOMER DIALOG
  // =============================

  const handleOpenAddDialog = () => {
    setEditingCustomer(null);
    setFormData({ ...emptyCustomer });
    setFormError("");
    setOpenDialog(true);
  };

  // =============================
  // EDIT CUSTOMER
  // =============================

  const handleOpenEditDialog = () => {
    if (!selectedCustomer) return;

    setFormData({
      name: selectedCustomer.name || "",
      company: selectedCustomer.company || "",
      email: selectedCustomer.email || "",
      phone: selectedCustomer.phone || "",
      status: selectedCustomer.status || "Regular",
      notes: selectedCustomer.notes || "",
    });

    setEditingCustomer(selectedCustomer);
    setFormError("");
    setOpenDialog(true);

    handleCloseMenu();
  };

  // =============================
  // CLOSE ADD / EDIT
  // =============================

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    setEditingCustomer(null);
    setFormData({ ...emptyCustomer });
    setFormError("");
  };

  // =============================
  // FORM CHANGE
  // =============================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  // =============================
  // SAVE CUSTOMER
  // =============================

  const handleSaveCustomer = async () => {
    if (!formData.name.trim()) {
      setFormError("Customer name is required.");
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

      // EDIT CUSTOMER
      if (editingCustomer) {
        const updatedCustomer = await updateCustomer(
          editingCustomer.id,
          formData
        );

        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === editingCustomer.id
              ? updatedCustomer
              : customer
          )
        );

        handleCloseDialog();
        return;
      }

      // CREATE CUSTOMER
      const createdCustomer = await createCustomer(formData);

      setCustomers((prev) => [
        createdCustomer,
        ...prev,
      ]);

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving customer:", err);

      setFormError(
        "Failed to save customer. Please check your backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // =============================
  // THREE DOT MENU
  // =============================

  const handleOpenMenu = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // =============================
  // VIEW CUSTOMER
  // =============================

  const handleViewCustomer = () => {
    setViewDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedCustomer(null);
  };

  // =============================
  // DELETE CUSTOMER
  // ADMIN ONLY
  // =============================

  const handleOpenDeleteDialog = () => {
    // Extra frontend protection
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
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = async () => {
    // Extra frontend protection
    if (!isAdmin) {
      return;
    }

    if (!selectedCustomer) return;

    try {
      setDeleting(true);

      await deleteCustomer(selectedCustomer.id);

      setCustomers((prev) =>
        prev.filter(
          (customer) =>
            customer.id !== selectedCustomer.id
        )
      );

      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
    } catch (err) {
      console.error("Error deleting customer:", err);

      setError(
        "You do not have permission to delete this customer."
      );

      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
    } finally {
      setDeleting(false);
    }
  };

  // =============================
  // SEARCH + FILTER
  // =============================

  const filteredCustomers = customers.filter(
    (customer) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        (customer.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        (customer.company || "")
          .toLowerCase()
          .includes(searchValue) ||
        (customer.email || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  // =============================
  // UI
  // =============================

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
            Customer Management
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mt: 0.5,
            }}
          >
            Manage your customers and customer information
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
          Add Customer
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
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            sx={{ minWidth: 160 }}
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

              <MenuItem value="VIP">
                VIP
              </MenuItem>

              <MenuItem value="Regular">
                Regular
              </MenuItem>

              <MenuItem value="Lead">
                Lead
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* CUSTOMER TABLE */}

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
            <TableRow
              sx={{
                bgcolor: "#f9fafb",
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>
                Customer
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Company
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Contact
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Phone
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
                  colSpan={6}
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
                      sx={{
                        color: "#6b7280",
                      }}
                    >
                      Loading customers...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {/* CUSTOMER ROWS */}

            {!loading &&
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
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
                      {customer.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4b5563",
                      }}
                    >
                      {customer.company || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4b5563",
                      }}
                    >
                      {customer.email}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4b5563",
                      }}
                    >
                      {customer.phone}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={customer.status}
                      color={getStatusColor(
                        customer.status
                      )}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        minWidth: 75,
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(event) =>
                        handleOpenMenu(
                          event,
                          customer
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
              filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                  >
                    <Typography
                      sx={{
                        py: 5,
                        color: "#6b7280",
                      }}
                    >
                      No customers found.
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
        <MenuItem onClick={handleViewCustomer}>
          <VisibilityIcon
            fontSize="small"
            sx={{
              mr: 1.5,
              color: "#6b7280",
            }}
          />

          View Details
        </MenuItem>

        <MenuItem
          onClick={handleOpenEditDialog}
        >
          <EditIcon
            fontSize="small"
            sx={{
              mr: 1.5,
              color: "#6b7280",
            }}
          />

          Edit Customer
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

              Delete Customer
            </MenuItem>
          </>
        )}
      </Menu>

      {/* ADD / EDIT DIALOG */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ fontWeight: 700 }}
        >
          {editingCustomer
            ? "Edit Customer"
            : "Add Customer"}
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
              label="Full Name"
              name="name"
              value={formData.name}
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

            <TextField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>

              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="VIP">
                  VIP
                </MenuItem>

                <MenuItem value="Regular">
                  Regular
                </MenuItem>

                <MenuItem value="Lead">
                  Lead
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
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
            onClick={handleSaveCustomer}
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
            ) : editingCustomer ? (
              "Save Changes"
            ) : (
              "Add Customer"
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
        <DialogTitle
          sx={{ fontWeight: 700 }}
        >
          Customer Details
        </DialogTitle>

        <DialogContent dividers>
          {selectedCustomer && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                {selectedCustomer.name}
              </Typography>

              <Chip
                label={selectedCustomer.status}
                color={getStatusColor(
                  selectedCustomer.status
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
                    {selectedCustomer.company || "-"}
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
                    {selectedCustomer.email}
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
                    {selectedCustomer.phone}
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
                    {selectedCustomer.notes ||
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
        <DialogTitle
          sx={{ fontWeight: 700 }}
        >
          Delete Customer?
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{ color: "#4b5563" }}
          >
            Are you sure you want to delete{" "}
            <strong>
              {selectedCustomer?.name}
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
            onClick={handleDeleteCustomer}
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

export default Customers;