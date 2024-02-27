require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const validUrl = require("valid-url");
const shortid = require("shortid");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

var urlDatabase = {};

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// Endpoint to save shorturl
app.post("/api/shorturl", function (req, res) {
  const { url } = req.body;

  if (!validUrl.isUri(url)) {
    return res.status(400).json({ error: "invalid url" });
  }

  const shortUrl = shortid.generate();

  urlDatabase[shortUrl] = url;

  res.json({ original_url: url, short_url: shortUrl });
});

// Endpoint to redirect to original url
app.get("/api/shorturl/:shorturl", function (req, res) {
  const { shorturl } = req.params;
  const original_url = urlDatabase[shorturl];

  if (original_url) {
    res.redirect(original_url);
  } else {
    res.status(404).json({ error: "invalid url" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
