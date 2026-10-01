import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  Chip,
  InputAdornment,
  Alert,
} from "@mui/material";

import {
  Add,
  Edit,
  Delete,
  Search,
  PersonAdd,
} from "@mui/icons-material";

import {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} from "../services/userService";

const roles = [
  "ADMIN",
  "SALES_MANAGER",
  "SALES_REPRESENTATIVE",
];

const emptyUser = {
  name: "",
  email: "",
  password: "",
  role: "SALES_REPRESENTATIVE",
  enabled: true,
};

const Users = () => {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState(emptyUser);

  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setForm(emptyUser);
    setError("");
    setOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      enabled: user.enabled,
    });

    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    setForm(emptyUser);
    setError("");
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {

    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!editingUser && !form.password.trim()) {
      setError("Password is required.");
      return;
    }

    try {

      if (editingUser) {

        await updateUser(
          editingUser.id,
          form
        );

      } else {

        await createUser(form);

      }

      await loadUsers();
      handleClose();

    } catch (err) {

      console.error(err);

      if (typeof err.response?.data === "string") {
        setError(err.response.data);
      } else {
        setError("Unable to save user.");
      }
    }
  };

  const handleToggleStatus = async (user) => {

    try {

      await updateUserStatus(
        user.id,
        !user.enabled
      );

      await loadUsers();

    } catch (err) {

      console.error(err);
      setError("Unable to update user status.");
    }
  };

  const handleDelete = async (user) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {

      await deleteUser(user.id);
      await loadUsers();

    } catch (err) {

      console.error(err);
      setError("Unable to delete user.");
    }
  };

  const filteredUsers = users.filter((user) => {

    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText)
    );
  });

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
            Users
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage SmartCRM users and permissions
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={handleOpenAdd}
        >
          Add User
        </Button>

      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Search */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
        }}
      >

        <TextField
          fullWidth
          placeholder="Search users by name, email or role..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

      </Paper>

      {/* User List */}
      <Paper
        sx={{
          overflow: "hidden",
        }}
      >

        {filteredUsers.map((user) => (

          <Box
            key={user.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2.5,
              borderBottom: "1px solid #e5e7eb",
            }}
          >

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >

              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  bgcolor: "#e8eefc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: "#2563eb",
                }}
              >
                {user.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </Box>

              <Box>

                <Typography
                  fontWeight={600}
                >
                  {user.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {user.email}
                </Typography>

              </Box>

            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >

              <Chip
                label={user.role}
                size="small"
                variant="outlined"
              />

              <Chip
                label={
                  user.enabled
                    ? "Active"
                    : "Disabled"
                }
                size="small"
                color={
                  user.enabled
                    ? "success"
                    : "default"
                }
              />

              <Button
                size="small"
                onClick={() =>
                  handleToggleStatus(user)
                }
              >
                {user.enabled
                  ? "Disable"
                  : "Enable"}
              </Button>

              <IconButton
                color="primary"
                onClick={() =>
                  handleOpenEdit(user)
                }
              >
                <Edit />
              </IconButton>

              <IconButton
                color="error"
                onClick={() =>
                  handleDelete(user)
                }
              >
                <Delete />
              </IconButton>

            </Box>

          </Box>

        ))}

        {filteredUsers.length === 0 && (
          <Box
            sx={{
              p: 5,
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">
              No users found.
            </Typography>
          </Box>
        )}

      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          {editingUser
            ? "Edit User"
            : "Add User"}
        </DialogTitle>

        <DialogContent>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, mt: 1 }}
            >
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Full Name"
            value={form.name}
            onChange={(e) =>
              handleChange(
                "name",
                e.target.value
              )
            }
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              handleChange(
                "email",
                e.target.value
              )
            }
            margin="normal"
          />

          <TextField
            fullWidth
            label={
              editingUser
                ? "New Password (optional)"
                : "Password"
            }
            type="password"
            value={form.password}
            onChange={(e) =>
              handleChange(
                "password",
                e.target.value
              )
            }
            margin="normal"
          />

          <TextField
            fullWidth
            select
            label="Role"
            value={form.role}
            onChange={(e) =>
              handleChange(
                "role",
                e.target.value
              )
            }
            margin="normal"
          >

            {roles.map((role) => (
              <MenuItem
                key={role}
                value={role}
              >
                {role}
              </MenuItem>
            ))}

          </TextField>

        </DialogContent>

        <DialogActions sx={{ p: 2 }}>

          <Button onClick={handleClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            {editingUser
              ? "Save Changes"
              : "Create User"}
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
};

export default Users;