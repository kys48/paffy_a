class AddBbsIdToBoardContents < ActiveRecord::Migration
  def change
    add_column :board_contents, :bbs_id, :integer
  end
end
