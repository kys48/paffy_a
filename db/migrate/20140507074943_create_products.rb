class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|
      t.string :subject
      t.decimal :price
      t.string :price_type
      t.string :url

      t.timestamps
    end
  end
end
