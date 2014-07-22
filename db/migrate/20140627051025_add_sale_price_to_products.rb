class AddSalePriceToProducts < ActiveRecord::Migration
  def change
    add_column :products, :sale_price, :string
  end
end
