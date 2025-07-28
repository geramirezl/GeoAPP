-- GeoAPP Database Structure
-- Script para recrear la estructura básica de la base de datos

-- Tabla principal para almacenar las capturas de ubicación
CREATE TABLE captures (
    id BIGSERIAL PRIMARY KEY,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    captured_at TIMESTAMP WITH TIME ZONE,
    device_brand VARCHAR(255),
    device_model VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX index_captures_on_created_at ON captures (created_at);
CREATE INDEX index_captures_on_captured_at ON captures (captured_at);
CREATE INDEX index_captures_on_coordinates ON captures (latitude, longitude);

-- Comentarios para documentar las columnas
COMMENT ON TABLE captures IS 'Tabla para almacenar las ubicaciones capturadas por la aplicación móvil';
COMMENT ON COLUMN captures.id IS 'Identificador único de la captura';
COMMENT ON COLUMN captures.latitude IS 'Latitud de la ubicación (formato decimal)';
COMMENT ON COLUMN captures.longitude IS 'Longitud de la ubicación (formato decimal)';
COMMENT ON COLUMN captures.captured_at IS 'Fecha y hora cuando se capturó la ubicación';
COMMENT ON COLUMN captures.device_brand IS 'Marca del dispositivo (ej: Samsung, Apple)';
COMMENT ON COLUMN captures.device_model IS 'Modelo del dispositivo (ej: Galaxy S21, iPhone 13)';
COMMENT ON COLUMN captures.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN captures.updated_at IS 'Fecha y hora de última actualización';




-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_captures_updated_at 
    BEFORE UPDATE ON captures 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
