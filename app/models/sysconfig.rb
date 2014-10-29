class Sysconfig < ActiveRecord::Base
  attr_accessible :config_key, :config_type, :config_value, :use_yn
end
