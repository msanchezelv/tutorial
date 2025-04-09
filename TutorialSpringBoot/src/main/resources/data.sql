INSERT INTO category(name) VALUES ('Eurogames');
INSERT INTO category(name) VALUES ('Ameritrash');
INSERT INTO category(name) VALUES ('Familiar');

INSERT INTO author(name, nationality) VALUES ('Alan R. Moon', 'US');
INSERT INTO author(name, nationality) VALUES ('Vital Lacerda', 'PT');
INSERT INTO author(name, nationality) VALUES ('Simone Luciani', 'IT');
INSERT INTO author(name, nationality) VALUES ('Perepau Llistosella', 'ES');
INSERT INTO author(name, nationality) VALUES ('Michael Kiesling', 'DE');
INSERT INTO author(name, nationality) VALUES ('Phil Walker-Harding', 'US');

INSERT INTO game(title, age, category_id, author_id) VALUES ('On Mars', '14', 1, 2);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Aventureros al tren', '8', 1, 1);
INSERT INTO game(title, age, category_id, author_id) VALUES ('1920: Wall Street', '12', 1, 4);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Barrage', '14', 1, 2);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Los viajes de Marco Polo', '12', 1, 2);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Azul', '8', 2, 5);

INSERT INTO client(name) VALUES ('Marina Sanchez');
INSERT INTO client(name) VALUES ('Carlos Garcia');
INSERT INTO client(name) VALUES ('Daniel Vicente');
INSERT INTO client(name) VALUES ('Arnau Morales');

INSERT INTO loan(game, client, loan_date, return_date) VALUES (1, 1, '2025-04-01', '2025-04-08');
INSERT INTO loan(game, client, loan_date, return_date) VALUES (2, 4, '2025-03-01', '2025-03-15');
INSERT INTO loan(game, client,  loan_date, return_date) VALUES (4, 4, '2024-11-22', '2024-11-29');
INSERT INTO loan(game, client, loan_date, return_date) VALUES (1, 2, '2024-09-25', '2024-10-07');
INSERT INTO loan(game, client,  loan_date, return_date) VALUES (6, 3, '2024-07-11', '2024-08-20');
