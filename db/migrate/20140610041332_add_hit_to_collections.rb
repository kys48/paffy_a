class AddHitToCollections < ActiveRecord::Migration
  def change
    add_column :collections, :hit, :integer
  end
end
