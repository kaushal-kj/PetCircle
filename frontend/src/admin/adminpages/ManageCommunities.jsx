import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  InputLabel,
  FormControl,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Checkbox, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const ManageCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [memberFilter, setMemberFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await axios.get("/admin/communities");
        setCommunities(res.data.data);
        setFilteredCommunities(res.data.data);
      } catch (err) {
        console.error(
          "Error fetching communities:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    const filterCommunities = () => {
      const lowerSearch = searchTerm.toLowerCase();

      const filtered = communities.filter((community) => {
        const matchesSearch =
          community.name.toLowerCase().includes(lowerSearch) ||
          community.creator?.username?.toLowerCase().includes(lowerSearch);

        const membersCount = community.members?.length || 0;

        const matchesMemberFilter =
          memberFilter === "all" ||
          (memberFilter === "0-10" && membersCount <= 10) ||
          (memberFilter === "11-50" &&
            membersCount > 10 &&
            membersCount <= 50) ||
          (memberFilter === "51-100" &&
            membersCount > 50 &&
            membersCount <= 100) ||
          (memberFilter === "100+" && membersCount > 100);

        return matchesSearch && matchesMemberFilter;
      });

      setFilteredCommunities(filtered);
    };

    filterCommunities();
  }, [searchTerm, communities, memberFilter]);
  const paginatedData = filteredCommunities.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const handleOpenDialog = (id) => {
    setSelectedCommunityId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCommunityId(null);
    setOpenDialog(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/community/${id}`);
      setCommunities((prev) => prev.filter((c) => c._id !== id));
      setFilteredCommunities((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(
        "Error deleting community:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" p={4}>
      <Typography variant="h4" gutterBottom>
        Manage Communities
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
        mb={4}
      >
        <TextField
          fullWidth
          label="Search by name or creator"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel>Member Filter</InputLabel>
          <Select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            label="Member Filter"
          >
            <MenuItem value="all">All Members</MenuItem>
            <MenuItem value="0-10">0–10 Members</MenuItem>
            <MenuItem value="11-50">11–50 Members</MenuItem>
            <MenuItem value="51-100">51–100 Members</MenuItem>
            <MenuItem value="100+">100+ Members</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : filteredCommunities.length === 0 ? (
        <Typography align="center" color="textSecondary">
          No communities found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            {selectedIds.length > 0 && (
              <Button
                variant="contained"
                color="error"
                onClick={async () => {
                  try {
                    await Promise.all(
                      selectedIds.map((id) =>
                        axios.delete(`/admin/community/${id}`)
                      )
                    );
                    const updated = communities.filter(
                      (c) => !selectedIds.includes(c._id)
                    );
                    setCommunities(updated);
                    setFilteredCommunities(updated);
                    setSelectedIds([]);
                  } catch (err) {
                    console.error("Error bulk deleting:", err);
                  }
                }}
              >
                Delete Selected ({selectedIds.length})
              </Button>
            )}

            <IconButton
              title="Refresh"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await axios.get("/admin/communities");
                  setCommunities(res.data.data);
                  setFilteredCommunities(res.data.data);
                  setSelectedIds([]);
                } catch (err) {
                  console.error("Error refreshing communities:", err);
                } finally {
                  setLoading(false);
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>

          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      selectedIds.length === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < paginatedData.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newIds = paginatedData.map((c) => c._id);
                        setSelectedIds(newIds);
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <strong>Image</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Created By</strong>
                </TableCell>
                <TableCell>
                  <strong>Members</strong>
                </TableCell>
                <TableCell>
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCommunities.map((community) => (
                <TableRow key={community._id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(community._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds((prev) => [...prev, community._id]);
                        } else {
                          setSelectedIds((prev) =>
                            prev.filter((id) => id !== community._id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {community.image ? (
                      <img
                        src={community.image}
                        alt={community.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{community.name}</TableCell>
                  <TableCell>{community.creator?.username || "—"}</TableCell>
                  <TableCell>{community.members?.length || 0}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenDialog(community._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredCommunities.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0); // Reset to first page
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this community?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                color="error"
                onClick={() => {
                  handleDelete(selectedCommunityId);
                  handleCloseDialog();
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </TableContainer>
      )}
    </Box>
  );
};

export default ManageCommunities;
