OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, :scope => 'email,user_birthday,read_stream', :display => 'popup'
  #provider :facebook, '293297760830036', '1f8a9e809d65332fc3f3451333ffebfe'
  #provider :facebook, '293297760830036', '1f8a9e809d65332fc3f3451333ffebfe', :client_options => {:ssl => {:ca_path => "/etc/ssl/certs"}}
end