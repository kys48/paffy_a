class User < ActiveRecord::Base
  attr_accessible :email, :password, :profile_id, :user_name, :password_confirmation, :oauth_expires_at, :oauth_token, :provider, :uid, :img, :user_type, :use_yn
  attr_accessor :password
  before_save :encrypt_password
  
  has_attached_file :img,
                    :styles => {
                      :medium => "220x220>", 
                      :thumb => "75x75>" 
                    },
                    :default_url => "/imgs/:style/missing.png",
                    #:path => ":rails_root/public/:attachment/:id/:style/:basename.:extension",
                    #:url => "/:attachment/:id/:style/:basename.:extension"
                    :path => ":rails_root/public/data/user/:style/:basename.:extension",
                    :url => "/data/user/:style/:basename.:extension"
  
  before_post_process :randomize_file_name
  validates_attachment_size :img, :less_than => 10.megabytes
  validates_attachment_content_type :img, :content_type => /\Aimage\/.*\Z/
  
  validates_confirmation_of :password
  validates_presence_of :password, :on => :create
  validates_presence_of :email
  validates_uniqueness_of :email

  def self.from_omniauth(auth)
    #where(auth.slice(:provider, :uid)).first_or_initialize.tap do |user|
    where("(provider='"+auth.provider+"' AND uid='"+auth.uid+"') OR email='"+auth.info.email+"'").first_or_initialize.tap do |user|
=begin
  auth 값
  auth.credentials.expires
  auth.credentials.expires_at
  auth.credentials.token
  auth.extra.raw_info.birthday
  auth.extra.raw_info.email
  auth.extra.raw_info.first_name
  auth.extra.raw_info.gender
  auth.extra.raw_info.id
  auth.extra.raw_info.last_name
  auth.extra.raw_info.link
  auth.extra.raw_info.locale
  auth.extra.raw_info.name
  auth.extra.raw_info.timezone
  auth.extra.raw_info.updated_time
  auth.extra.raw_info.verified
  auth.info.email
  auth.info.first_name
  auth.info.image
  auth.info.last_name
  auth.info.name
  auth.info.urls.Facebook
  auth.info.verified
  auth.provider
  auth.uid
=end
      
      user.provider = auth.provider
      user.uid = auth.uid
      user.user_name = auth.info.name
      user.oauth_token = auth.credentials.token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
      user.email = auth.info.email
      user.password = '111'
      user.user_type = 'U'
      user.use_yn = 'Y'
      
      # 이미지 저장
      img_original = auth.info.image
      
      if img_original
        
        dataFilePath = "/public/data/user/"
        product_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"

        r = open(process_uri(auth.info.image)+"?type=large")
        bytes = r.read
        #tmpimg = Magick::Image.read(img_original).first
        tmpimg = Magick::Image.from_blob(bytes).first
        tmpimg.write(RAILS_ROOT+dataFilePath+'original/'+product_file_name)
    
        tmpimg.resize!(220,220)
        tmpimg.write(RAILS_ROOT+dataFilePath+'medium/'+product_file_name)
    
        tmpimg.resize!(75,75)
        tmpimg.write(RAILS_ROOT+dataFilePath+'thumb/'+product_file_name)
        
        user.img_file_name = product_file_name
        user.img_content_type = "image/png"
        user.img_file_size    = 0
        
      end
      
      user.save!
    end
  end
  
  def self.from_kakaoauth(auth)
    img_original = auth[:properties][:profile_image]

    profile_id = "kakao_"+auth[:id]
    
    where(provider: "kakao", email: profile_id).first_or_initialize.tap do |user|
      user.provider = auth[:provider]
      user.uid = auth[:id]
      user.user_name = auth[:properties][:nickname]
      #user.oauth_token = auth.credentials.token
      #user.oauth_expires_at = Time.at(auth.credentials.expires_at)
      user.profile_id = profile_id
      user.email = profile_id
      user.password = '111'
      user.user_type = 'U'
      user.use_yn = 'Y'
      
      # 이미지 저장
      if img_original
        
        dataFilePath = "/public/data/user/"
        product_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"
    
        #tmpimg = Magick::Image.read(img_original).first
        r = open(img_original)
        bytes = r.read
        tmpimg = Magick::Image.from_blob(bytes).first
        tmpimg.write(RAILS_ROOT+dataFilePath+'original/'+product_file_name)

        tmpimg.resize!(220,220)
        tmpimg.write(RAILS_ROOT+dataFilePath+'medium/'+product_file_name)

        tmpimg.resize!(75,75)
        tmpimg.write(RAILS_ROOT+dataFilePath+'thumb/'+product_file_name)

        user.img_file_name = product_file_name
        user.img_content_type = "image/png"
        user.img_file_size    = 0
      end

      user.save!
puts("start 5 : #{Time.zone.now}")      
    end
  end
  
  def self.authenticate(email, password)
    user = find_by_email(email)
    if user && user.passwd == BCrypt::Engine.hash_secret(password, user.passwd_salt)
      user
    else
      nil
    end
  end
  
  # 스토어 저장
  def self.addStore(url,name)
    name = name.gsub(/ /,'')

    store_name = domain_name(url)

    if name && name!=""
      store_name = name
    end
    
    user = User.new
    user.profile_id = domain_name(url)
    user.password = '111'
    user.email = url
    user.user_name = store_name
    user.user_type = 'S'
    user.url = 'http://'+url
    user.use_yn = 'Y'
    user.save!
    return user
  end
  
  
  def encrypt_password
    if password.present?
      self.passwd_salt = BCrypt::Engine.generate_salt
      self.passwd = BCrypt::Engine.hash_secret(password, passwd_salt)
    end
  end
  
  private

  def self.randomize_file_name
    #milisec = DateTime.now.strftime("%s")
    extension = File.extname(img_file_name).downcase
    #self.img.instance_write(:file_name, "#{milisec}#{extension}")
    self.img.instance_write(:file_name, "#{ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)}#{extension}")
  end

  def self.process_uri(uri)
    avatar_url = URI.parse(uri)
    avatar_url.scheme = 'https'
    avatar_url.to_s
  end
  
  def self.domain_name(url)
    domain = url.split(".")
    if domain.count > 2
      domain[1]
    else 
      domain_names = domain[0].split("/")
      if domain_names.count>2
        domain[0].split("/")[2]
      else
        domain[0]
      end    
    end
  end
  
end

