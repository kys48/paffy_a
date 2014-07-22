class CreateCollections < ActiveRecord::Migration
  def change
    create_table :collections do |t|
      t.string :user_id
      t.text :contents

      t.timestamps
    end
  end
end
