const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const morganLogger = require("morgan");
app.use(morganLogger("dev"));
//
const path = require("path");
const multer = require("multer");
app.use("/images", express.static(path.join(__dirname, "public/images")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});
//
const entityRoute = require("./routes/entity.route");
const telemetryRoute = require("./routes/telemetry.route");
const provisionRoute = require("./routes/provision.route");
app.use("/entity", entityRoute);
app.use("/telemetry", telemetryRoute);
app.use("/provision", provisionRoute);

app.get("/check", (req, res) => res.send("ok"));

app.use("/", express.static("build"));
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

module.exports = app;
