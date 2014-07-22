class CreateUserRanks < ActiveRecord::Migration
  def change
    create_table :user_ranks do |t|
      t.string :user_type
      t.string :store_type
      t.integer :user_id
      t.integer :rank
      t.integer :follow_count
      t.integer :product_count

      t.timestamps
    end
  end
end
