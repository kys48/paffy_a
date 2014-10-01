#encoding: utf-8
require 'shopsense'
require 'nokogiri'
require 'uri'
require 'erb'
include ERB::Util

class AdminController < ApplicationController
  after_filter :cors_set_access_control_headers

  def importProduct
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
          
          domain = Product.domain_name(shop_url)
          
          shop_url = shop_url.gsub(/http:\/\//,'')
          shop_url = shop_url.gsub(/https:\/\//,'')
          shop_url = shop_url.gsub(/\//,'')
          
          # 스토어 확인
          cnt_store1 = User.where(url: 'http://'+shop_url, user_type: 'S').count
          cnt_store2 = User.where(email: shop_url, user_type: 'S').count
          cnt_store3 = User.where(unique_key: shop_url).count
          cnt_store4 = User.where(profile_id: domain).count
          
          if cnt_store1>0
            store = User.where(url: 'http://'+shop_url, user_type: 'S').first
          elsif cnt_store2>0
            store = User.where(email: shop_url, user_type: 'S').first
          elsif cnt_store3>0
          	store = User.where(unique_key: shop_url).first
          elsif cnt_store4>0
		      store = User.where(profile_id: domain).first
		    else
            store = User.addStore(shop_url,shop_name,'I','Y')
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
              product = Product.new
              
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
              
              # DB 저장
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
    search_key = params[:search_key]||""
    searchDomain = params[:searchDomain]||""
    cate_code = params[:cate_code]||""
    sort = params[:sort]||"sim"

    product_list = []
    
    xmlurl = "http://openapi.naver.com/search?key=" + NAVER_API_KEY +
             "&query=" + url_encode(search_key) +
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
          ori_link = (ori_link.to_s).gsub(/jkhomme.com/,'www.jkhomme.com')
          ori_link = (ori_link.to_s).gsub(/mitoshop.co.kr/,'www.mitoshop.co.kr')
          ori_link = (ori_link.to_s).gsub(/fashionpia.com/,'www.fashionpia.com')
          ori_link = (ori_link.to_s).gsub(/fashionpia.com/,'www.fashionpia.com')
          ori_link = (ori_link.to_s).gsub(/koreasang.co.kr/,'www.koreasang.co.kr')
          ori_link = (ori_link.to_s).gsub(/1200m.com/,'www.1200m.com')
          ori_link = (ori_link.to_s).gsub(/1300k.com/,'www.1300k.com')
          ori_link = (ori_link.to_s).gsub(/chicfox.co.kr/,'www.chicfox.co.kr')
          ori_link = (ori_link.to_s).gsub(/perifit.co.kr/,'www.perifit.co.kr')
          ori_link = (ori_link.to_s).gsub(/ogage.halfclub.com/,'ogage.halfclub.com')
          ori_link = (ori_link.to_s).gsub(/penagero.com/,'www.penagero.com')
          ori_link = (ori_link.to_s).gsub(/whosgirl.co.kr/,'www.whosgirl.co.kr')
          ori_link = (ori_link.to_s).gsub(/eranzi.co.kr/,'www.eranzi.co.kr')
          ori_link = (ori_link.to_s).gsub(/chichera.co.kr/,'www.chichera.co.kr')
          ori_link = (ori_link.to_s).gsub(/coii.kr/,'www.coii.kr')
          ori_link = (ori_link.to_s).gsub(/styleberry.co.kr/,'www.styleberry.co.kr')
          ori_link = (ori_link.to_s).gsub(/boribori.co.kr/,'www.boribori.co.kr')
          ori_link = (ori_link.to_s).gsub(/yuuzit.com/,'www.yuuzit.com')
          ori_link = (ori_link.to_s).gsub(/gabangpop.co.kr/,'www.gabangpop.co.kr')
          ori_link = (ori_link.to_s).gsub(/istyle24.com/,'www.istyle24.com')
          ori_link = (ori_link.to_s).gsub(/enter6mall.com/,'www.enter6mall.com')
          ori_link = (ori_link.to_s).gsub(/fashionplus.co.kr/,'www.fashionplus.co.kr')
          
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
          
          #merchant = Product.domain_name(ori_link)
          merchant = searchDomain
          merchant_uri = URI(ori_link)
          merchant_domain = merchant_uri.host
          
          # 스토어 확인
          cnt_store1 = User.where(url: 'http://'+merchant_domain, user_type: 'S').count
          cnt_store2 = User.where(email: merchant_domain, user_type: 'S').count
          cnt_store3 = User.where(unique_key: merchant_domain).count
          cnt_store4 = User.where(profile_id: merchant).count
          
          if cnt_store1>0
            store = User.where(url: 'http://'+merchant_domain, user_type: 'S').first
          elsif cnt_store2>0
            store = User.where(email: merchant_domain, user_type: 'S').first
		    elsif cnt_store3>0
		      store = User.where(unique_key: merchant_domain).first
		    elsif cnt_store4>0
		      store = User.where(profile_id: merchant).first
          else
            store = User.addStore(merchant_domain,mallName,'I','Y')
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
        
              #r = open(URI.parse(image))
              r = open(image)
              bytes = r.read
              tmpimg = Magick::Image.from_blob(bytes).first
              #tmpimg.write(RAILS_ROOT+dataFilePath+'original/'+product_file_name)
          
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
            add_product.store_type = "I"
            add_product.style_type = 'P'
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
  
  
  # 상품 리스트
  def productList
    @cateList = Cate.all()
    #@cateList = Cate.where("id>0").to_json
    
    respond_to do |format|
      format.html # productList.html.erb
    end
  end
  
  # 상품 리스트 ajax
  def productListCallback
    page = params[:page]||1
    per_page = params[:per_page]||20
    cate_code = params[:cate_code]||''
    search_key = params[:search_key]||''
    use_yn = params[:use_yn]||''
    store_type = params[:store_type]||''
    style_type = params[:style_type]||''
    
    order = params[:order]||'created_at DESC'
    
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
    
    where_str = "1=1"
    if cate_code && cate_code!=''
      where_str += " AND cate_code='#{cate_code}'"
    end
    
    if use_yn && use_yn!=''
      where_str += " AND use_yn='#{use_yn}'"
    end
    
    if store_type && store_type!=''
      where_str += " AND store_type='#{store_type}'"
    end
    
    if style_type && style_type!=''
      where_str += " AND style_type='#{style_type}'"
    end
    
    if search_key && search_key!=""
      where_str += "    AND ("
      where_str += "          LOWER(subject) LIKE '%#{search_key}%' "
      where_str += "       OR LOWER(cate_code) LIKE '%#{search_key}%' "
      where_str += "       OR LOWER(merchant) LIKE '%#{search_key}%' "
      where_str += "       OR LOWER(url) LIKE '%#{search_key}%' "
      
      search_keys.each do |key|
        where_str += "       OR LOWER(subject) LIKE '%#{key}%' "
        where_str += "       OR LOWER(cate_code) LIKE '%#{key}%' "
        where_str += "       OR LOWER(merchant) LIKE '%#{key}%' "
        where_str += "       OR LOWER(url) LIKE '%#{key}%' "
      end
      
      where_str += "    )"
    end
    
    
    products = Product.paginate(page: page, per_page: per_page)
                .where(where_str)
                .order(order)

    respond_to do |format|
      format.json { render :json => { status: true, product_list: products }.to_json }
    end
  end
    
  # 상품 이미지 배경제거+대표색상추출 ajax
  def removeBgColorCallback
    page = params[:page]||'1'
    per_page = params[:per_page]||'10'
    records = Product.where("(color_code_o IS NULL OR color_code_o='') AND style_type='P' AND use_yn='Y'").order("id asc").limit(per_page.to_i)
    
    products = []
    rcnt = 0
    puts("start...[#{page} : " + Time.zone.now.to_s+"]")
    
    records.each_with_index do |product, i|
      if product.img_file_name && product.img_file_name!=''

        # 이미지 배경제거 (remove_bg.bat 원본디렉토리 원본이미지 target디렉토리 배경제거비율)
        %x{sh remove_bg #{RAILS_ROOT}/public/data/product/original/ #{product.img_file_name} #{RAILS_ROOT}/public/data/product/removebg/ 7}
        
        colors = Product.get_product_color(product.img_file_name)
        product.color_code_o = colors[0] 
        product.color_code_s = colors[1]
        product.save!
        
        products[rcnt] = product.img_file_name
      end

      rcnt += 1
       
    end
    
    puts("end.....[" + Time.zone.now.to_s+"]")
    
    respond_to do |format|
      format.json { render :json => { status: true, product_list: products }.to_json }
    end
  end
    
  # 상품 이미지 배경제거 ajax
  def removeBgCallback
    #records = Dir.glob("**/*")
    records = Dir.glob(RAILS_ROOT+"/public/data/product/original/*.*")
    puts(records.size)
    
    products = []
    rcnt = 0
    puts("start...[" + Time.zone.now.to_s+"]")
    
    records.each_with_index do |img_file_name, i|
      
      #if i<100
        if img_file_name && img_file_name!=''
          pattern = /\//
          last = img_file_name.rindex(pattern)
          
          product_file_name = img_file_name[last+1..img_file_name.length]
          
          # 이미지 배경제거 (remove_bg.bat 원본디렉토리 원본이미지 target디렉토리 배경제거비율)
          %x{sh remove_bg #{RAILS_ROOT}/public/data/product/original/ #{product_file_name} #{RAILS_ROOT}/public/data/product/removebg/ 7}
          
          products[rcnt] = product_file_name
        end
      #end
      rcnt += 1
       
    end
    
    puts("end.....[" + Time.zone.now.to_s+"]")
    
    respond_to do |format|
      format.json { render :json => { status: true, product_list: products }.to_json }
    end
  end
  
  # 상품 이미지 색상추출 ajax
  def setColorCallback
    page = params[:page]||1
    params[:page] = 1
    per_page = params[:per_page]||20
    
    products = Product.paginate(page: page, per_page: per_page)
                      .where("color_code_o is null")
                      .order("id ASC")
    
    puts("===================================")
    puts("products count : #{products.size}")
    rcnt = 0
    puts("start...[" + Time.zone.now.to_s+"]")
    
    products.each_with_index do |product, i|
      if product.img_file_name && product.img_file_name!=''
        colors = Product.get_product_color(product.img_file_name)
        product.color_code_o = colors[0] 
        product.color_code_s = colors[1]
        product.save!
  
        #products[rcnt] = product.img_file_name
      end
      rcnt += 1
    end
    
    puts("end.....[" + Time.zone.now.to_s+"]")
    
    respond_to do |format|
      format.json { render :json => { status: true }.to_json }
    end
  end
  
  # 상품정보 수정
  def updateProductCallback
    id  = params[:id]
    color_code_s  = params[:color_code_s]
    subject       = params[:subject]
    cate_code     = params[:cate_code]
    style_type    = params[:style_type]
    use_yn        = params[:use_yn]
    store_type    = params[:store_type]
    
    product = Product.find(id)
    
    product.color_code_s = color_code_s
    product.subject      = subject
    product.cate_code    = cate_code
    product.style_type   = style_type
    product.use_yn       = use_yn
    product.store_type   = store_type
    product.tmp_update   = "Y"
    product.save!
    
    respond_to do |format|
      format.json { render :json => { status: true }.to_json }
    end
  end


    
  # 이미지리스트 등록 ajax
  def insertImglistCallback
    img_type = params[:img_type]
    img_type_nm = ""
    if img_type=="B"
      img_type_nm = "background"
    elsif img_type=="D"
      img_type_nm = "decoration"
    end
    
    records = Dir.glob(RAILS_ROOT+"/public/data/#{img_type_nm}/*.*")
    
    products = []
    
    rcnt = 0
    puts("start...[" + Time.zone.now.to_s+"]")

    records.each_with_index do |img_file_name, i|
      product = Product.new
      product.img_content_type = "image/png"

      dataFilePath = "/public/data/product/"
      tmpimg = Magick::Image.read(img_file_name).first
      
      if tmpimg
        product.subject = "#{img_type_nm}#{i}"
        product.use_yn = "Y"
        product.style_type = img_type
        product_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"
        
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
          if img_type=="B"
            self.background_color = 'transparent'
          elsif img_type=="D"
            self.background_color = 'white'  
          end
          
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
        #system "remove_bg.bat #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7" 
        #system "rm -f #{RAILS_ROOT+dataFilePath}original/#{@product.img_file_name}"
        if img_type=="B"
          %x{cp -f #{RAILS_ROOT+dataFilePath}original/#{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/#{product_file_name}}
        elsif img_type=="D"
          %x{sh remove_bg #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}  
        end

        product.img_file_name = product_file_name
        product.save!
        
        products[rcnt] = product_file_name
        
      end
      
      rcnt += 1
       
    end
    
    puts("end.....[" + Time.zone.now.to_s+"]")
    
    respond_to do |format|
      format.json { render :json => { status: true, product_list: products }.to_json }
    end
  end
  
  private
  
  def cors_set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
  end
=begin  
	def domain_name(url)
		domain = url.split(".")
		retVal = ""
		if domain.count > 2
			retVal = domain[1]
		else
			domain_names = domain[0].split("/")
			if domain_names.count>2
				retVal = domain[0].split("/")[2]
			else
				retVal = domain[0]
			end
		end
		retVal = retVal.gsub(/\'/,'’') 
		retVal = retVal.gsub(/&/,'＆')
		return retVal
	end
=end  
  
end
