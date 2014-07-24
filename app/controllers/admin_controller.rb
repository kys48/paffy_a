#encoding: utf-8
require 'shopsense'
require 'nokogiri'
require 'uri'
require 'erb'
include ERB::Util

class AdminController < ApplicationController
  after_filter :cors_set_access_control_headers

  def importProductExcel
    respond_to do |format|
      format.html # importProductExcel.html.erb
      format.json { render json: {status: true} }
    end
  end
  
  def importProductExcelProcess
    #Product.import(params[:file],session[:user_id])
    Product.category_update(params[:file])
    redirect_to impProduct_path, notice: "상품이 등록되었습니다."
  end
  
  # link price ajax
  def getLinkpriceUrl
    url = params[:url]
    xmlurl = "http://ac.linkprice.com/service/custom_link_xml/a_id/"+LINKPRICE_KEY+"/url/"+url_encode(url)
    xml = Nokogiri::XML(open(URI.parse(xmlurl)))
    result = xml.search("result").inner_html.to_s
    link_url = xml.search("url").inner_html.to_s

    respond_to do |format|
      #format.json { render json: @collections.to_json }
      format.json { render :json => { status: true, result: result, url: link_url }.to_json }
    end
  end
  
  # lookie ajax
  def getLookUrl
    url = "http://lookie.co.kr/common/data/mediopia"
    #r = open(URI.parse(url)).read
    #data = r.to_json
    r = JSON.load(open(url))
    itemData = JSON.parse(r.to_json)
    
    result = itemData["result"]
