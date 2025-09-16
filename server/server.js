const express = require("express");
const path = require("path");
const helmet = require("helmet"); // 🔹 защита заголовками
const { initBot } = require("../bot/bot");

const volunteerRoutes = require("./routes/volunteerRoutes");
const eventRoutes = require("./routes/eventRoutes");
const organizerRoutes = require("./routes/organizerRoutes");
const participationRoutes = require("./routes/participationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const requestsRoutes = require("./routes/requestsRoutes");
const askRoutes = require("./routes/askRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 middleware безопасности с мягким CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "'unsafe-inline'"], // разрешаем inline JS
        "script-src-attr": ["'unsafe-inline'"],      // разрешаем onclick/onload
      },
    },
  })
);

app.disable("x-powered-by"); // убираем лишний заголовок
app.use(express.json({ limit: "100kb" })); // ограничение на размер тела запроса
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

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
  console.log(`✅ Server running at http://localhost:${PORT}`);
  initBot(); // запускаем бота вместе с сервером
});
