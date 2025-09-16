const express = require("express");
const path = require("path");

const volunteerRoutes = require("./routes/volunteerRoutes");
const eventRoutes = require("./routes/eventRoutes");
const organizerRoutes = require("./routes/organizerRoutes");
const participationRoutes = require("./routes/participationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const requestsRoutes = require("./routes/requestsRoutes");
const askRoutes = require("./routes/askRoutes");

const app = express();
const PORT = 3000;

// ✅ парсим JSON и формы до всех роутов
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 раздаём статические файлы (index.html, css, js и т.п.)
app.use(express.static(path.join(__dirname, "../client")));

// 🔹 API маршруты
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/organizers", organizerRoutes);
app.use("/api/participation", participationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/ask", askRoutes);

// 🔹 если запрашивается корень — отдаём index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
