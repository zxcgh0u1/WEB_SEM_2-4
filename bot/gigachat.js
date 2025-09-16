const axios = require("axios");
const crypto = require("crypto");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // ⚠️ отключаем проверку SSL

const CLIENT_ID = "dee304aa-b762-443e-bfee-4323cb80d4de";
const AUTH_KEY =
  "ZGVlMzA0YWEtYjc2Mi00NDNlLWJmZWUtNDMyM2NiODBkNGRlOjU4YTc4ZTViLTUxOGQtNDE2My1iZmM1LTJlM2YzM2QzOWM0Ng==";

let accessToken = null;
let tokenExpiresAt = 0;

// Получение токена
async function getAccessToken() {
  if (Date.now() < tokenExpiresAt && accessToken) {
    return accessToken;
  }

  const res = await axios.post(
    "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
    "scope=GIGACHAT_API_PERS",
    {
      headers: {
        Authorization: "Basic " + AUTH_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
        RqUID: crypto.randomUUID(),
      },
    }
  );

  accessToken = res.data.access_token;
  tokenExpiresAt = Date.now() + (res.data.expires_in - 60) * 1000; // запас в 1 мин
  return accessToken;
}

// Отправка вопроса в GigaChat
async function askGigaChat(question) {
  const token = await getAccessToken();

  const res = await axios.post(
    "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
    {
      model: "GigaChat:latest",
      messages: [{ role: "user", content: question }],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content;
}

module.exports = { askGigaChat };
