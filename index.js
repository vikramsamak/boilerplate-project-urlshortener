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

app.get("/api", function (req, res) {
  res.json({ error: "invalid url" });
});

// Endpoint to save shorturl
app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "missing url" });
  }
  const urlObject = new URL(url);
  dns.lookup(urlObject.hostname, (err) => {
    if (err) {
      return res.status(400).json({ error: "invalid url" });
    }
    const shortUrl = shortid.generate();
    urlDatabase[shortUrl] = url;
    res.json({ original_url: url, short_url: shortUrl });
  });
});

// Endpoint to redirect to original url
app.get("/api/shorturl/:shorturl", function (req, res) {
  const { shorturl } = req.params;
  const original_url = urlDatabase[shorturl];

  if (original_url) {
    res.redirect(original_url);
  } else {
    res.json({ error: "invalid url" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
