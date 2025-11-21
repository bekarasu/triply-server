ALTER TABLE user_routes RENAME TO user_destinations;

ALTER INDEX idx_user_routes_user_id RENAME TO idx_user_destinations_user_id;
ALTER INDEX idx_user_routes_trip_id RENAME TO idx_user_destinations_trip_id;
ALTER INDEX idx_user_routes_city_id RENAME TO idx_user_destinations_city_id;
ALTER INDEX idx_user_routes_location RENAME TO idx_user_destinations_location;

ALTER TABLE user_destinations DROP COLUMN latitude;
ALTER TABLE user_destinations DROP COLUMN longitude;
ALTER TABLE user_destinations DROP COLUMN route_data;

ALTER TABLE user_destinations DROP COLUMN city_id;
DROP INDEX idx_user_destinations_city_id;
ALTER TABLE user_destinations ADD COLUMN city_id INT4;
CREATE INDEX idx_user_destinations_city_id ON user_destinations(city_id);

ALTER TABLE user_destinations ADD COLUMN duration SMALLINT;
ALTER TABLE user_destinations ADD COLUMN budget INTEGER;
