class AddUniqueKeyToUsers < ActiveRecord::Migration
  def change
    add_column :users, :unique_key, :string
  end
end
