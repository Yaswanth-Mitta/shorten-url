// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const shortid = require("shortid");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://yaswanthmitta:YaswanthDev@cluster0.zbyissx.mongodb.net/url-shortner",
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  clickCount: { type: Number, default: 0 }, // Add the clickCount field
});

const Url = mongoose.model("Url", urlSchema);

app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  try {
    // Check if the original URL already exists in the database
    const existingUrl = await Url.findOne({ originalUrl });

    if (existingUrl) {
      // If the URL already exists, return the existing short URL
      res.json({ shortUrl: existingUrl.shortUrl });
    } else {
      // If the URL doesn't exist, generate a new short URL and save it to the database
      const shortUrl = shortid.generate();
      const url = new Url({ originalUrl, shortUrl });
      await url.save();
      res.json({ shortUrl });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOne({ shortUrl });

    if (url) {
      // Increment the clickCount
      url.clickCount += 1;
      await url.save();

      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
