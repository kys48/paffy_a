# Load the rails application
require File.expand_path('../application', __FILE__)

RAILS_ROOT = "#{File.dirname(__FILE__)}/.." unless defined?(RAILS_ROOT)

FACEBOOK_APP_ID = "293297760830036" # 59
#FACEBOOK_APP_ID = "829842343693080" # 60
FACEBOOK_APP_SECRET = "1f8a9e809d65332fc3f3451333ffebfe" # 59
#FACEBOOK_APP_SECRET = "227191fd1b0d2650fce6d81ff73b96c5" # 60

KAKAO_APP_KEY = "1ae9d43d5ebf03b7634c3ca90ce19f69"
KAKAO_REST_API_KEY = "366a0b3fd99dcec312e97b64963a8c5a"
KAKAO_JS_KEY = "3a2b0cca61e1d991c6d4d4b2297bf822"
KAKAO_ADMIN_KEY = "2915db292287da8e29ee84ecfc04fd57"

LINKPRICE_KEY = "A100513351"
SHOPSTYLE_KEY = "uid7025-24947295-7"

NAVER_API_KEY = "cfe7ee7e4223b26bfb7b9e847983d7bb"

# Initialize the rails application
PaffyA::Application.initialize!




