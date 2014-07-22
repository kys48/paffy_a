class CreateUserItems < ActiveRecord::Migration
  def change
    create_table :user_items do |t|
      t.integer :user_id
      t.integer :ref_id
      t.string :item_type

      t.timestamps
    end
  end
end
