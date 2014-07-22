class AddUseYnToProducts < ActiveRecord::Migration
  def change
    add_column :products, :use_yn, :string
  end
end
