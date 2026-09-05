const path = require("path");
const fs = require("fs");
const express = require("express");

const app = express();
const publicDir = path.join(__dirname, "public");
const API_URL = process.env.ZE_API_URL || "https://zedevents-production.up.railway.app";

function escapeAttr(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function firstPhoto(photos) {
  if (!photos) return "";
  if (Array.isArray(photos)) return photos[0] || "";
  if (typeof photos === "string") {
    try {
      const parsed = JSON.parse(photos);
      if (Array.isArray(parsed)) return parsed[0] || "";
    } catch {
      return photos;
    }
  }
  return "";
}

app.get("/service.html", async (req, res, next) => {
  const file = path.join(publicDir, "service.html");
  let html;
  try {
    html = fs.readFileSync(file, "utf8");
  } catch {
    return next();
  }
  const id = req.query.id;
  if (!id) return res.type("html").send(html);
  try {
    const r = await fetch(`${API_URL}/services/${encodeURIComponent(id)}`);
    if (r.ok) {
      const item = await r.json();
      const title = escapeAttr((item.title || "Service") + " - ZedEvents");
      const desc = escapeAttr(String(item.description || item.title || "ZedEvents").slice(0, 160));
      const photo = escapeAttr(firstPhoto(item.photos));
      const url = escapeAttr(`${req.protocol}://${req.get("host")}/service.html?id=${id}`);
      html = html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
        .replace(/id="ogTitle" property="og:title" content="[^"]*"/, `id="ogTitle" property="og:title" content="${title}"`)
        .replace(/id="ogDescription" property="og:description" content="[^"]*"/, `id="ogDescription" property="og:description" content="${desc}"`)
        .replace(/id="ogUrl" property="og:url" content="[^"]*"/, `id="ogUrl" property="og:url" content="${url}"`)
        .replace(/id="ogImage" property="og:image" content="[^"]*"/, `id="ogImage" property="og:image" content="${photo}"`);
    }
  } catch {
    /* serve the page anyway */
  }
  res.type("html").send(html);
});

app.use(express.static(publicDir));

app.get("*", (req, res) => {
  const file = path.join(publicDir, "index.html");
  res.sendFile(file);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`ZedEvents website on port ${port}`);
});
