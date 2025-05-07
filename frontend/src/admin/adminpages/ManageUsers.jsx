import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openDeleteDialog = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`/admin/user/${userToDelete}`);
      setUsers((prev) => prev.filter((user) => user._id !== userToDelete));
      setSnackbarMsg("User deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      setSnackbarMsg("Failed to delete user");
    } finally {
      closeDeleteDialog();
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => axios.delete(`/admin/user/${id}`))
      );
      setUsers((prev) =>
        prev.filter((user) => !selectedIds.includes(user._id))
      );
      setSnackbarMsg("Selected users deleted successfully");
      setSelectedIds([]);
    } catch (err) {
      console.error("Bulk delete failed:", err);
      setSnackbarMsg("Error deleting selected users");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error";
      case "expert":
        return "info";
      case "petOwner":
        return "success";
      default:
        return "default";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => <strong>{params.row.fullName}</strong>,
    },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getRoleColor(params.value)}
          variant="outlined"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => openDeleteDialog(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          fullWidth
          label="Search by name or username"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Tooltip title="Refresh">
          <IconButton onClick={fetchUsers}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {selectedIds.length > 0 && (
        <Box mb={2}>
          <Button variant="contained" color="error" onClick={handleBulkDelete}>
            Delete Selected ({selectedIds.length})
          </Button>
        </Box>
      )}

      <Box sx={{ backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          getRowId={(row) => row._id}
          checkboxSelection
          onRowSelectionModelChange={(ids) => setSelectedIds(ids)}
          rowSelectionModel={selectedIds}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
          }}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action is
            irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg("")}
        message={snackbarMsg}
        // key={"bottom" + "right"}
      />
    </Box>
  );
};

export default ManageUsers;
