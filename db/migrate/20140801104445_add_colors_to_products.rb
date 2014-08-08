class AddColorsToProducts < ActiveRecord::Migration
  def change
    add_column :products, :color_code_s, :string
    add_column :products, :color_code_o, :string
  end
end
