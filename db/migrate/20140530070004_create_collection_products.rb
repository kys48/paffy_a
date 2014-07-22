class CreateCollectionProducts < ActiveRecord::Migration
  def change
    create_table :collection_products do |t|
      t.integer :collection_id
      t.integer :product_id
      t.string :white_bck
      t.string :flip
      t.string :flop
      t.integer :height
      t.string :top
      t.string :left
      t.string :cssleft
      t.string :csstop
      t.integer :zindex
      t.float :rotate

      t.timestamps
    end
  end
end
