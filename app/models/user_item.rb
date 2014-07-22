#encoding: utf-8

class UserItem < ActiveRecord::Base
  attr_accessible :item_type, :ref_id, :user_id
  
end
