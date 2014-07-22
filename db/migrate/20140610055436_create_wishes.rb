class CreateWishes < ActiveRecord::Migration
  def change
    create_table :wishes do |t|
      t.string :item_type
      t.integer :ref_id
      t.string :user_id
      t.string :subject
      t.text :contents

      t.timestamps
    end
  end
end
