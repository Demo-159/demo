const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const streams = require("./streams.json");
const manifest = require("./manifest.json");

app.use(cors());

app.get("/manifest.json", (req, res) => {
  res.json(manifest);
});

app.get("/catalog/:type/:id.json", (req, res) => {
  const { type, id } = req.params;
  let metas = [];

  if (type === "movie" && id === "personal-movies") {
    metas = streams.movies.map(m => ({
      id: m.id,
      type: "movie",
      name: m.title,
      poster: m.poster,
      description: m.description
    }));
  }

  if (type === "series" && id === "personal-series") {
    metas = streams.series.map(s => ({
      id: s.id,
      type: "series",
      name: s.title,
      poster: s.poster,
      description: s.description
    }));
  }

  res.json({ metas });
});

app.get("/stream/:type/:id.json", (req, res) => {
  const { type, id } = req.params;
  const list = type === "movie" ? streams.movies : streams.series;
  const item = list.find(i => i.id === id);

  if (item && item.video) {
    res.json({
      streams: [
        {
          title: "Servidor Personal",
          url: item.video
        }
      ]
    });
  } else {
    res.json({ streams: [] });
  }
});



app.listen(PORT, () => {
  console.log("Addon corriendo en el puerto " + PORT);
});

app.get("/", (req, res) => {
  res.send("El addon de Stremio está funcionando ✅");
});