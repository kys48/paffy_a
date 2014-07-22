class AddStoreToUsers < ActiveRecord::Migration
  def change
    add_column :users, :user_type, :string
    add_column :users, :url, :string
  end
end
