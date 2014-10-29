class CreateSysconfigs < ActiveRecord::Migration
  def change
    create_table :sysconfigs do |t|
      t.string :config_type
      t.string :config_key
      t.string :config_value
      t.string :use_yn

      t.timestamps
    end
  end
end
