const express = require("express");
const path = require("path");

const fileSubmitController = require("./controllers/file.submit.js");
const allStudentCardController = require("./controllers/all.std.cntr.js");
const formHandlerController = require("./controllers/form.submit.js");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/students", allStudentCardController);

app.post("/generate", fileSubmitController, formHandlerController);
app.get("/preview", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "preview.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

app.use((req, res) => {
  res.redirect("https://toufikhasan.com");
});

module.exports = app;
