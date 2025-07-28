class Capture < ApplicationRecord
    #Validaciones
    validates :latitude, presence: true, numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
    validates :longitude, presence: true, numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}
    validates :captured_at, presence: true
    validates :device_brand, length: { maximum: 100 }, allow_blank: true
    validates :device_model, length: { maximum: 100 }, allow_blank: true
end
