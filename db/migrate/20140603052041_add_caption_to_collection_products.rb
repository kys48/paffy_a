class AddCaptionToCollectionProducts < ActiveRecord::Migration
  def change
    add_column :collection_products, :caption, :string
  end
end
