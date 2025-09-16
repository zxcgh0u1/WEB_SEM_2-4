const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔹 Конфиг GigaChat
const AUTH_URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
const CHAT_URL = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions";

// данные из личного кабинета
const CLIENT_ID = "dee304aa-b762-443e-bfee-4323cb80d4de";
const AUTH_KEY = "ZGVlMzA0YWEtYjc2Mi00NDNlLWJmZWUtNDMyM2NiODBkNGRlOjMyYTA4MzMwLTY0ODYtNDY2NC1hNTRlLWJmNjg0ODhkOTYzMg==";
const SCOPE = "GIGACHAT_API_PERS";

// переменная для хранения токена
let accessToken = null;

// ================== Получение токена ==================
async function getAccessToken() {
  try {
    const res = await axios.post(
      AUTH_URL,
      `scope=${SCOPE}`,
      {
        headers: {
          Authorization: `Basic ${AUTH_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
          RqUID: CLIENT_ID,
        },
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }), // ⚠️ игнор сертификата
      }
    );
    accessToken = res.data.access_token;
    console.log("✅ GigaChat token обновлён");
  } catch (err) {
    console.error("❌ Ошибка при получении GigaChat токена:", err.response?.data || err.message);
  }
}

// первый запуск
getAccessToken();
// автообновление раз в 25 минут
setInterval(getAccessToken, 25 * 60 * 1000);

// ================== /api/ask ==================
// ================== /api/ask ==================
router.post("/", async (req, res) => {
  try {
    const question = (req.body && (req.body.question ?? req.body.message ?? req.body.q))?.toString().trim();
    if (!question) {
      return res.status(400).json({ error: "Вопрос пустой" });
    }

    if (!accessToken) {
      return res.status(500).json({ error: "Нет токена GigaChat" });
    }

    const gRes = await axios.post(
      CHAT_URL,
      {
        model: "GigaChat:latest",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
      }
    );

    const answer = gRes.data.choices?.[0]?.message?.content || "❌ Нет ответа";
    res.json({ answer });
  } catch (err) {
    console.error("❌ Ошибка в /ask:");
    console.error("Статус:", err.response?.status);
    console.error("Ответ:", JSON.stringify(err.response?.data, null, 2)); // полный текст ошибки
    res.status(500).json({ error: "Ошибка при обращении к GigaChat", details: err.response?.data || err.message });
  }
});

module.exports = router;
