class AddIntroduceContentsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :introduce, :string
    add_column :users, :contents, :text
  end
end
