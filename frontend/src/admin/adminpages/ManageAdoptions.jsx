import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

const ManageAdoptions = () => {
  const [groupedAdoptions, setGroupedAdoptions] = useState({});
  const [filteredGroupedAdoptions, setFilteredGroupedAdoptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [page, setPage] = useState({});
  const [rowsPerPage] = useState(3);

  const [selectedAdoptions, setSelectedAdoptions] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDelete, setBulkDelete] = useState(false);

  const [startDate, setStartDate] = useState(""); // Start Date as string
  const [endDate, setEndDate] = useState(""); // End Date as string

  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/adoptions");
      const adoptions = res.data.data;

      const grouped = {};
      adoptions.forEach((adopt) => {
        const userId = adopt.postedBy._id;
        if (!grouped[userId]) {
          grouped[userId] = {
            user: adopt.postedBy,
            adoptions: [],
          };
        }
        grouped[userId].adoptions.push(adopt);
      });

      setGroupedAdoptions(grouped);
    } catch (err) {
      console.error("Error fetching adoptions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  useEffect(() => {
    let newFiltered = {};

    Object.entries(groupedAdoptions).forEach(([userId, data]) => {
      const filtered = data.adoptions.filter((adoption) => {
        const petName = adoption.pet?.name?.toLowerCase() || "";
        const userName = data.user?.username?.toLowerCase() || "";

        // Filtering based on search term
        const matchesSearchTerm =
          petName.includes(searchTerm.toLowerCase()) ||
          userName.includes(searchTerm.toLowerCase());

        // Filtering based on date range
        const adoptionDate = new Date(adoption.createdAt);
        const isWithinDateRange =
          (!startDate || adoptionDate >= new Date(startDate)) &&
          (!endDate || adoptionDate <= new Date(endDate));

        return matchesSearchTerm && isWithinDateRange;
      });

      let sorted = [...filtered];
      if (sortOption === "newest") {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest to Oldest
      } else if (sortOption === "oldest") {
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest to Newest
      }

      if (sorted.length > 0) {
        newFiltered[userId] = { ...data, adoptions: sorted };
      }
    });

    setFilteredGroupedAdoptions(newFiltered);
    setPage(
      Object.keys(newFiltered).reduce((acc, id) => ({ ...acc, [id]: 0 }), {})
    );
  }, [searchTerm, sortOption, startDate, endDate, groupedAdoptions]);

  const handlePageChange = (userId, newPage) => {
    setPage({ ...page, [userId]: newPage });
  };

  const handleSelect = (id) => {
    setSelectedAdoptions((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    setBulkDelete(true);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = (id) => {
    setSelectedAdoptions([id]);
    setBulkDelete(false);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedAdoptions.map((id) => axios.delete(`/admin/adoption/${id}`))
      );

      const updated = { ...groupedAdoptions };
      for (let userId in updated) {
        updated[userId].adoptions = updated[userId].adoptions.filter(
          (a) => !selectedAdoptions.includes(a._id)
        );
        if (updated[userId].adoptions.length === 0) {
          delete updated[userId];
        }
      }

      setGroupedAdoptions(updated);
      setSelectedAdoptions([]);
    } catch (err) {
      console.error("Error deleting adoption(s)", err);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const isSelected = (id) => selectedAdoptions.includes(id);

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4">Manage Adoptions</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Tooltip title="Refresh">
            <IconButton onClick={fetchAdoptions}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            color="error"
            variant="contained"
            onClick={handleBulkDelete}
            disabled={selectedAdoptions.length === 0}
          >
            Delete Selected ({selectedAdoptions.length})
          </Button>
        </Box>
      </Box>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Search by pet/user name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </Select>
      </Box>

      {/* Date Range Inputs */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Start Date (YYYY-MM-DD)"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date (YYYY-MM-DD)"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : Object.keys(filteredGroupedAdoptions).length === 0 ? (
        <Typography>No adoptions found.</Typography>
      ) : (
        Object.entries(filteredGroupedAdoptions).map(
          ([userId, { user, adoptions }]) => {
            const currentPage = page[userId] || 0;
            const paginated = adoptions.slice(
              currentPage * rowsPerPage,
              currentPage * rowsPerPage + rowsPerPage
            );

            return (
              <Box key={userId} mb={5}>
                <Typography variant="h6" gutterBottom>
                  {user.username} ({adoptions.length} post
                  {adoptions.length > 1 ? "s" : ""})
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell>Photo</TableCell>
                        <TableCell>Pet Name</TableCell>
                        <TableCell>Breed</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Posted On</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginated.map((adoption) => (
                        <TableRow key={adoption._id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected(adoption._id)}
                              onChange={() => handleSelect(adoption._id)}
                            />
                          </TableCell>
                          <TableCell>
                            <img
                              src={
                                adoption.pet.photos?.[0] || "/default-pet.jpg"
                              }
                              alt={adoption.pet.name}
                              width="60"
                              height="60"
                              style={{ borderRadius: 8, objectFit: "cover" }}
                            />
                          </TableCell>
                          <TableCell>{adoption.pet.name}</TableCell>
                          <TableCell>{adoption.pet.breed}</TableCell>
                          <TableCell>{adoption.pet.age}</TableCell>
                          <TableCell>{adoption.message || "N/A"}</TableCell>
                          <TableCell>
                            {new Date(adoption.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => confirmDelete(adoption._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {adoptions.length > rowsPerPage && (
                    <TablePagination
                      component="div"
                      count={adoptions.length}
                      rowsPerPage={rowsPerPage}
                      page={currentPage}
                      onPageChange={(e, newPage) =>
                        handlePageChange(userId, newPage)
                      }
                      rowsPerPageOptions={[rowsPerPage]}
                    />
                  )}
                </TableContainer>
              </Box>
            );
          }
        )
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected adoption(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="secondary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAdoptions;
