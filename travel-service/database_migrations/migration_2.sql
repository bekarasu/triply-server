-- Insert Countries and Cities
-- Migration 2: Adding countries and cities data

-- Insert Countries
INSERT INTO countries (name, code) VALUES
('Italy', 'IT'),
('Turkey', 'TR'),
('Spain', 'ES'),
('France', 'FR'),
('Germany', 'DE');

-- Insert Cities for Italy (country_id = 1)
INSERT INTO cities (name, country_id) VALUES
('Rome', 1),
('Milan', 1),
('Naples', 1),
('Turin', 1),
('Florence', 1),
('Venice', 1);

-- Insert Cities for Turkey (country_id = 2)
INSERT INTO cities (name, country_id) VALUES
('Istanbul', 2),
('Ankara', 2),
('Izmir', 2),
('Bursa', 2),
('Antalya', 2),
('Gaziantep', 2);

-- Insert Cities for Spain (country_id = 3)
INSERT INTO cities (name, country_id) VALUES
('Madrid', 3),
('Barcelona', 3),
('Valencia', 3),
('Seville', 3),
('Zaragoza', 3),
('Malaga', 3);

-- Insert Cities for France (country_id = 4)
INSERT INTO cities (name, country_id) VALUES
('Paris', 4),
('Lyon', 4),
('Marseille', 4),
('Toulouse', 4),
('Nice', 4),
('Bordeaux', 4);

-- Insert Cities for Germany (country_id = 5)
INSERT INTO cities (name, country_id) VALUES
('Berlin', 5),
('Hamburg', 5),
('Munich', 5),
('Cologne', 5),
('Frankfurt', 5),
('Stuttgart', 5);