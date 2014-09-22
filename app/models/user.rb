class User < ActiveRecord::Base
  attr_accessible :email, :password, :profile_id, :user_name, :password_confirmation, :oauth_expires_at, 
  						:oauth_token, :provider, :uid, :img, :user_type, :use_yn, 
  						:facebook_open, :facebook_share, :kakao_story_share,
  						:introduce, :contents, :url
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
	validates_uniqueness_of :profile_id
	validates_uniqueness_of :unique_key

	def self.from_omniauth(auth)
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
		count_user = User.where("(provider='#{auth.provider}' AND uid='#{auth.uid}')
									OR email='#{auth.info.email}'
									OR profile_id='#{auth.provider}_#{auth.uid}'
									OR unique_key='#{auth.info.email}'").count
		user = User.new
		if count_user>0
			user = User.where("(provider='#{auth.provider}' AND uid='#{auth.uid}')
									OR email='#{auth.info.email}'
									OR profile_id='#{auth.provider}_#{auth.uid}'
									OR unique_key='#{auth.info.email}'").first

		else

			user.provider = auth.provider
			user.uid = auth.uid
			user.profile_id = auth.provider+"_"+auth.uid
			user.unique_key = auth.info.email
			user.user_name = auth.info.name
			user.oauth_token = auth.credentials.token
			user.oauth_expires_at = Time.at(auth.credentials.expires_at)
			user.email = auth.info.email
			user.password = '111'
			user.user_type = 'U'
			user.use_yn = 'Y'
			
			# 이미지 저장
			img_original = auth.info.image
			
			if (user.img_file_name==nil||user.img_file_name=="") && img_original
	     
				dataFilePath = "/public/data/user/"
				product_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"
				
				r = open(process_uri(auth.info.image)+"?type=large")
				bytes = r.read
				#tmpimg = Magick::Image.read(img_original).first
				tmpimg = Magick::Image.from_blob(bytes).first
				
				thumbSize = 650
				# 원본 이미지가 썸네일 이미지 사이즈보다 작을경우 원본이미지 사이즈 기준
				if tmpimg.columns>tmpimg.rows
					if thumbSize>tmpimg.columns
						thumbSize = tmpimg.columns
					end
				elsif tmpimg.columns<tmpimg.rows
					if thumbSize>tmpimg.rows
						thumbSize = tmpimg.rows
					end
				else
					if thumbSize>tmpimg.columns
						thumbSize = tmpimg.columns
					end
				end
	     
				# 썸네일 이미지 사이즈,left,top 구하기 (이미지 가로세로 비율 맞춰서)
				ipos = Product.get_resize_fit(thumbSize,tmpimg.columns,tmpimg.rows)
				thumb = tmpimg.resize!(ipos[0],ipos[1])
				bg = Magick::Image.new(thumbSize, thumbSize){
					self.background_color = 'white'
					self.format = 'PNG'
				}
				bg.composite!(thumb, ipos[2], ipos[3], Magick::OverCompositeOp)
				bg.write(RAILS_ROOT+dataFilePath+'original/'+product_file_name)
				
				bg.resize!(220,220)
				bg.write(RAILS_ROOT+dataFilePath+'medium/'+product_file_name)
				
				bg.resize!(75,75)
				bg.write(RAILS_ROOT+dataFilePath+'thumb/'+product_file_name)
				
				user.img_file_name = product_file_name
				user.img_content_type = "image/png"
				user.img_file_size    = 0
	
			end
			user.save!
		end
		
		return user
	end


	def self.from_kakaoauth(auth)
		img_original = auth[:properties][:profile_image]
		profile_id = "kakao_"+auth[:id]
		
=begin
		where("(provider='kakao' AND uid='#{auth[:id]}')
    		OR profile_id='#{profile_id}'
    		OR unique_key='#{profile_id}'").first_or_initialize.tap do |user|
=end    		
    		
		count_user = User.where("(provider='kakao' AND uid='#{auth[:id]}')
							    		OR profile_id='#{profile_id}'
							    		OR unique_key='#{profile_id}'").count
		user = User.new
		if count_user>0
			user = User.where("(provider='kakao' AND uid='#{auth[:id]}')
							    		OR profile_id='#{profile_id}'
							    		OR unique_key='#{profile_id}'").first

		else
    		
			user.provider = auth[:provider]
			user.uid = auth[:id]
			user.user_name = auth[:properties][:nickname]
			#user.oauth_token = auth.credentials.token
			#user.oauth_expires_at = Time.at(auth.credentials.expires_at)
			user.profile_id = profile_id
			user.unique_key = profile_id
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
		end
		return user
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
  def self.addStore(url,name,store_type,use_yn)
    name = name.gsub(/ /,'')

    store_name = domain_name(url)

    if name && name!=""
      store_name = name
    end
    
    user = User.new
    user.profile_id = domain_name(url)
    user.unique_key = url
    user.password = '111'
    user.email = url
    user.user_name = store_name
    user.user_type = 'S'
    user.url = 'http://'+url
    user.use_yn = use_yn
    user.store_type = store_type
    user.save!
    return user
  end
  
  
  def encrypt_password
    if password.present?
      self.passwd_salt = BCrypt::Engine.generate_salt
      self.passwd = BCrypt::Engine.hash_secret(password, passwd_salt)
    end
  end
  
  
	# 스토어 리스트
	def self.storeList(params)
		item_type	= params[:type]||"P"
		store_type	= params[:store_type]||"I"
		
		page			= params[:page]||1
		per_page		= params[:per_page]||8
		order			= params[:order]||"rank ASC, user_id DESC"

		page			= page.to_i
		per_page		= per_page.to_i
		
		str_from = "(
							SELECT A.id AS user_id, A.user_type, A.store_type, IFNULL (B.rank,99999) AS rank
								  , A.profile_id, A.email, A.user_name, A.url, A.img_file_name, A.created_at
							  FROM users A LEFT OUTER JOIN (
											  		SELECT user_id, user_type, store_type, follow_count, product_count, rank
											  		  FROM user_ranks
											  		 WHERE rank_type = 'top_store'
											  		   AND store_type='#{store_type}'
											  ) B ON A.id = B.user_id
							 WHERE A.user_type='S' AND A.use_yn='Y' AND A.store_type='#{store_type}'
							   AND A.id IN (
							   			SELECT user_id
							   			  FROM (SELECT COUNT(id) AS cnt_product,user_id FROM products WHERE store_type='#{store_type}' GROUP BY user_id) C
							   			 WHERE C.cnt_product>=8
							   			 )
						) X "

		stores = User.paginate(page: page, per_page: per_page)
							.select("user_id, user_type, store_type, rank
									, profile_id, email, user_name, url, img_file_name
									, F_COUNT_PRODUCTS(user_id) AS cnt_product
									, F_COUNT_FOLLOWS(user_id, 'follower') AS cnt_follower")
							.from( str_from )
							.where("1=1")
							.order(order)
		
		return stores

  end

  
  
  
  private

  def randomize_file_name
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

