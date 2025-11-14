const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const InstitutionModel = require('./models/institution.js');
const institutionRoutes = require('./routes/institution.js');

const app = express();
const PORT = 8001;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/InstitutionDB")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api', institutionRoutes);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Landing page
app.get("/", (req, res) => {
  res.render("landing"); // views/landing.ejs
});

// Explore page
app.get("/explore", (req, res) => {
  res.render("main"); // views/main.ejs
});

// Start server
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
