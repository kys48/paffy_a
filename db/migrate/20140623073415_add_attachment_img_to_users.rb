class AddAttachmentImgToUsers < ActiveRecord::Migration
  def self.up
    change_table :users do |t|
      t.attachment :img
    end
  end

  def self.down
    drop_attached_file :users, :img
  end
end
