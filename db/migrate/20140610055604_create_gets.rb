class CreateGets < ActiveRecord::Migration
  def change
    create_table :gets do |t|
      t.string :get_type
      t.string :item_type
      t.integer :ref_id
      t.string :user_id

      t.timestamps
    end
  end
end
