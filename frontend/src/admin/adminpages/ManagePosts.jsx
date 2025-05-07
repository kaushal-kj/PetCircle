import {
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Pagination, // Import Pagination from Material-UI
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [minLikes, setMinLikes] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState("recent");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const [page, setPage] = useState(1); // Current page
  const [postsPerPage, setPostsPerPage] = useState(6); // Posts per page

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/admin/posts");
      setPosts(res.data.data);
      setFilteredPosts(res.data.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const openDeleteDialog = (postId) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`/admin/post/${postToDelete}`);
      const updated = posts.filter((p) => p._id !== postToDelete);
      setPosts(updated);
      applyFilters(updated);
      setSnackbarMsg("Post deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      setSnackbarMsg("Failed to delete post");
    } finally {
      closeDeleteDialog();
    }
  };

  const applyFilters = (postList = posts) => {
    let filtered = [...postList];

    // Search by username
    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.author?.username?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by likes
    if (minLikes) {
      filtered = filtered.filter(
        (p) => (p.likes?.length || 0) >= Number(minLikes)
      );
    }

    // Filter by date range
    if (fromDate) {
      filtered = filtered.filter((p) => moment(p.createdAt).isAfter(fromDate));
    }
    if (toDate) {
      filtered = filtered.filter((p) =>
        moment(p.createdAt).isBefore(moment(toDate).endOf("day"))
      );
    }

    // Sorting
    if (sort === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "mostLiked") {
      filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    }

    setFilteredPosts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [search, minLikes, fromDate, toDate, sort]);

  const groupByUser = () => {
    const grouped = {};
    filteredPosts.forEach((post) => {
      const username = post.author?.username || "Unknown";
      if (!grouped[username]) grouped[username] = [];
      grouped[username].push(post);
    });
    return grouped;
  };

  const groupedPosts = groupByUser();

  // Pagination Logic
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Get current posts to display
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Posts
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search by username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            label="From Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            label="To Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            label="Min Likes"
            type="number"
            value={minLikes}
            onChange={(e) => setMinLikes(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sort}
              label="Sort By"
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="recent">Most Recent</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="mostLiked">Most Liked</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Posts grouped by user */}
      {Object.entries(groupedPosts).map(([username, userPosts]) => (
        <Box key={username} mb={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={2}>
              {userPosts[0]?.author?.profilePic && (
                <img
                  src={userPosts[0].author.profilePic}
                  alt="Profile"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
              <Box>
                <Typography variant="h6">
                  Posts by:{" "}
                  <strong>{userPosts[0]?.author?.username || "Unknown"}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userPosts[0]?.author?.email || "No email provided"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {userPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <Box
                  border={1}
                  borderColor="#ddd"
                  borderRadius={2}
                  p={2}
                  boxShadow={1}
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  bgcolor="white"
                  height="100%"
                >
                  <Typography variant="body1">
                    {post.caption || "No caption"}
                  </Typography>
                  {post.photos && (
                    <img
                      src={post.photos}
                      alt="Post"
                      style={{
                        maxHeight: 200,
                        objectFit: "cover",
                        borderRadius: 8,
                        width: "100%",
                      }}
                    />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {moment(post.createdAt).fromNow()}
                  </Typography>
                  <Typography variant="caption">
                    Likes: {post.likes?.length || 0}
                  </Typography>
                  <Box display="flex" justifyContent="flex-end" mt="auto">
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(post._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Pagination */}
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredPosts.length / postsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg("")}
        message={snackbarMsg}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
};

export default ManagePosts;
