// map-search.js — Map Search Backend (Single File, Live Style)

const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 9500;

app.use(express.json());

// ---------------- MAP SEARCH ----------------
// Search places by name (city, area, landmark)
app.get("/api/map/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Search query (q) is required"
    });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      q
    )}&limit=5`;

    const response = await fetch(url, {
      headers: { "User-Agent": "MapSearchApp/1.0" }
    });

    const data = await response.json();

    const result = data.map(place => ({
      name: place.display_name,
      lat: place.lat,
      lon: place.lon,
      type: place.type
    }));

    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Map search failed"
    });
  }
});

// ---------------- NEARBY SEARCH ----------------
// Find nearby places using latitude & longitude
app.get("/api/map/nearby", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      message: "lat and lon required"
    });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "MapSearchApp/1.0" }
    });

    const data = await response.json();

    res.json({
      success: true,
      address: data.display_name
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Nearby search failed"
    });
  }
});

// ---------------- HEALTH ----------------
app.get("/", (req, res) => {
  res.json({
    status: "Map Search API is live",
    time: new Date()
  });
});

// ---------------- START ----------------
app.listen(PORT, () => {
  console.log(`🗺️ Map Search API running at http://localhost:${PORT}`);
});
