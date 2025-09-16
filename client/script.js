// ================== VOLUNTEERS ==================
document.getElementById("volunteerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  await fetch("/api/volunteers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  fetchVolunteers();
});

async function fetchVolunteers() {
  const res = await fetch("/api/volunteers");
  const data = await res.json();

  const list = document.getElementById("volunteersList");
  list.innerHTML = "";

  data.forEach((v) => {
    const div = document.createElement("div");
    div.textContent = `#${v.id} — ${v.name} (${v.email})`;

    // кнопка удаления
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑 Удалить";
    delBtn.onclick = async () => {
      if (confirm(`Удалить волонтёра ${v.name}?`)) {
        await fetch(`/api/volunteers/${v.id}`, { method: "DELETE" });
        fetchVolunteers();
      }
    };

    div.appendChild(delBtn);
    list.appendChild(div);
  });
}

// ================== ORGANIZERS ==================
document.getElementById("organizerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  await fetch("/api/organizers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  fetchOrganizers();
});

async function fetchOrganizers() {
  const res = await fetch("/api/organizers");
  const data = await res.json();

  const list = document.getElementById("organizersList");
  list.innerHTML = "";

  data.forEach((o) => {
    const div = document.createElement("div");
    div.textContent = `#${o.id} — ${o.name} (${o.email})`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑 Удалить";
    delBtn.onclick = async () => {
      if (confirm(`Удалить организатора ${o.name}?`)) {
        await fetch(`/api/organizers/${o.id}`, { method: "DELETE" });
        fetchOrganizers();
      }
    };

    div.appendChild(delBtn);
    list.appendChild(div);
  });
}

// ================== EVENTS ==================
document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  fetchEvents();
});

async function fetchEvents() {
  const res = await fetch("/api/events");
  const data = await res.json();

  const list = document.getElementById("eventsList");
  list.innerHTML = "";

  data.forEach((e) => {
    const div = document.createElement("div");
    div.textContent = `#${e.id} — ${e.title} (${e.date})`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑 Удалить";
    delBtn.onclick = async () => {
      if (confirm(`Удалить мероприятие ${e.title}?`)) {
        await fetch(`/api/events/${e.id}`, { method: "DELETE" });
        fetchEvents();
      }
    };

    div.appendChild(delBtn);
    list.appendChild(div);
  });
}

// ================== PARTICIPATION ==================
document.getElementById("participationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  await fetch("/api/participation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  fetchParticipation();
});

async function fetchParticipation() {
  const res = await fetch("/api/participation");
  const data = await res.json();

  const list = document.getElementById("participationList");
  list.innerHTML = "";

  data.forEach((p) => {
    const div = document.createElement("div");
    div.textContent = `#${p.id} — волонтёр ${p.volunteer_id}, мероприятие ${p.event_id}, статус: ${p.status}`;
    list.appendChild(div);
  });
}

// ================== REPORTS ==================
document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  fetchReports();
});

async function fetchReports() {
  const res = await fetch("/api/reports");
  const data = await res.json();

  const list = document.getElementById("reportsList");
  list.innerHTML = "";

  data.forEach((r) => {
    const div = document.createElement("div");
    div.textContent = `#${r.id} — волонтёр ${r.volunteer_id}, мероприятие ${r.event_id}, ${r.hours}ч, отзыв: ${r.feedback}`;
    list.appendChild(div);
  });
}

// ================== REQUESTS ==================
async function fetchRequests() {
  const res = await fetch("/api/requests");
  const data = await res.json();

  const container = document.getElementById("requestsList");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerText = "📭 Заявок нет";
    return;
  }

  data.forEach((req) => {
    const div = document.createElement("div");
    div.classList.add("request-item");
    div.innerHTML = `
      <b>Заявка #${req.id}</b> — event_id: ${req.event_id}, от пользователя: ${req.username || "unknown"} (tg_id: ${req.tg_id}) 
      <br>Статус: <span class="status">${req.status}</span>
      <br>
      <button onclick="approveRequest(${req.id})">✅ Одобрить</button>
      <button onclick="rejectRequest(${req.id})">❌ Отклонить</button>
    `;
    container.appendChild(div);
  });
}

async function approveRequest(id) {
  await fetch(`/api/requests/${id}/approve`, { method: "PUT" });
  fetchRequests();
}

async function rejectRequest(id) {
  await fetch(`/api/requests/${id}/reject`, { method: "PUT" });
  fetchRequests();
}

// ================== CHAT WIDGET ==================
function toggleChat() {
  const body = document.getElementById("chatBody");
  body.style.display = body.style.display === "none" ? "block" : "none";
}

// Отправка сообщений
async function sendMessage() {
  const input = document.getElementById("chatMessage");
  const text = input.value.trim();
  if (!text) return;

  // вывод сообщения пользователя
  const body = document.getElementById("chatBody");
  const userMsg = document.createElement("div");
  userMsg.className = "chat-message user";
  userMsg.textContent = text;
  body.appendChild(userMsg);

  input.value = "";
  body.scrollTop = body.scrollHeight;

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: text }),
    });

    const data = await res.json();
    const botMsg = document.createElement("div");
    botMsg.className = "chat-message bot";
    botMsg.textContent = data.answer || "❌ Ошибка: нет ответа";
    body.appendChild(botMsg);
    body.scrollTop = body.scrollHeight;
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

async function sendChat() {
  const input = document.getElementById("chatQuestion");
  const question = input.value.trim();
  if (!question) return;

  const messagesDiv = document.getElementById("chat-messages");
  messagesDiv.innerHTML += `<div class="message user">${question}</div>`;
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  input.value = "";

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    messagesDiv.innerHTML += `<div class="message bot">${data.answer || "❌ Ошибка"}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    console.error("Ошибка чата:", err);
  }
}


// отправка по Enter
document.getElementById("chatMessage").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
