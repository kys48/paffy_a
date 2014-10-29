class AddFileUseYnRemoteIpToBoardContents < ActiveRecord::Migration
  def change
    add_column :board_contents, :use_yn, :string
    add_column :board_contents, :file_name, :string
    add_column :board_contents, :content_type, :string
    add_column :board_contents, :file_size, :integer
    add_column :board_contents, :remote_ip, :string
  end
end
