class AddUseYnToUsers < ActiveRecord::Migration
  def change
    add_column :users, :use_yn, :string
  end
end
