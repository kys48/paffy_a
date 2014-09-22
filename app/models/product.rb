#encoding: utf-8

require 'shopsense'
require 'json'
require 'open-uri'

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
      product.merchant = domain_name(row["url"])
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

      # 이미지 배경제거 (remove_bg.bat 원본디렉토리 원본이미지 target디렉토리 배경제거비율)
      #%x{remove_bg.bat #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
      %x{sh remove_bg #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}

      # 이미지 대표색상코드 추출
      colors = Product.get_product_color(product_file_name)
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
    #product.merchant = domain_name(itemData["clickUrl"])

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
			    cnt_store3 = User.where(unique_key: email).count
			    cnt_store4 = User.where(profile_id: profile_id).count
	
	          if cnt_store1>0
	            store = User.where(profile_id: profile_id, user_type: 'S').first
	          elsif cnt_store2>0
	            store = User.where(email: profile_id, user_type: 'S').first
			    elsif cnt_store3>0
			      store = User.where(unique_key: email).first
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
	      
	            # 이미지 배경제거 (remove_bg.bat 원본디렉토리 원본이미지 target디렉토리 배경제거비율)
	            #%x{remove_bg.bat #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
	            %x{sh remove_bg #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
	      
	            # 이미지 대표색상코드 추출
	            colors = Product.get_product_color(product_file_name)
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
    add_product = Product.new
    add_product = product
    add_product.save!
    return add_product
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
    self.img.instance_write(:file_name, "#{ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)}#{extension}")
  end
  
  # 썸네일 이미지 사이즈,left,top 구하기 (이미지 가로세로 비율 맞춰서)
  def self.get_resize_fit(rsize,iwidth,iheight)
      isize = [] 
      
      iw = rsize
      ih = rsize
      if iwidth > iheight
        iw = rsize
        ih = (iheight*rsize)/iwidth
      elsif iwidth < iheight
        iw = (iwidth*rsize)/iheight
        ih = rsize
      end
      
      isize[0] = iw
      isize[1] = ih
      isize[2] = (rsize-isize[0].to_i)/2  # 정사각형 이미지배경에서 위치될 썸네일 left
      isize[3] = (rsize-isize[1].to_i)/2  # 정사각형 이미지배경에서 위치될 썸네일 top
      
      return isize
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
  
  # 원본 이미지의 색상표이미지를 만든다
  def self.sort_by_decreasing_frequency(img)
    hist = img.color_histogram
    # sort by decreasing frequency
    sorted = hist.keys.sort_by {|p| -hist[p]}
    new_img = Magick::Image.new(hist.size, 1)
    
    new_img.store_pixels(0, 0, hist.size, 1, sorted)
  end
   
  # 색상표이미지에서 두번째 색상hex값을 넘겨준다
  def self.get_pix(img)
    pixels = img.get_pixels(0, 0, img.columns, 1)
    color = ""
    if pixels.size<2
      color = pixels.first.to_color(Magick::AllCompliance, false, 8, true)
    else
      color = pixels.second.to_color(Magick::AllCompliance, false, 8, true)
    end
=begin
    # 첫번째 색상이 ffffff면 두번째 색상을 가져옴(기본적으로 첫번째 색상)
    color_hex=""
    pixels.each_with_index do |p,i|
      if i<2
        hex = p.to_color(Magick::AllCompliance, false, 8, true)
        puts hex
        if i==0 && hex!="#ffffff"
          color_hex = hex
        end
          
        if i>0 && color_hex==""
          color_hex = hex
        end
        
      end
    end
=end
    return color.gsub(/#/,'')
    
  end
  
  # 이미지의 대표 색상표와 가까운 값을 가져온다
  def self.get_product_color(img_file_name)
      colors = {}
      
      begin
      
        dataFilePath = "/public/data/product/"
        original = Magick::Image.read(RAILS_ROOT+dataFilePath+"removebg/"+img_file_name).first
        
        if original
    
          bg = Magick::Image.new(original.columns, original.rows){
            #self.background_color = '3366ff'
            self.background_color = 'transparent'
            self.format = 'PNG'
          }
           
          # reduce number of colors
          quantized = original.quantize(10, Magick::RGBColorspace)
          
          bg.composite!(quantized, 0, 0, Magick::OverCompositeOp)
          #bg.write(RAILS_ROOT+dataFilePath+"tmp.png")
          
          # Create an image that has 1 pixel for each of the top_n colors.
          normal = Product.sort_by_decreasing_frequency(bg)
          #normal.write(RAILS_ROOT+dataFilePath+"tmp2.png")
          color_hex = Product.get_pix(normal)
          
=begin  
          # polyvore
          base_palette = [
          "660000", "de6318", "d3d100", "8c8c00", "293206", "34e3e5", "205260", "1c0946", "46008c", "33151a", "e30e5c", "3d1f00", "5e1800", "000000",
          "980000", "ff7f00", "ffff00", "88ba41", "006700", "65f3c9", "318c8c", "31318c", "5e318c", "520f41", "ff59ac", "8c5e31", "8c4600", "505050",
          "ff0000", "ffa000", "eed54f", "778c62", "00ae00", "77f6a7", "628c8c", "4a73bd", "77628c", "840e47", "ef8cae", "8e7032", "d1b45b", "828283",
          "e32636", "ffc549", "ffff6d", "8c8c62", "00ff00", "b2ffff", "62778c", "589ad5", "ac59ff", "8c6277", "ead0cd", "8c7762", "e2db9a", "b5b5b6",
          "fa624d", "ffc898", "ffffae", "96d28a", "a9ff00", "d8ffb2", "bdd6bd", "a1c4e9", "a297e9", "c6a5b6", "ffdfef", "c69c7b", "ffffff", "e7e7e7"
          ]
    
          # polyvore - lite
          base_palette = ["660000", "34e3e5", "46008c", "000000", "ffff00",
                          "88ba41", "006700", "318c8c", "31318c", "ff59ac",
                          "8c5e31", "8c4600", "ff0000", "ffa000", "840e47",
                          "00ff00", "ac59ff", "b5b5b6","ffffff"]
                          
                          
          # naver
          base_palette = ["ee1919", "f4aa24", "f4d324", "f3f424", "a5dd0c", "37b300",
                          "97d0e8", "3232ff", "1e2d87", "ffffff", "c6c6c6", "000000"]
  
=end
  
          base_palette = ["ff0000", "f49024", "ffff00", "a5dd0c", "009900",  
                          "08d6d8", "3232ff", "31318c", "8d1bff", "8d0647",  
                          "ff59ac", "772a00", "ffffff", "b5b5b5", "000000"]
    
          
          color1 = Paleta::Color.new(:hex, color_hex)
          pal = Array.new(base_palette.size) {Array.new(2,nil)}
          
          base_palette.each_with_index do |base_hex,i|
            color2 = Paleta::Color.new(:hex, base_hex)
            score = color1.similarity(color2)
            pal[i][0] = score
            pal[i][1] = base_hex
          end
          
          # 가장 근접한 색상코드로 정렬
          palette_sort = pal.sort_by{|x| x[0]}
          
          
          colors[0] = color_hex.to_s  # 이미지에서 추출한 대표색상코드
          colors[1] = palette_sort.first.second.to_s  # 기본 색상표랑 가장 근접한 색상코드
          
        end
        
      rescue
        puts("error file : #{img_file_name}")
      end
      
      return colors

    
  end
    
end
