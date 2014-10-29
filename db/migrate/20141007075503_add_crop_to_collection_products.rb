class AddCropToCollectionProducts < ActiveRecord::Migration
  def change
    add_column :collection_products, :croptype, :string
    add_column :collection_products, :croppoints, :string
    add_column :collection_products, :cropheight, :string
    add_column :collection_products, :cropimg, :string
  end
end
