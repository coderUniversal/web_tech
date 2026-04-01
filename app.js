const express = require("express");
const path = require("path");

const app = express();

// set EJS
app.set("view engine", "ejs");

// static files
app.use(express.static(path.join(__dirname, "public")));

// route
app.get("/", (req, res) => {
    res.render("index");
});

// start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running at http://localhost:3000");
});