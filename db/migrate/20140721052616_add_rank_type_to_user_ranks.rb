class AddRankTypeToUserRanks < ActiveRecord::Migration
  def change
    add_column :user_ranks, :rank_type, :string
  end
end
