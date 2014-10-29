class CreateBoardInfos < ActiveRecord::Migration
  def change
    create_table :board_infos do |t|
      t.string :bbs_name
      t.string :bbs_type
      t.string :subject
      t.string :file_yn

      t.timestamps
    end
  end
end
