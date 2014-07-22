class CreateBoardContents < ActiveRecord::Migration
  def change
    create_table :board_contents do |t|
      t.string :subject
      t.text :contents
      t.decimal :hit_no
      t.string :reg_id
      t.string :reg_name
      t.string :reg_passwd

      t.timestamps
    end
  end
end
