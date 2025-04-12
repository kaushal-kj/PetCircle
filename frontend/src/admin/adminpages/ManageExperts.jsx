import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";

const ManageExperts = () => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch all experts
  const fetchExperts = async () => {
    try {
      const res = await axios.get("/admin/experts");
      console.log(res.data.data);

      const expertOnly = res.data.data.filter(
        (user) => user.user.role === "expert"
      );

      setExperts(expertOnly);
      setFilteredExperts(expertOnly);
    } catch (err) {
      console.error("Error fetching experts:", err);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  // Handle search
  useEffect(() => {
    const keyword = search.toLowerCase();
    const filtered = experts.filter(
      (user) =>
        user.user.username.toLowerCase().includes(keyword) ||
        user.user.fullName.toLowerCase().includes(keyword)
    );
    setFilteredExperts(filtered);
  }, [search, experts]);

  // Delete expert (single)
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this expert?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`/admin/expert/${id}`);
      setExperts(experts.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error deleting expert:", err);
    }
  };

  // Delete selected experts (multiple)
  const handleBulkDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete the selected experts?"
    );
    if (!confirm) return;

    try {
      await Promise.all(
        selectedIds.map((id) => axios.delete(`/admin/expert/${id}`))
      );
      setExperts((prev) => prev.filter((u) => !selectedIds.includes(u._id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Error deleting multiple experts:", err);
    }
  };

  // Table columns
  const columns = [
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      valueGetter: (params) => params?.row.user?.fullName || "N/A",
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      valueGetter: (params) => params?.row.user?.username || "N/A",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      valueGetter: (params) => params?.row.user?.email || "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row._id)}>
          <DeleteIcon color="error" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Manage Experts
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          fullWidth
          label="Search by name or username"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Tooltip title="Refresh">
          <IconButton onClick={fetchExperts}>
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

      <DataGrid
        rows={filteredExperts}
        columns={columns}
        getRowId={(row) => row._id}
        checkboxSelection
        autoHeight
        onRowSelectionModelChange={(ids) => setSelectedIds(ids)}
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      />
    </Box>
  );
};

export default ManageExperts;
