#encoding: utf-8

class UserItem < ActiveRecord::Base
  attr_accessible :user_id, :collection_id
  
end
