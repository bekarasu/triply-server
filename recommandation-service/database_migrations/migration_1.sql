CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_name VARCHAR(255) NOT NULL,
    city_id VARCHAR(36) NOT NULL,
    recommendation_type VARCHAR(30) NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_recommendations_type ON recommendations(recommendation_type);

CREATE INDEX idx_recommendations_city_id ON recommendations(city_id);

CREATE INDEX idx_recommendations_score ON recommendations(score);

CREATE INDEX idx_recommendations_location ON recommendations USING GIST (point(longitude, latitude));

CREATE TABLE user_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(40) NOT NULL,
    trip_id VARCHAR(40) NOT NULL,
    recommend_id VARCHAR(40) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_recommendations_user_id ON user_recommendations(user_id);

CREATE INDEX idx_recommendations_trip_id ON user_recommendations(trip_id);