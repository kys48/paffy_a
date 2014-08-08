# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20140808052630) do

  create_table "board_contents", :force => true do |t|
    t.string   "subject"
    t.text     "contents"
    t.decimal  "hit_no",     :precision => 10, :scale => 0
    t.string   "reg_id"
    t.string   "reg_name"
    t.string   "reg_passwd"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cates", :force => true do |t|
    t.string   "p_cd"
    t.string   "c_cd"
    t.string   "c_name"
    t.string   "use_yn"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "collection_products", :force => true do |t|
    t.integer  "collection_id"
    t.integer  "product_id"
    t.string   "white_bck"
    t.string   "flip"
    t.string   "flop"
    t.integer  "height"
    t.string   "top"
    t.string   "left"
    t.string   "cssleft"
    t.string   "csstop"
    t.integer  "zindex"
    t.float    "rotate"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
    t.string   "caption"
  end

  create_table "collections", :force => true do |t|
    t.string   "user_id"
    t.string   "collection_type"
    t.string   "subject"
    t.text     "contents"
    t.integer  "hit"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
    t.string   "img_file_name"
    t.string   "img_content_type"
    t.integer  "img_file_size"
    t.datetime "img_updated_at"
  end

  create_table "follows", :force => true do |t|
    t.integer  "user_id"
    t.integer  "follow_id"
    t.string   "follow_type"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "gets", :force => true do |t|
    t.string   "get_type"
    t.string   "item_type"
    t.integer  "ref_id"
    t.string   "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "products", :force => true do |t|
    t.string   "cate_code"
    t.string   "color_code_o",     :limit => 10
    t.string   "color_code_s",     :limit => 10
    t.string   "subject",          :limit => 1000
    t.string   "price",            :limit => 20
    t.string   "sale_price",       :limit => 20
    t.string   "price_type"
    t.string   "url",              :limit => 4000
    t.integer  "hit"
    t.string   "user_id"
    t.string   "use_yn"
    t.string   "merchant"
    t.string   "img_file_name"
    t.string   "img_content_type"
    t.integer  "img_file_size"
    t.datetime "img_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "category1",        :limit => 500
    t.string   "category2",        :limit => 500
    t.string   "store_type"
  end

  create_table "user_items", :force => true do |t|
    t.integer  "user_id"
    t.integer  "ref_id"
    t.string   "item_type"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "user_ranks", :force => true do |t|
    t.string   "rank_type"
    t.string   "user_type"
    t.string   "store_type"
    t.integer  "user_id"
    t.integer  "rank"
    t.integer  "follow_count"
    t.integer  "product_count"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "profile_id"
    t.string   "passwd"
    t.string   "email"
    t.string   "user_name"
    t.string   "user_type",        :limit => 10
    t.string   "provider"
    t.string   "uid"
    t.string   "fb_name"
    t.string   "oauth_token"
    t.string   "oauth_expires_at"
    t.string   "passwd_salt"
    t.string   "url",              :limit => 500
    t.string   "use_yn",           :limit => 2
    t.string   "img_file_name"
    t.string   "img_content_type"
    t.integer  "img_file_size"
    t.datetime "img_updated_at"
    t.datetime "created_at",                      :null => false
    t.datetime "updated_at",                      :null => false
  end

  create_table "wishes", :force => true do |t|
    t.string   "item_type"
    t.integer  "ref_id"
    t.string   "user_id"
    t.string   "subject"
    t.text     "contents"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
