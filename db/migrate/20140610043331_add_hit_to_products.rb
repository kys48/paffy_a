class AddHitToProducts < ActiveRecord::Migration
  def change
    add_column :products, :hit, :integer
  end
end
