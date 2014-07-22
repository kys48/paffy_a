class AddMerchantToProducts < ActiveRecord::Migration
  def change
    add_column :products, :merchant, :string
  end
end
