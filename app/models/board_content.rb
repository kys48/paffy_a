class BoardContent < ActiveRecord::Base
  attr_accessible :contents, :hit_no, :reg_id, :reg_name, :reg_passwd, :subject
end
