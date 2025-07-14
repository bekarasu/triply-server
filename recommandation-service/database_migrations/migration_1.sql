CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    trip_id VARCHAR(255) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    reason TEXT,
    recommendation_type VARCHAR(255) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on user_id for better query performance
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);

-- Create an index on trip_id for better query performance
CREATE INDEX idx_recommendations_trip_id ON recommendations(trip_id);

-- Create an index on recommendation_type for filtering
CREATE INDEX idx_recommendations_type ON recommendations(recommendation_type);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recommendations_updated_at
    BEFORE UPDATE ON recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();