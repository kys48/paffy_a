class AddStoreTypeToProducts < ActiveRecord::Migration
  def change
    add_column :products, :store_type, :string
  end
end
