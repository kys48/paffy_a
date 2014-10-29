#encoding: utf-8

require 'shopsense'
require 'json'
require 'open-uri'

include ApplicationHelper

class Product < ActiveRecord::Base
  attr_accessible :cate_code, :subject, :price, :sale_price, :price_type, :url, :hit, :user_id,
                  :use_yn, :merchant, :cate_code, :img, :style_type
                  
  has_many :collection_products, dependent: :destroy
  
  has_attached_file :img,
                    #:styles => {
                    #  :removebg => "650x650>",
                    #  :medium => "220x220>", 
                    #  :thumb => "75x75>" 
                    #},
                    :default_url => "/imgs/:style/missing.png",
                    #:path => ":rails_root/public/:attachment/:id/:style/:basename.:extension",
                    #:url => "/:attachment/:id/:style/:basename.:extension"
                    :path => ":rails_root/public/data/product/:style/:basename.:extension",
                    :url => "/data/product/:style/:basename.:extension"
                    
  #before_create :randomize_file_name
  before_post_process :randomize_file_name
  
  validates_attachment_size :img, :less_than => 10.megabytes
  #validates_attachment_content_type :img, :content_type => ['image/jpeg', 'image/png', 'image/jpg']
  validates_attachment_content_type :img, :content_type => /\Aimage\/.*\Z/


  # 엑셀파일에서 상품 insert
  def self.import(file,store_id)
    spreadsheet = open_spreadsheet(file)
    #header = spreadsheet.row(3)
    header = ["subject","url","img_url","price","category","com","brand","model","product_id"]
puts("start!")
    (4..spreadsheet.last_row).each do |i|
puts("[i:"+i.to_s+"]")

      row = Hash[[header, spreadsheet.row(i)].transpose]

      product = find_by_url(row["url"]) || new
      product.subject = row["subject"]
      product.price = row["price"]
      product.price_type = "KRW"
      product.url = row["url"]
      product.user_id = store_id
      product.merchant = ApplicationHelper.domain_name(row["url"])
      product.hit = 1
      img_url = row["img_url"]
      
      # 이미지 저장
      if img_url
        dataFilePath = "/public/data/product/"
        product_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"

        r = open(img_url)
        bytes = r.read
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
        ipos = ApplicationHelper.get_resize_fit(thumbSize,tmpimg.columns,tmpimg.rows)
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
        
        product.img_file_name = product_file_name
        product.img_content_type = "image/png"
        product.img_file_size    = 0
      end
      
      #product.attributes = row.to_hash.slice(*accessible_attributes)
      #product.attributes = row.to_hash.slice(*Product.accessible_attributes)
      product.save!
    end
puts("Complete!")
  end
  
  
  # 엑셀파일에서  상품 카테고리 update
  def self.category_update(file)
    spreadsheet = open_spreadsheet(file)
    #header = spreadsheet.row(3)
    header = ["id","cate_code"]
puts("start!")
    (2..spreadsheet.last_row).each do |i|
puts("[i:"+i.to_s+"]")
      row = Hash[[header, spreadsheet.row(i)].transpose]

      #product = find_by_id(row["id"]) || new
      
      product = Product.find(row["id"]) || new
      product.cate_code = row["cate_code"]
      product.save!
    end
