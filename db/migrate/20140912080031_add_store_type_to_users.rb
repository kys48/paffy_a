class AddStoreTypeToUsers < ActiveRecord::Migration
  def change
    add_column :users, :store_type, :string
  end
end
