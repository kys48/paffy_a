class AddViewMainToCollections < ActiveRecord::Migration
  def change
    add_column :collections, :view_main, :string
  end
end
