#encoding: utf-8

require 'shopsense'
require 'json'
require 'open-uri'

class Product < ActiveRecord::Base
  attr_accessible :cate_code, :subject, :price, :sale_price, :price_type, :url, :hit, :user_id,
                  :use_yn, :merchant, :cate_code, :img
                  
  has_many :collection_products, dependent: :destroy
  
  has_attached_file :img,
                    :styles => {
                      :medium => "220x220>", 
                      :thumb => "75x75>" 
                    },
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

        r = open(URI.parse(img_url))
        bytes = r.read
        tmpimg = Magick::Image.from_blob(bytes).first
        tmpimg.write(RAILS_ROOT+dataFilePath+'original/'+product_file_name)
    
        tmpimg.resize!(220,220)
        tmpimg.write(RAILS_ROOT+dataFilePath+'medium/'+product_file_name)
    
        tmpimg.resize!(75,75)
        tmpimg.write(RAILS_ROOT+dataFilePath+'thumb/'+product_file_name)
        
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
  
  def self.open_spreadsheet(file)
    case File.extname(file.original_filename)
    when ".csv" then Roo::Csv.new(file.path, nil, :ignore)
    when ".xls" then Roo::Excel.new(file.path, nil, :ignore)
    when ".xlsx" then Roo::Excelx.new(file.path, nil, :ignore)
    else raise "알려지지 않은 파일형식입니다: #{file.original_filename}"
    end
  end
  

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
    
    if cnt_store1>0
      store = User.where(profile_id: profile_id, user_type: 'S').first
    elsif cnt_store2>0
      store = User.where(email: profile_id, user_type: 'S').first
    else
      store = User.addStore(profile_id,profile_id)
    end
    
    
    # 이미지 저장
    product_file_name = ""
    product_content_type = ""
    if img_url
      dataFilePath = "/public/data/product/"
      
      product_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"
      product_content_type = "image/png"

      r = open(URI.parse(img_url))
      bytes = r.read
      tmpimg = Magick::Image.from_blob(bytes).first
      tmpimg.write(RAILS_ROOT+dataFilePath+'original/'+product_file_name)
  
      tmpimg.resize!(220,220)
      tmpimg.write(RAILS_ROOT+dataFilePath+'medium/'+product_file_name)
  
      tmpimg.resize!(75,75)
      tmpimg.write(RAILS_ROOT+dataFilePath+'thumb/'+product_file_name)
      
      # 이미지 배경제거 (remove_bg.bat 원본디렉토리 원본이미지 target디렉토리 배경제거비율)
      %x{remove_bg.bat #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
      
    end
    
    product = Product.new
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
    product.merchant = domain_name(itemData["clickUrl"])

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

  
  
  def self.getItemListApi(params)
    @products = []
    @product_list = []
    
    searchKey = params[:searchKey]||""
    page = params[:page]||1
    per_page = params[:per_page]||8
    img_style = params[:img_style]||"Large"

    page = page.to_i
    per_page = per_page.to_i

    # a search has been performed
    client = Shopsense::API.new({'partner_id' => 'uid7025-24947295-7'})
    response = client.search(searchKey,((page-1)*per_page),per_page);
    
    metadata = JSON.parse(response)["metadata"]
    raw_products = JSON.parse(response)["products"]

    rcnt = 0;
    @products = raw_products.map! do |product|
      tmpProduct = Product.new
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
      tmpProduct.subject = product["name"]
      #puts("brandedName : " + product["brandedName"])
      #puts("unbrandedName : " + product["unbrandedName"])
      tmpProduct.price_type = product["currency"]
      #puts("priceLabel : " + product["priceLabel"])
      #puts("salePriceLabel : " + product["salePriceLabel"].to_s)
      tmpProduct.price = product["price"].to_s
      tmpProduct.sale_price = product["salePrice"].to_s
      #puts("retailer_name : " + product["retailer"]["name"])
      #puts("brand_name : " + product["brand"]["name"])
      tmpProduct.url = product["clickUrl"]
      #product["pageUrl"]
      #product["colors"] # 색상 배열 
      #product["categories"]  # 카테고리 배열 (id, name 가져오기)
      
      #puts("extractDate : " + product["extractDate"])
      #puts("image_id : " + product["image"]["id"].to_s)
      tmpProduct.img_file_name = product["image"]["sizes"][img_style]["url"]
      tmpProduct.merchant = domain_name(product["clickUrl"])
      #product["alternateImages"] # 다른이미지 배열
      #product["alternateImages"]["sizes"]["Original"]["url"])
    
      @product_list << tmpProduct
      
      rcnt += 1
    end

    return @product_list
    
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
    searchKey = params[:searchKey]||""
    cate_code = params[:cate_code]||""
    order = params[:order]||"RAND()"
    
    where_str = ""
    
    if searchKey
      #where_str = " AND subject"      
    end
    if cate_code
      where_str = " AND cate_code='"+cate_code+"'"
    end
    
    products = Product.paginate(page: page, per_page: per_page)
                    .select("id, user_id, img_file_name, F_REMOVE_HTML(subject) AS subject, hit, url, created_at, img_updated_at")
                      .from("products")
                     .where(" use_yn='Y' " + where_str)
                     .order(order)

    return products

  end

  private

  def randomize_file_name
    #milisec = DateTime.now.strftime("%s")
    extension = File.extname(img_file_name).downcase
    #self.img.instance_write(:file_name, "#{milisec}#{extension}")
    self.img.instance_write(:file_name, "#{ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)}#{extension}")
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
