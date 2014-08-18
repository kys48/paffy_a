class CreateBoardComments < ActiveRecord::Migration
  def change
    create_table :board_comments do |t|
      t.string :comment_type
      t.integer :ref_id
      t.text :contents
      t.string :reg_id

      t.timestamps
    end
  end
end
