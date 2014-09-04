class AddUseYnToCollections < ActiveRecord::Migration
  def change
    add_column :collections, :use_yn, :string
  end
end
