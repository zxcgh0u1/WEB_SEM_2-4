-- Создаём таблицы для системы учёта волонтёрской активности

-- Волонтёры
CREATE TABLE volunteers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tg_id BIGINT UNIQUE  -- 👈 добавили привязку к Telegram
);


-- Организаторы
CREATE TABLE organizers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Мероприятия
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    max_participants INT,
    organizer_id INT REFERENCES organizers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Участие волонтёров в мероприятиях
CREATE TABLE participation (
    id SERIAL PRIMARY KEY,
    volunteer_id INT REFERENCES volunteers(id) ON DELETE CASCADE,
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'registered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Отчёты об активности
CREATE TABLE activity_reports (
    id SERIAL PRIMARY KEY,
    volunteer_id INT REFERENCES volunteers(id) ON DELETE CASCADE,
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    hours INT,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Заявки от волонтёров на участие в мероприятиях
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    tg_id BIGINT NOT NULL,                -- telegram ID пользователя
    username VARCHAR(100),                -- имя в телеграме (может быть null)
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending / approved / rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

