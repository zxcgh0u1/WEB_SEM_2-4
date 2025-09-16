-- Очистка всех таблиц и сброс ID
TRUNCATE volunteers, organizers, events, participation, activity_reports 
RESTART IDENTITY CASCADE;

-- Волонтёры
INSERT INTO volunteers (name, email, phone)
VALUES 
('Ivan Ivanov', 'ivan@example.com', '89991112233'),
('Anna Smirnova', 'anna@example.com', '89992223344');

-- Организатор
INSERT INTO organizers (name, email, phone)
VALUES 
('City Committee', 'org@example.com', '89993334455');

-- Мероприятие
INSERT INTO events (title, description, date, max_participants, organizer_id)
VALUES
('Subbotnik v parke', 'Cleaning and planting trees', '2025-09-15', 50, 1);

-- Участие (Ivan зарегистрирован, Anna пока нет)
INSERT INTO participation (volunteer_id, event_id, status)
VALUES
(1, 1, 'registered');

-- Отчёт об активности (Ivan отработал 3 часа)
INSERT INTO activity_reports (volunteer_id, event_id, hours, feedback)
VALUES
(1, 1, 3, 'Good job, active participation in cleaning the park');
