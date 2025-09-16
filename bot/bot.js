const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = process.env.API_URL || "http://localhost:3000/api";

const bot = new Telegraf(BOT_TOKEN);

// ================== START ==================
bot.start((ctx) => {
  ctx.reply(`Привет! Я Volonter0_bot 🤖

Доступные команды:
/register name email phone — зарегистрироваться
/volunteers — список волонтёров
/events — список мероприятий
/reports — ваши отчёты
/request event_id — оставить заявку на мероприятие

❓ А ещё вы можете просто написать мне сообщение, и я попробую ответить 😉`);
});

// ================== REGISTRATION ==================
bot.command("register", async (ctx) => {
  try {
    const parts = ctx.message.text.split(" ");
    if (parts.length < 4) {
      return ctx.reply("⚠️ Использование: /register Имя email телефон");
    }

    const name = parts[1];
    const email = parts[2];
    const phone = parts[3];
    const tg_id = ctx.from.id;

    // Проверка email
    if (!/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      return ctx.reply("❌ Некорректный email. Пример: ivan@example.com");
    }

    // Проверка телефона
    if (!/^[78][0-9]{10}$/.test(phone)) {
      return ctx.reply("❌ Некорректный телефон. Пример: 89991112233");
    }

    const res = await axios.post(`${API_URL}/volunteers`, {
      name,
      email,
      phone,
      tg_id,
    });

    ctx.reply(`✅ Вы зарегистрированы! ID: ${res.data.id}`);
  } catch (err) {
    console.error("Ошибка при регистрации:", err.response?.data || err.message);
    ctx.reply("❌ Ошибка при регистрации (возможно, email уже используется).");
  }
});

// ================== VOLUNTEERS ==================
bot.command("volunteers", async (ctx) => {
  try {
    const res = await axios.get(`${API_URL}/volunteers`);
    const volunteers = res.data;

    if (volunteers.length === 0) {
      return ctx.reply("📭 Волонтёров нет");
    }

    let msg = "🙋 Волонтёры:\n\n";
    volunteers.forEach((v) => {
      msg += `#${v.id} — ${v.name} (${v.email})\n`;
    });

    ctx.reply(msg);
  } catch (err) {
    console.error("Ошибка в /volunteers:", err);
    ctx.reply("❌ Ошибка при получении волонтёров.");
  }
});

// ================== EVENTS ==================
bot.command("events", async (ctx) => {
  try {
    const res = await axios.get(`${API_URL}/events`);
    const events = res.data;

    if (events.length === 0) {
      return ctx.reply("📭 Мероприятий нет");
    }

    let msg = "📅 Мероприятия:\n\n";
    events.forEach((e) => {
      msg += `#${e.id} — ${e.title} (${new Date(e.date).toLocaleDateString()})\n`;
      msg += `Организатор: ${e.organizer_name || "—"}\n`;
      msg += `Участников: ${e.current_participants}/${e.max_participants}\n`;
      msg += `Описание: ${e.description || "—"}\n\n`;
    });

    ctx.reply(msg);
  } catch (err) {
    console.error("Ошибка в /events:", err);
    ctx.reply("❌ Ошибка при получении мероприятий.");
  }
});

// ================== REPORTS ==================
bot.command("reports", async (ctx) => {
  try {
    const tg_id = ctx.from.id;

    const volRes = await axios.get(`${API_URL}/volunteers/by-tg/${tg_id}`);
    if (!volRes.data) {
      return ctx.reply("⚠️ Вы ещё не зарегистрированы как волонтёр!");
    }

    const volunteer_id = volRes.data.id;

    const repRes = await axios.get(`${API_URL}/reports?volunteer_id=${volunteer_id}`);
    const reports = repRes.data;

    if (reports.length === 0) {
      return ctx.reply("📭 У вас пока нет отчётов");
    }

    let msg = "📊 Ваши отчёты:\n\n";
    reports.forEach((r) => {
      msg += `#${r.id} — мероприятие ${r.event_id}, ${r.hours}ч\nОтзыв: ${r.feedback || "—"}\n\n`;
    });

    ctx.reply(msg);
  } catch (err) {
    console.error("Ошибка в /reports:", err);
    ctx.reply("❌ Ошибка при получении отчётов.");
  }
});

// ================== REQUEST ==================
bot.command("request", async (ctx) => {
  try {
    const parts = ctx.message.text.split(" ");
    if (parts.length < 2) {
      return ctx.reply("⚠️ Использование: /request event_id");
    }

    const event_id = parseInt(parts[1]);
    const tg_id = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name;

    await axios.post(`${API_URL}/requests`, {
      tg_id,
      username,
      event_id,
    });

    ctx.reply(`✅ Заявка на участие в мероприятии #${event_id} отправлена!`);
  } catch (err) {
    console.error("Ошибка при создании заявки:", err.response?.data || err.message);
    ctx.reply("❌ Ошибка при создании заявки.");
  }
});

// ================== ЛЮБОЕ СООБЩЕНИЕ → ASK ==================
bot.on("text", async (ctx) => {
  try {
    const question = ctx.message.text.trim();

    // если это похоже на команду, игнорируем (чтобы не дублировалось)
    if (question.startsWith("/")) return;

    const res = await axios.post(`${API_URL}/ask`, { question });

    ctx.reply(res.data.answer || "❌ Нет ответа");
  } catch (err) {
    console.error("Ошибка в автоответе:", err.response?.data || err.message);
    ctx.reply("❌ Ошибка при обращении к ассистенту.");
  }
});

// ================== START BOT ==================
bot.launch();
console.log("🤖 Bot запущен!");
