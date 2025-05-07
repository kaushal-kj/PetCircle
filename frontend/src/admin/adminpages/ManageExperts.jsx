import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";

const ManageExperts = () => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpertId, setSelectedExpertId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedExperts, setSelectedExperts] = useState([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Pagination
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);

  useEffect(() => {
    fetchExperts();
  }, [refresh]);

  useEffect(() => {
    handleSearchAndSort();
  }, [search, experts, sortAsc, filterStatus]);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/experts");
      setExperts(res.data);
    } catch (err) {
      console.error("Error fetching experts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAndSort = () => {
    let filtered = experts.filter(
      (exp) =>
        exp.user?.username.toLowerCase().includes(search.toLowerCase()) ||
        exp.user?.email.toLowerCase().includes(search.toLowerCase())
    );

    // Filter by verification status
    if (filterStatus === "verified") {
      filtered = filtered.filter((exp) => exp.isVerified === true);
    } else if (filterStatus === "not_verified") {
      filtered = filtered.filter((exp) => exp.isVerified === false);
    }

    filtered.sort((a, b) => {
      const nameA = a.user?.username?.toLowerCase();
      const nameB = b.user?.username?.toLowerCase();
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    setFilteredExperts(filtered);
    setPage(1); // Reset to first page after filter/search change
  };

  const handleApprove = async (id) => {
    await axios.patch(`/admin/expert/approve/${id}`);
    setRefresh((prev) => !prev);
  };

  const handleReject = async (id) => {
    await axios.patch(`/admin/expert/reject/${id}`);
    setRefresh((prev) => !prev);
  };

  const openDeleteDialog = (id) => {
    setSelectedExpertId(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedExpertId(null);
    setDeleteDialogOpen(false);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/admin/expert/${selectedExpertId}`);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error deleting expert:", err);
    } finally {
      closeDeleteDialog();
    }
  };

  const handleSelect = (id) => {
    setSelectedExperts((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const ids = paginatedExperts.map((exp) => exp._id);
      setSelectedExperts((prev) => [...new Set([...prev, ...ids])]);
    } else {
      const ids = paginatedExperts.map((exp) => exp._id);
      setSelectedExperts((prev) => prev.filter((id) => !ids.includes(id)));
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedExperts.map((id) => axios.delete(`/admin/experts/${id}`))
      );
      setSelectedExperts([]);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error in bulk delete:", err);
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Slice data for current page
  const paginatedExperts = filteredExperts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Manage Experts
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        <TextField
          label="Search by username or email"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 350 }}
        />

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="verified">Verified</MenuItem>
            <MenuItem value="not_verified">Not Verified</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setSortAsc((prev) => !prev)}
          >
            Sort ({sortAsc ? "A-Z" : "Z-A"})
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setRefresh((prev) => !prev)}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setBulkDeleteDialogOpen(true)}
            disabled={selectedExperts.length === 0}
          >
            Delete Selected ({selectedExperts.length})
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  checked={
                    paginatedExperts.length > 0 &&
                    paginatedExperts.every((exp) =>
                      selectedExperts.includes(exp._id)
                    )
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Usename</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Expertise</TableCell>
              <TableCell>Certificate</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedExperts.map((exp) => (
              <TableRow key={exp._id}>
                <TableCell padding="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedExperts.includes(exp._id)}
                    onChange={() => handleSelect(exp._id)}
                  />
                </TableCell>
                <TableCell>{exp.user?.username}</TableCell>
                <TableCell>{exp.user?.email}</TableCell>
                <TableCell>{exp.expertise}</TableCell>
                <TableCell>
                  {exp.expertiseCertificate ? (
                    <a
                      href={exp.expertiseCertificate}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={exp.isVerified ? "Verified" : "Not Verified"}
                    color={exp.isVerified ? "success" : "warning"}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box
                    display="flex"
                    gap={1}
                    justifyContent="center"
                    flexWrap="wrap"
                  >
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleApprove(exp._id)}
                      disabled={exp.isVerified}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => handleReject(exp._id)}
                      disabled={!exp.isVerified}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => openDeleteDialog(exp._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this expert? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* bulk delete dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Selected Experts</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedExperts.length} selected
            expert(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmBulkDelete} color="error" variant="contained">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageExperts;
