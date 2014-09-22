class AddSnsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :facebook_open, :string
    add_column :users, :facebook_share, :string
    add_column :users, :kakao_store_share, :string
  end
end
