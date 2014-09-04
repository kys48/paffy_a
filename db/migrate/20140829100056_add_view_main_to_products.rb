class AddViewMainToProducts < ActiveRecord::Migration
  def change
    add_column :products, :view_main, :string
  end
end
