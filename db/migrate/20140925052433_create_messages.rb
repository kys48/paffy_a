class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :user_id
      t.string :msg_type
      t.string :ref_user_id
      t.string :ref_id
      t.string :ref_url
      t.string :read_yn
      t.text :contents

      t.timestamps
    end
  end
end