puts("start~")
    
    cate1 = []
    cate2 = []
    
    if result=="success"
    
      shop_cnt = 0
      product_cnt = 0
      itemData["shops"].each do |shops|

          shop_cnt += 1
          
          shop_name = shops["shop_name"]
          shop_url  = shops["shop_url"]
          
          domain = domain_name(shop_url)
          
          shop_url = shop_url.gsub(/http:\/\//,'')
          shop_url = shop_url.gsub(/https:\/\//,'')
          shop_url = shop_url.gsub(/\//,'')
          
          # 스토어 확인
          cnt_store1 = User.where(url: 'http://'+shop_url, user_type: 'S').count
          cnt_store2 = User.where(email: shop_url, user_type: 'S').count
          
          if cnt_store1>0
            store = User.where(url: 'http://'+shop_url, user_type: 'S').first
          elsif cnt_store2>0
            store = User.where(email: shop_url, user_type: 'S').first
          else
            store = User.addStore(shop_url,shop_name)
          end
          
          
          # 상품 저장 process
          shops["styles"].each do |styles|
            product_cnt += 1
            
            name  = styles["name"]
            img_url = styles["image"]
            url   = styles["url"]
            price = styles["price"]
            category1 = styles["category1"]
            category2 = styles["category2"]
            
            
=begin            
            chkcate1 = false
            cate1.each do |cate|
              if cate==category1
                chkcate1 = true
              end 
            end
            
            chkcate2 = false
            cate2.each do |cate|
              if cate==category2
                chkcate2 = true
              end 
            end
            
            if !chkcate1
              cate1 << category1
            end
            if !chkcate2
              cate2 << category2
            end
=end
            
            # 이미지 저장
            cnt_product = Product.where(url: url).count
            add_product = Product.new
            if cnt_product>0
              add_product = Product.where(url: url).first
  
              # DB 수정
              product = add_product
              product.subject = name
              product.price = price.to_i
              product.category1 = category1
              product.category2 = category2
              product.save!
              
            else
              
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
              
              # DB 저장
              product = Product.new
              product.subject = name
              product.price = price.to_i
              product.price_type = "KRW"
              product.url = url
              product.img_file_name = product_file_name
              product.img_content_type = product_content_type
              product.img_file_size = 0
              product.hit = 1
              #product.user_id = session[:user_id]
              product.user_id = store.id
              product.sale_price = 0
              product.use_yn = "Y"
              product.merchant = domain
              
              add_product = Product.addProduct(product)

              # 스토어 상품 연결 정보 저장
              cnt_store_item = UserItem.where(user_id: store.id, ref_id: add_product.id).count
              if cnt_store_item==0
                store_item = UserItem.new
                store_item.user_id = store.id
                store_item.ref_id = add_product.id
                store_item.item_type = 'P'
                store_item.save!
              end
              
              puts("INSERT~!!!")
              
            end
            
            puts("-----"+product_cnt.to_s)
            
          end
          
          puts("===========> "+shop_cnt.to_s)
  
      end
      
    end

   
puts("end~")
    
    
       
    respond_to do |format|
      #format.json { render json: @collections.to_json }
      format.json { render :json => { status: true, result: result, cate1: cate1, cate2: cate2 }.to_json }
    end
  end
  
  
  # naver open API ajax
  def getNaverShopApi
    page = params[:page]||1
    per_page = params[:per_page]||16
    searchKey = params[:searchKey]||""
    searchDomain = params[:searchDomain]||""
    cate_code = params[:cate_code]||""
    sort = params[:sort]||"sim"

    product_list = []
    
    xmlurl = "http://openapi.naver.com/search?key=" + NAVER_API_KEY +
             "&query=" + url_encode(searchKey) +
             "&start=" + (((page.to_i-1)*per_page.to_i)+1).to_s + 
             "&display=" + per_page + 
             "&target=shop" + 
             "&sort="+sort;

    xml = Nokogiri::XML(open(URI.parse(xmlurl)))
    channel_str = xml.search("channel").inner_html.to_s
    
puts("start!")

    result = "F"

    if !channel_str || channel_str==""
      result = "F"
    else
      result = "S"

      total_cnt = xml.search("channel").search("total").first.text().to_i;
      
      rcnt = 0
      xml.search("channel").search("item").each do |item|
        product = {}
        title = item.search("title").text()||""
        link  = item.search("link").text()||""
        image = item.search("image").text()||""
        lprice = item.search("lprice").text()||""
        hprice = item.search("hprice").text()||""
        mallName = item.search("mallName").text()||""
        productId = item.search("productId").text()||""
        productType = item.search("productType").text()||""
        
        chk_convert = false;
        ori_link = ""
        link_url = ""
        if mallName=="네이버" || mallName=="naver" || mallName=="" || productType!="2"
          ori_link = link
          link_url = link
        else
          
          url_str = MetaInspector.new(link)
          ori_link = URI.extract(url_str.to_s,/http(s)?/).first
          ori_link = (ori_link.to_s).gsub(/\'\);/,'')
          ori_link = (ori_link.to_s).gsub(/yuuzit.com/,'www.yuuzit.com')
          ori_link = (ori_link.to_s).gsub(/www.www./,'www.')
          
          link_url = ori_link
          
          # 지정한 도메인 주소로 되어있고  storefarm 상품이 아닌경우만 등록하게...
          chk_url_n = link_url.index("storefarm.naver.com")||"-1"
          chk_url_y = link_url.index(searchDomain+".")||"-1"
          
          if chk_url_y.to_i>0 && chk_url_n.to_i<0 
            chk_convert = true
          end

#puts("searchDomain : " + searchDomain)          
#puts("chk_url_n : " + chk_url_n.to_s)
#puts("chk_url_y : " + chk_url_y.to_s)
#puts("link_url : " + link_url)

=begin    
          # link price 링크만들기
          if link_url && chk_url.to_i<0
            xmlurl2 = "http://ac.linkprice.com/service/custom_link_xml/a_id/"+LINKPRICE_KEY+"/url/"+url_encode(link_url)
      
            xml2 = Nokogiri::XML(open(URI.parse(xmlurl2)))
            result = xml2.search("result").inner_html.to_s
    
            if result=="S"
              chk_convert = true;
              link_url = xml2.search("url").inner_html.to_s  
            end
          else
            link_url = link
          end
=end        
        end
        
        if chk_convert
          product["title"] = title
          product["url"] = link
          product["ori_url"] = ori_link
          product["link_url"] = link_url
          product["paffy_url"] = link_url
          product["image"] = image
          product["lprice"] = lprice
          product["hprice"] = hprice
          product["mallName"] = mallName
          product["productId"] = productId
          product["productType"] = productType
          
          #merchant = domain_name(ori_link)
          merchant = searchDomain
          merchant_uri = URI(ori_link)
          merchant_domain = merchant_uri.host
          
          # 스토어 확인
          cnt_store1 = User.where(url: 'http://'+merchant_domain, user_type: 'S').count
          cnt_store2 = User.where(email: merchant_domain, user_type: 'S').count

          if cnt_store1>0
            store = User.where(url: 'http://'+merchant_domain, user_type: 'S').first
          elsif cnt_store2>0
            store = User.where(email: merchant_domain, user_type: 'S').first
          else
            store = User.addStore(merchant_domain,mallName)
          end
          
          # 이미지 저장
          cnt_product = Product.where(url: link_url).count
          add_product = Product.new
          if cnt_product>0
            add_product = Product.where(url: link_url).first

            # DB 수정
            add_product.subject = title
            add_product.price = lprice.to_i
            add_product.cate_code = cate_code
            add_product.save!
            
          else
              
            product_file_name = ""
            product_content_type = ""
            if image
              dataFilePath = "/public/data/product/"
              
              product_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"
              product_content_type = "image/png"
        
              r = open(URI.parse(image))
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
  
            # 상품저장
            add_product.subject = title
            add_product.cate_code = cate_code
            add_product.price = lprice.to_i
            add_product.price_type = "KRW"
            add_product.url = link_url
            add_product.img_file_name = product_file_name
            add_product.img_content_type = product_content_type
            add_product.img_file_size = 0
            add_product.hit = 1
            add_product.user_id = store.id
            add_product.use_yn = "Y"
            add_product.merchant = merchant
            
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
            
  #puts(lprice + " / " + hprice + " / " + mallName + " / ")
            
            
          end
          
          product_list << product
          
          
        end
        
        rcnt += 1
        
      end
      
    end
    
   
puts("end!")
puts(Time.zone.now)   
    respond_to do |format|
      format.json { render :json => { status: true, result: result, product_list: product_list }.to_json }
    end
  end
  
  
  private
  
  def cors_set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
  end
  
  def domain_name(url)
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