puts("Complete!")
  end
  
  # 엑셀파일형식 체크
  def self.open_spreadsheet(file)
    case File.extname(file.original_filename)
    when ".csv" then Roo::Csv.new(file.path, nil, :ignore)
    when ".xls" then Roo::Excel.new(file.path, nil, :ignore)
    when ".xlsx" then Roo::Excelx.new(file.path, nil, :ignore)
    else raise "알려지지 않은 파일형식입니다: #{file.original_filename}"
    end
  end
  
  # shopstyle 상품상세정보 API
  def self.getItemApi(id,session_user_id)
    product_url = 'http://api.shopstyle.com/api/v2/products/'+id+'?pid=uid7025-24947295-7'

    img_style = "Original"

    r = JSON.load(open(product_url))
    itemData = JSON.parse(r.to_json)
    
    img_url = itemData["image"]["sizes"][img_style]["url"]
    store_name = itemData["retailer"]["name"]
    profile_id = store_name.gsub(/ /,'')
    profile_id = profile_id.gsub(/\'/,'’') 
    profile_id = profile_id.gsub(/&/,'＆')
    profile_id = profile_id.gsub(/\./,'·')
    
    # 스토어 확인
    cnt_store1 = User.where(profile_id: profile_id, user_type: 'S').count
    cnt_store2 = User.where(email: profile_id, user_type: 'S').count
    cnt_store3 = User.where(unique_key: profile_id).count
    cnt_store4 = User.where(profile_id: profile_id).count
    
    if cnt_store1>0
      store = User.where(profile_id: profile_id, user_type: 'S').first
    elsif cnt_store2>0
      store = User.where(email: profile_id, user_type: 'S').first
    elsif cnt_store3>0
      store = User.where(unique_key: profile_id).first
    elsif cnt_store4>0
      store = User.where(profile_id: profile_id).first
    else
      store = User.addStore(profile_id,profile_id,'F','Y')
    end
    
    product = Product.new
    
    # 이미지 저장
    product_file_name = ""
    product_content_type = ""
    if img_url
      dataFilePath = "/public/data/product/"
      
      product_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"
      product_content_type = "image/png"

      #r = open(URI.parse(img_url))
      r = open(img_url)
      bytes = r.read
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
      ipos = ApplicationHelper.get_resize_fit(thumbSize,tmpimg.columns,tmpimg.rows)
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

      # 이미지 배경제거 (remove_bg.bat 원본디렉토리 원본이미지 target디렉토리 배경제거비율)
      #%x{remove_bg.bat #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
      %x{sh remove_bg #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}

      # 이미지 대표색상코드 추출
      colors = ApplicationHelper.get_product_color(product_file_name)
      product.color_code_o = colors[0] 
      product.color_code_s = colors[1]

    end
    
    product.subject = itemData["name"]
    product.price = itemData["price"]
    product.price_type = itemData["currency"]
    product.url = itemData["clickUrl"]
    product.img_file_name = product_file_name
    product.img_content_type = product_content_type
    product.img_file_size = 0
    product.hit = 1
    #product.user_id = session_user_id
    product.user_id = store.id
    product.sale_price = itemData["salePrice"]||0
    product.use_yn = "Y"
    product.merchant = store.profile_id
    product.store_type = "F"
    #product.merchant = ApplicationHelper.domain_name(itemData["clickUrl"])

    product.save!

    product = Product.where(url: itemData["clickUrl"]).first
    
    

    # 스토어 상품 연결 정보 저장
    cnt_store_item = UserItem.where(user_id: store.id, ref_id: product.id).count
    if cnt_store_item==0
      store_item = UserItem.new
      store_item.user_id = store.id
      store_item.ref_id = product.id
      store_item.item_type = 'P'
      store_item.save!
    end
    

    return product
    
  end

  
  # shopstyle 상품list API
  def self.getItemListApi(params)
    products = []
    product_list = []
    
    search_key  = params[:search_key]||""
    page        = params[:page]||1
    per_page    = params[:per_page]||8
    cate_code   = params[:cate_code]||""
    img_style   = params[:img_style]||"Original"
    save_yn     = params[:save_yn]||""
    store_type		= params[:store_type]||"F"
    style_type		= params[:style_type]||"P"

    page = page.to_i
    per_page = per_page.to_i

    # a search has been performed
    client = Shopsense::API.new({'partner_id' => 'uid7025-24947295-7'})
    response = client.search(search_key,((page-1)*per_page),per_page);

    metadata = JSON.parse(response)["metadata"]
    raw_products = JSON.parse(response)["products"]

    rcnt = 0;
    if raw_products && raw_products!=""
	    products = raw_products.map! do |product|
	      link_url = product["clickUrl"]
	  
	      # 이미지 저장
	      cnt_product = Product.where(url: link_url).count
	
	      add_product = Product.new
	      if cnt_product>0
	        add_product = Product.where(url: link_url).first
	  
	        # DB 수정
	        add_product.subject = product["name"]
	        add_product.price_type = product["currency"]
	        add_product.price = product["price"].to_s
	        add_product.sale_price = product["salePrice"].to_s
	        add_product.save!
	        
	      else
	      
	       add_product = Product.new
=begin
	          puts("id : " + product["id"].to_s)
	          puts("name : " + product["name"])
	          puts("brandedName : " + product["brandedName"])
	          puts("unbrandedName : " + product["unbrandedName"])
	          puts("currency : " + product["currency"])
	          puts("priceLabel : " + product["priceLabel"])
	          puts("salePriceLabel : " + product["salePriceLabel"].to_s)
	          puts("price : " + product["price"].to_s)
	          puts("salePrice : " + product["salePrice"].to_s)
	          puts("retailer_name : " + product["retailer"]["name"])
	          puts("brand_name : " + product["brand"]["name"])
	          puts("clickUrl : " + product["clickUrl"])
	          #product["pageUrl"]
	          #product["colors"] # 색상 배열 
	          #product["categories"]  # 카테고리 배열 (id, name 가져오기)
	          
	          puts("extractDate : " + product["extractDate"])
	          puts("image_id : " + product["image"]["id"].to_s)
	          puts("image_url : " + product["image"]["sizes"]["Original"]["url"])
	          
	          #product["alternateImages"] # 다른이미지 배열
	          #product["alternateImages"]["sizes"]["Original"]["url"])
=end
	
	        add_product.cate_code = cate_code
	        add_product.subject = product["name"]
	        #puts("brandedName : " + product["brandedName"])
	        #puts("unbrandedName : " + product["unbrandedName"])
	        add_product.price_type = product["currency"]
	        #puts("priceLabel : " + product["priceLabel"])
	        #puts("salePriceLabel : " + product["salePriceLabel"].to_s)
	        add_product.price = product["price"].to_s
	        add_product.sale_price = product["salePrice"].to_s
	        #puts("retailer_name : " + product["retailer"]["name"])
	        #puts("brand_name : " + product["brand"]["name"])
	        add_product.url = link_url
	        #product["pageUrl"]
	        #product["colors"] # 색상 배열 
	        #product["categories"]  # 카테고리 배열 (id, name 가져오기)
	        
	        #puts("extractDate : " + product["extractDate"])
	        #puts("image_id : " + product["image"]["id"].to_s)
	        add_product.img_file_name = product["image"]["sizes"][img_style]["url"]
	        
	        store_name = product["retailer"]["name"]
	        profile_id = store_name.gsub(/ /,'')
	        profile_id = profile_id.gsub(/\'/,'’')
	        profile_id = profile_id.gsub(/&/,'＆')
	        profile_id = profile_id.gsub(/\./,'·')
	        
	        add_product.merchant = profile_id
	        #product["alternateImages"] # 다른이미지 배열
	        #product["alternateImages"]["sizes"]["Original"]["url"])
	        add_product.store_type = store_type
	        add_product.style_type = style_type
	        add_product.hit = 1
	        add_product.use_yn = "Y"
	        
	        
	        if save_yn=="Y"
	          # 스토어 확인
	          cnt_store1 = User.where(profile_id: profile_id, user_type: 'S').count
	          cnt_store2 = User.where(email: profile_id, user_type: 'S').count
			    cnt_store3 = User.where(unique_key: profile_id).count
			    cnt_store4 = User.where(profile_id: profile_id).count

	          if cnt_store1>0
	            store = User.where(profile_id: profile_id, user_type: 'S').first
	          elsif cnt_store2>0
	            store = User.where(email: profile_id, user_type: 'S').first
			    elsif cnt_store3>0
			      store = User.where(unique_key: profile_id).first
			    elsif cnt_store4>0
			      store = User.where(profile_id: profile_id).first
	          else
	            store = User.addStore(profile_id,profile_id,'F','Y')
	          end

	          add_product.user_id = store.id
	  
	          # 이미지 저장
	          product_file_name = ""
	          product_content_type = ""
	          if add_product.img_file_name
	            dataFilePath = "/public/data/product/"
	            
	            product_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"
	            product_content_type = "image/png"
	      
	            r = open(add_product.img_file_name)
	            bytes = r.read
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
	            ipos = ApplicationHelper.get_resize_fit(thumbSize,tmpimg.columns,tmpimg.rows)
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

	            # 이미지 배경제거 (remove_bg.bat 원본디렉토리 원본이미지 target디렉토리 배경제거비율)
	            #%x{remove_bg.bat #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
	            %x{sh remove_bg #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
	      
	            # 이미지 대표색상코드 추출
	            colors = ApplicationHelper.get_product_color(product_file_name)
	            add_product.color_code_o = colors[0] 
	            add_product.color_code_s = colors[1]

	            add_product.img_file_name = product_file_name
	            add_product.img_content_type = "image/png"
	            add_product.img_file_size = 0
	      
	          end
	  
	          add_product.save!
	          
	          # 스토어 상품 연결 정보 저장
	          cnt_store_item = UserItem.where(user_id: store.id, ref_id: add_product.id).count
	          if cnt_store_item==0
	            store_item = UserItem.new
	            store_item.user_id = store.id
	            store_item.ref_id = add_product.id
	            store_item.item_type = 'P'
	            store_item.save!
	          end
	          
	        end
	        
	        
	      end
	      
	      product_list << add_product
	      
	      rcnt += 1
	    end
	    
    end
    
    return product_list
    
  end
  
	def self.addProduct(product)
=begin
    add_product = Product.new
    add_product = product
    add_product.save!
=end
		product.save!

		#collections 저장
		collection	= Collection.new
		collection.item_type	= "P"
		collection.user_id		= product.user_id
		collection.subject		= product.subject
		collection.hit			= 1
		collection.use_yn		= product.use_yn
		collection.img_file_name		= product.img_file_name
		collection.img_content_type	= product.img_content_type
		collection.img_file_size		= product.img_file_size
		collection.img_updated_at		= product.img_updated_at
		collection.product_id	= product.id	# 예비용
		collection.save!
		 
		#collection_products 저장
		collection_products = CollectionProduct.new
		collection_products.collection_id	= collection.id
		collection_products.product_id		= product.id
		collection_products.save!
 
		# 스토어 상품 연결 정보 저장
		cnt_store_item = UserItem.where(user_id: product.user_id, collection_id: collection.id).count
		if cnt_store_item==0
			store_item = UserItem.new
			store_item.user_id = product.user_id
			store_item.collection_id = collection.id
			store_item.save!
		end
    
    return collection
  end



  # 상품 리스트
  def self.productList(params)
    page = params[:page]||1
    per_page = params[:per_page]||16
    page = page.to_i
    per_page = per_page.to_i
    
    search_key = params[:search_key]||""
    color_code = params[:color_code]||""
    cate_code  = params[:cate_code]||""
    style_type = params[:style_type]||"P"
    order      = params[:order]||"hit DESC"
    
    if search_key && search_key!=""
      search_key = search_key.gsub(/\+/," ")
      search_key = search_key.gsub(/\=/," ")
      search_key = search_key.gsub(/_/," ")
      search_key = search_key.gsub(/%/," ")
      search_key = search_key.gsub(/\|/," ")
      search_key = search_key.gsub(/\&/," ")
      search_key = search_key.strip().downcase
      
      search_keys = search_key.split(" ")
    end
    
    where_str = ""
  
    if search_key && search_key!=""
      where_str += "    AND ("
      where_str += "          LOWER(subject) LIKE '%#{search_key}%' "
      where_str += "       OR LOWER(cate_code) LIKE '%#{search_key}%' "
      where_str += "       OR LOWER(merchant) LIKE '%#{search_key}%' "
      
      search_keys.each do |key|
        where_str += "       OR LOWER(subject) LIKE '%#{key}%' "
        where_str += "       OR LOWER(cate_code) LIKE '%#{key}%' "
        where_str += "       OR LOWER(merchant) LIKE '%#{key}%' "
      end
      
      where_str += "    )"
    end
    
    if color_code && color_code!=""
      where_str += "    AND color_code_s IN ('#{color_code}') "
    end
    
    if cate_code && cate_code!=""
      where_str += "    AND cate_code='"+cate_code+"'"
    end
    
    if style_type && style_type!=""
      where_str += "    AND style_type='"+style_type+"'"
    end

    products = Product.paginate(page: page, per_page: per_page)
              .select("id, user_id, img_file_name, F_REMOVE_HTML(subject) AS subject, hit, url, created_at, img_updated_at")
                .from("products")
               .where(" use_yn='Y' " + where_str)
               .order(order)

    return products

  end


  # 상품 리스트 카운트
  def self.productListCount(params)
    page = params[:page]||1
    per_page = params[:per_page]||16
    page = page.to_i
    per_page = per_page.to_i
    
    search_key = params[:search_key]||""
    color_code = params[:color_code]||""
    cate_code  = params[:cate_code]||""
    style_type = params[:style_type]||"P"
    order      = params[:order]||"hit DESC"
    
    if search_key && search_key!=""
      search_key = search_key.gsub(/\+/," ")
      search_key = search_key.gsub(/\=/," ")
      search_key = search_key.gsub(/_/," ")
      search_key = search_key.gsub(/%/," ")
      search_key = search_key.gsub(/\|/," ")
      search_key = search_key.gsub(/\&/," ")
      search_key = search_key.strip().downcase
      
      search_keys = search_key.split(" ")
    end
    
    where_str = ""
  
    if search_key && search_key!=""
      where_str += "    AND ("
      where_str += "          LOWER(subject) LIKE '%#{search_key}%' "
      where_str += "       OR LOWER(cate_code) LIKE '%#{search_key}%' "
      where_str += "       OR LOWER(merchant) LIKE '%#{search_key}%' "
      
      search_keys.each do |key|
        where_str += "       OR LOWER(subject) LIKE '%#{key}%' "
        where_str += "       OR LOWER(cate_code) LIKE '%#{key}%' "
        where_str += "       OR LOWER(merchant) LIKE '%#{key}%' "
      end
      
      where_str += "    )"
    end
    
    if color_code && color_code!=""
      where_str += "    AND color_code_s IN ('#{color_code}') "
    end
    
    if cate_code && cate_code!=""
      where_str += "    AND cate_code='"+cate_code+"'"
    end
    
    if style_type && style_type!=""
      where_str += "    AND style_type='"+style_type+"'"
    end

    products_count = Product.where(" use_yn='Y' " + where_str).count
    
    return products_count

  end

  private

  def randomize_file_name
    #milisec = DateTime.now.strftime("%s")
    extension = File.extname(img_file_name).downcase
    #self.img.instance_write(:file_name, "#{milisec}#{extension}")
    self.img.instance_write(:file_name, "#{randomize_name}#{extension}")
  end
  
end
