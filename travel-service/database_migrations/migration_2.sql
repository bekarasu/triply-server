ALTER TABLE countries ADD COLUMN iso2 VARCHAR(5);
ALTER TABLE countries ADD COLUMN iso3 VARCHAR(5);
ALTER TABLE countries DROP COLUMN code;
ALTER TABLE countries ADD CONSTRAINT unique_iso2 UNIQUE(iso2);
ALTER TABLE countries ADD CONSTRAINT unique_iso3 UNIQUE(iso3);
CREATE INDEX idx_countries_name ON countries(name);

ALTER TABLE cities ADD COLUMN latitude DECIMAL(9,6);
ALTER TABLE cities ADD COLUMN longitude DECIMAL(9,6);
ALTER TABLE cities ADD COLUMN population INT;
ALTER TABLE cities ADD COLUMN city_ascii VARCHAR(100);
ALTER TABLE cities ADD COLUMN admin_name VARCHAR(100);
ALTER TABLE cities ADD COLUMN capital VARCHAR(10);
CREATE INDEX idx_cities_admin_name ON cities(admin_name);
CREATE INDEX idx_cities_ascii ON cities(city_ascii);

ALTER TABLE countries ALTER COLUMN id DROP IDENTITY;
ALTER TABLE cities ALTER COLUMN id DROP IDENTITY;
