class AddAttachmentImgToCollections < ActiveRecord::Migration
  def self.up
    change_table :collections do |t|
      t.attachment :img
    end
  end

  def self.down
    drop_attached_file :collections, :img
  end
end
