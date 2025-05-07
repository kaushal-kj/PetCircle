const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
//express object
const { app, server } = require("./src/socket/Socket");
// const app = express();
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

//communityPostsRoutes
const communityPostRoutes = require("./src/routes/CommunityPostRoute");
app.use(communityPostRoutes);

//adoptionRoutes
const adoptionRoutes = require("./src/routes/AdoptionRoute");
app.use(adoptionRoutes);

//expertRoutes
const expertRoutes = require("./src/routes/ExpertRoute");
app.use(expertRoutes);

//messageRoutes
const messageRoutes = require("./src/routes/MessageRoute");
app.use(messageRoutes);

//adminRoutes
const adminRoutes = require("./src/routes/AdminRoute");
app.use("/admin", adminRoutes);

//database connection
mongoose.connect("mongodb://127.0.0.1:27017/PetCircle").then(() => {
  console.log("database connected.");
});

//server port
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("server started on port", port);
});
