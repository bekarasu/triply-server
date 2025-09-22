-- Text Search Optimization Migration
-- This migration adds various indexes to optimize text search for cities and countries

-- 1. GIN indexes for full-text search (PostgreSQL specific)
-- Create tsvector columns for full-text search
ALTER TABLE cities ADD COLUMN search_vector tsvector;
ALTER TABLE countries ADD COLUMN search_vector tsvector;

-- Create function to update search vectors
CREATE OR REPLACE FUNCTION update_cities_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.name, '') || ' ' || 
    COALESCE(NEW.city_ascii, '') || ' ' || 
    COALESCE(NEW.admin_name, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_countries_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.name, '') || ' ' || 
    COALESCE(NEW.iso2, '') || ' ' || 
    COALESCE(NEW.iso3, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update search vectors
CREATE TRIGGER cities_search_vector_update 
  BEFORE INSERT OR UPDATE ON cities
  FOR EACH ROW EXECUTE FUNCTION update_cities_search_vector();

CREATE TRIGGER countries_search_vector_update 
  BEFORE INSERT OR UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_countries_search_vector();

-- Update existing records
UPDATE cities SET search_vector = to_tsvector('english', 
  COALESCE(name, '') || ' ' || 
  COALESCE(city_ascii, '') || ' ' || 
  COALESCE(admin_name, '')
);

UPDATE countries SET search_vector = to_tsvector('english', 
  COALESCE(name, '') || ' ' || 
  COALESCE(iso2, '') || ' ' || 
  COALESCE(iso3, '')
);

-- 2. GIN indexes for full-text search
CREATE INDEX idx_cities_search_vector ON cities USING GIN(search_vector);
CREATE INDEX idx_countries_search_vector ON countries USING GIN(search_vector);

-- 3. B-tree indexes for exact and prefix matching
CREATE INDEX idx_cities_name_lower ON cities(LOWER(name));
CREATE INDEX idx_cities_ascii_lower ON cities(LOWER(city_ascii));
CREATE INDEX idx_cities_admin_lower ON cities(LOWER(admin_name));
CREATE INDEX idx_countries_name_lower ON countries(LOWER(name));

-- 4. Trigram indexes for similarity search (requires pg_trgm extension)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Trigram indexes for fuzzy/partial matching
CREATE INDEX idx_cities_name_trgm ON cities USING GIN(name gin_trgm_ops);
CREATE INDEX idx_cities_ascii_trgm ON cities USING GIN(city_ascii gin_trgm_ops);
CREATE INDEX idx_cities_admin_trgm ON cities USING GIN(admin_name gin_trgm_ops);
CREATE INDEX idx_countries_name_trgm ON countries USING GIN(name gin_trgm_ops);

-- 5. Composite indexes for common search patterns
CREATE INDEX idx_cities_country_name ON cities(country_id, LOWER(name));
CREATE INDEX idx_cities_population_name ON cities(population DESC, LOWER(name)) WHERE population IS NOT NULL;

-- 6. Partial indexes for active records only
CREATE INDEX idx_cities_active_name ON cities(LOWER(name)) WHERE deleted_at IS NULL;
CREATE INDEX idx_cities_active_ascii ON cities(LOWER(city_ascii)) WHERE deleted_at IS NULL;
CREATE INDEX idx_countries_active_name ON countries(LOWER(name)) WHERE deleted_at IS NULL;

-- 7. Add statistics for better query planning
ANALYZE cities;
ANALYZE countries;
