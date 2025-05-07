import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6666",
  "#AA66CC",
];

const AdminOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch overview data from backend on component mount
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axios.get("/admin/overview");
        setOverview(response.data); // Expecting { totalUsers, totalExperts, totalPosts, totalPets, totalAdoptions, totalCommunities }
      } catch (err) {
        console.error("Error fetching admin overview:", err);
        setError("Failed to load overview data");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center" color="error">
        {error}
      </Typography>
    );
  }

  const totalUsers = overview.totalUsers + overview.totalExperts;

  // Prepare data for charts
  const chartData = [
    { name: "PetOwners", value: overview.totalUsers },
    { name: "Experts", value: overview.totalExperts },
    { name: "Posts", value: overview.totalPosts },
    { name: "Pets", value: overview.totalPets },
    { name: "Adoptions", value: overview.totalAdoptions },
    { name: "Communities", value: overview.totalCommunities },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Cards for each metric */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total Users (Pet Owners + Experts)
              </Typography>
              <Typography variant="h4">{totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Posts</Typography>
              <Typography variant="h4">{overview.totalPosts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Pets</Typography>
              <Typography variant="h4">{overview.totalPets}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Adoptions</Typography>
              <Typography variant="h4">{overview.totalAdoptions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Communities</Typography>
              <Typography variant="h4">{overview.totalCommunities}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Section */}
      <Box mt={6}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Overview Chart
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Refresh Button */}
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Refresh Data
        </Button>
      </Box>
    </Box>
  );
};

export default AdminOverview;
