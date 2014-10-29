class AddWidthToCollectionProducts < ActiveRecord::Migration
  def change
    add_column :collection_products, :width, :integer
  end
end
