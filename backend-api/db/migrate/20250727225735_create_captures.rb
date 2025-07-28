class CreateCaptures < ActiveRecord::Migration[8.0]
  def change
    create_table :captures do |t|
      t.decimal :latitude
      t.decimal :longitude
      t.datetime :captured_at
      t.string :device_brand
      t.string :device_model

      t.timestamps
    end
  end
end
