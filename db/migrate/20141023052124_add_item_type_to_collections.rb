class AddItemTypeToCollections < ActiveRecord::Migration
  def change
    add_column :collections, :item_type, :string
  end
end
