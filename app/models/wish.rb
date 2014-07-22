class Wish < ActiveRecord::Base
  attr_accessible :contents, :item_type, :ref_id, :subject, :user_id
end
