class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :profile_id
      t.string :password
      t.string :password_salt
      t.string :email
      t.string :user_name
      t.string :provider
      t.string :uid
      t.string :fb_name
      t.string :oauth_token
      t.string :oauth_expires_at

      t.timestamps
    end
  end
end
