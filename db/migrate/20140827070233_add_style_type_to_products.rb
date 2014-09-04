class AddStyleTypeToProducts < ActiveRecord::Migration
  def change
    add_column :products, :style_type, :string
  end
end
