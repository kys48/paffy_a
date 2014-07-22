class CreateCates < ActiveRecord::Migration
  def change
    create_table :cates do |t|
      t.string :p_cd
      t.string :c_cd
      t.string :c_name
      t.string :use_yn

      t.timestamps
    end
  end
end
