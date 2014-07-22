class AddAttachmentImgToProducts < ActiveRecord::Migration
  def self.up
    change_table :products do |t|

      t.attachment :img

    end
  end

  def self.down

    drop_attached_file :products, :img

  end
end
