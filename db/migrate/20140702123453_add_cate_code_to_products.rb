class AddCateCodeToProducts < ActiveRecord::Migration
  def change
    add_column :products, :cate_code, :string
  end
end
