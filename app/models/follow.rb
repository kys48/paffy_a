class Follow < ActiveRecord::Base
  attr_accessible :follow_id, :follow_type, :user_id
end
