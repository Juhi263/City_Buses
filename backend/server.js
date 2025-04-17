const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const busRoutes = require("./routes/busRoutes");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api", busRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
