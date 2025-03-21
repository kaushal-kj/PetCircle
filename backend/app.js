const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//express object
const app = express();
app.use(cors());
// express that accept json object
app.use(express.json());

//userRoutes
const userRoutes = require("./src/routes/UserRoute");
app.use(userRoutes);

//petRoutes
const petRoutes = require("./src/routes/PetRoute");
app.use(petRoutes);

//postRoutes
const postRoutes = require("./src/routes/PostRoute");
app.use(postRoutes);

//communityRoutes
const communityRoutes = require("./src/routes/CommunityRoute");
app.use(communityRoutes);

//adoptionRoutes
const adoptionRoutes = require("./src/routes/AdoptionRoute");
app.use(adoptionRoutes);

//expertRoutes
const expertRoutes = require("./src/routes/ExpertRoute");
app.use(expertRoutes);

//contestRoutes
const contestRoutes = require("./src/routes/ContestRoute");
app.use(contestRoutes);

//database connection
mongoose.connect("mongodb://127.0.0.1:27017/pc").then(() => {
  console.log("database connected.");
});

//server port
const PORT = 3000;
app.listen(PORT, () => {
  console.log("server started on port ", PORT);
});
