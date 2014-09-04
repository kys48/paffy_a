#encoding: utf-8

require 'rubygems'
require 'RMagick'
include Magick
include Colorscore

class CollectionsController < ApplicationController
  layout 'collection'
  
  # GET /collections
  # GET /collections.json
  def index
    @item_type = params[:type] = "C"
    
    params[:id] = nil
    
    # 찜한 상품, 콜렉션
    @collections = Collection.itemList(params)
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @collections }
    end
   
  end

  # 콜렉션 상세정보
  def show
    @session_user_id = session[:user_id]||""
    collection_id = params[:id]
    @collection = Collection.find(collection_id)
    @user = User.find(@collection.user_id)
    
    if @session_user_id && @session_user_id!=""
      @session_user = User.find(@session_user_id)
    end
    
    #@products = Product.paginate(page: params[:page], per_page: 40).where(collection_id: @collection.id).order('created_at DESC')
    #@collection_products = CollectionProduct.paginate(page: params[:page], per_page: 10).order('created_at DESC')
    
    str_select = "A.product_id, A.white_bck, A.flip, A.flop
                , A.height, A.top, A.left, A.cssleft, A.csstop
                , A.zindex, A.rotate, A.caption, B.id, B.subject, B.price
                , B.price_type, B.img_file_name, B.url, B.user_id
                , B.merchant, B.hit, C.profile_id, C.user_name
                , F_COUNT_GETS(A.product_id,'L') AS cnt_like
                , CASE WHEN CHAR_LENGTH(F_REMOVE_HTML(subject))<25 THEN F_REMOVE_HTML(subject) ELSE CONCAT(SUBSTRING(F_REMOVE_HTML(subject),1,25),'..') END AS subject
                , subject AS subject_full"
                 
    if @session_user_id && @session_user_id!=""
      str_select += ", F_COUNT_GETS_USER(A.product_id,'L','#{@session_user_id}') AS cnt_like_user"
    else
      str_select += ", 0 AS cnt_like_user"
    end
    
    @collection_products = CollectionProduct
    .select(str_select)
    .from( "collection_products A, products B, users C")
    .where("A.product_id = B.id AND B.user_id=C.id
        AND collection_id = "+collection_id)

    # 시간 오래 걸림... 해결방법 찾아라
=begin    
    @collection_products.each_with_index do |collection,i|
      price = 0.0
      
      if collection.price_type!='KRW'
        case collection.price_type
          when 'USD'
            price = GoogCurrency.usd_to_krw(collection.price).to_i
          when 'JPY'
            price = GoogCurrency.jpy_to_krw(collection.price).to_i
          when 'EUR'
            price = GoogCurrency.eur_to_krw(collection.price).to_i
          when 'GBP'
            price = GoogCurrency.gbp_to_krw(collection.price).to_i
          when 'CNY'
            price = GoogCurrency.eur_to_krw(collection.price).to_i
        end
        collection.price = price
        collection.price_type = 'KRW'
      end
    end
=end    
    # 좋아요 수 가져오기
    @cnt_like = Get.where(get_type: 'L', item_type: 'C', ref_id: collection_id).count

    #get = Get.find_by_sql "SELECT COUNT(id) AS count FROM gets WHERE get_type='L' AND item_type='C'"
    
    # 스크랩 수 가져오기
    @cnt_scrap = Get.where(get_type: 'S', item_type: 'C', ref_id: collection_id).count
    
    # 찜 수 가져오기
    #@cnt_wish = Wish.where(item_type: 'C', ref_id: collection_id).count
    
    # 조회수 증가
    @collection.hit += 1
    @collection.save! 

    # 로그인 사용자의 좋아요 가져오기
    @cnt_like_user = Get.where(get_type: 'L', item_type: 'C', ref_id: collection_id, user_id: @session_user_id).count

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @collection }
    end
  end
  
  # 상품 상세정보
  def pshow
    @session_user_id = session[:user_id]||""
    product_id = params[:id]
    @product = Product.find(product_id)
    @user = User.new
    
    if @session_user_id && @session_user_id!=""
      @session_user = User.find(@session_user_id)
    end

    if @product.user_id 
      @user = User.find(@product.user_id)
    else
      @user.profile_id = 'guest'
      @user.user_name = 'guest'
    end

    @currency_usd = 0
    @currency_jpy = 0
    @currency_eur = 0
    @currency_gbp = 0
    @currency_cny = 0

    @currency_usd = GoogCurrency.usd_to_krw(1).to_i
    @currency_jpy = GoogCurrency.jpy_to_krw(1).to_i
    @currency_eur = GoogCurrency.eur_to_krw(1).to_i
    @currency_gbp = GoogCurrency.gbp_to_krw(1).to_i
    @currency_cny = GoogCurrency.cny_to_krw(1).to_i
  
    # 좋아요 수 가져오기
    @cnt_like = Get.where(get_type: 'L', item_type: 'P', ref_id: product_id).count

    # 팔로우 여부 가져오기
    @follow_count = Follow.where(user_id: @session_user_id, follow_id: @user.id).count
    
    # 스크랩 수 가져오기
    @cnt_scrap = Get.where(get_type: 'S', item_type: 'P', ref_id: product_id).count
    
    # 찜 수 가져오기
    #@cnt_wish = Wish.where(item_type: 'P', ref_id: product_id).count
    
    # 조회수 증가
    @product.hit += 1
    @product.save! 
    
    # 로그인 사용자의 좋아요 가져오기
    @cnt_like_user = Get.where(get_type: 'L', item_type: 'P', ref_id: product_id, user_id: session[:user_id]).count

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @product }
    end
  end

  # GET /collections/set
  # GET /collections/set.json
  def set
    params[:cmenu] = "5"
    params[:cmenu_sub] = "1"
    
    @collection_id	= params[:id]||""
    
    if @collection_id && @collection_id!=""
    	#@collection	= Collection.find(@collection_id)
    	@collection	= Collection.where(id: @collection_id, collection_type: "set").first
    	
    	@collection_products	= CollectionProduct
    	.select("A.collection_id, A.product_id, A.white_bck, A.flip, A.flop
					, A.height, A.top, A.left, A.cssleft, A.csstop
					, A.zindex, A.rotate, A.caption
					, B.cate_code, B.subject, B.price, B.url, B.style_type
					, B.merchant, B.img_file_name")
		.from("collection_products A, products B")
		.where(" A.product_id = B.id
					AND A.collection_id=#{@collection_id}")
    else
    	@collection = Collection.new
    end
    
    @session_user_id = session[:user_id]||""
    @cateList = Cate.all()
    
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @collection }
    end      

  end
  
  # GET /collections/collect
  # GET /collections/collect.json
  def collect
    params[:cmenu] = "5"
    params[:cmenu_sub] = "2"
    
    @collection_id	= params[:id]||""
    
    if @collection_id && @collection_id!=""
    	#@collection	= Collection.find(@collection_id)
    	@collection	= Collection.where(id: @collection_id, collection_type: "collect").first
    	
    	@collection_products	= CollectionProduct
    	.select("A.collection_id, A.product_id, A.white_bck, A.flip, A.flop
					, A.height, A.top, A.left, A.cssleft, A.csstop
					, A.zindex, A.rotate, A.caption
					, B.cate_code, B.subject, B.price, B.url, B.style_type
					, B.merchant, B.img_file_name")
		.from("collection_products A, products B")
		.where(" A.product_id = B.id
					AND A.collection_id=#{@collection_id}")
    else
    	@collection = Collection.new
    end
    
    @session_user_id = session[:user_id]||""
    @cateList = Cate.all()
    
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @collection }
    end
  end

  # GET /collections/1/edit
  def edit
    @collection = Collection.find(params[:id])
  end

  # POST /collections
  # POST /collections.json
  def create
    @collection = Collection.new(params[:collection])

    respond_to do |format|
      if @collection.save
        format.html { redirect_to @collection, notice: 'Collection was successfully created.' }
        format.json { render json: @collection, status: :created, location: @collection }
      else
        format.html { render action: "new" }
        format.json { render json: @collection.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /collections/1
  # PUT /collections/1.json
  def update
    @collection = Collection.find(params[:id])

    respond_to do |format|
      if @collection.update_attributes(params[:collection])
        format.html { redirect_to @collection, notice: 'Collection was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @collection.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /collections/1
  # DELETE /collections/1.json
  def destroy
    @collection = Collection.find(params[:id])
    @collection.destroy

    respond_to do |format|
      format.html { redirect_to collections_url }
      format.json { head :no_content }
    end
  end
  
  # POST /collections
  # POST /collections.json
  def publish
    type = params[:type]
    collection_id = params[:id]

    if type=="collect"
      drowCollect(params)
    else
      #drowSet(params[:items], params[:info])
      drowSet(params)
    end
    
    respond_to do |format|
      #format.json { render json: @collection.to_json }
      format.json { render :json => { status: true, location: "/collections/#{@collection.id}", msg: "콜렉션을 등록하였습니다." }.to_json }
    end
  end
  
  
  
  private
  
  
  # collect 등록
  def drowCollect(params)
  	collection_id = params[:id]||""
  	
    #info (name, description, category_id, tages, share, contestId, oauth_providers)
    @collection = Collection.new
    
    if collection_id && collection_id!=""
    	@collection = Collection.find(collection_id)
    	CollectionProduct.where(collection_id: collection_id).destroy_all
    end
    
    items = params[:product]

    imgStyle = "original"
    collectionFilePath = "/public/data/collection/"
    productFilePath = "/public/data/product/"
    
    bg = Magick::Image.read(RAILS_ROOT+'/public/images/collection/bg_collect_650x650.png'){
      self.format = 'PNG'
    }.first
    
    items.each_with_index do |itemId, i|
      caption  = params["caption_product_#{itemId}"] 
      itemImg  = params["img_product_#{itemId}"]
      itemAPI  = params["api_product_#{itemId}"]
      itemURL  = params["url_product_#{itemId}"]

      # 4개까지만 이미지 merge
      if i<4
        left = 23
        top = 23
        case i
          when 0
            left = 23
            top = 23
          when 1
            left = 23
            top = 348
          when 2
            left = 348
            top = 23
          when 3
            left = 348
            top = 348
        end
        
        image_tmp = nil;
        if itemAPI=="shopstyle"
          image1_tmp = Magick::Image.read(itemImg).first
        else
          image1_tmp = Magick::Image.read(RAILS_ROOT+productFilePath+imgStyle+'/'+itemImg).first
        end
        
        if image1_tmp
          bg.composite!(image1_tmp.resize_to_fit(280), left, top, Magick::OverCompositeOp)
        end
      end
    end
    
    collection_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"

    bg.write(RAILS_ROOT+collectionFilePath+imgStyle+'/'+collection_file_name)
    
    # 썸네일 만들기
    
    bg_img = Magick::Image.read(RAILS_ROOT+collectionFilePath+imgStyle+'/'+collection_file_name).first
    
    thumb = bg_img.resize(220,220)
    #thumb = bg_img.resize_to_fit(220,220)
    thumb.write(RAILS_ROOT+collectionFilePath+'thumb/'+collection_file_name)

    # collections 저장
    @collection.subject = params[:name]
    @collection.contents = params[:description]
    @collection.user_id = session[:user_id]
    @collection.collection_type = 'collect'
    @collection.img_file_name = collection_file_name
    @collection.img_content_type = 'image/png'
    @collection.img_file_size = bg.filesize
    @collection.hit = 1
    @collection.save!
    
    # collections_products 저장
    items.each_with_index do |itemId, i|
      if i<4
        left = 23
        top = 23
        case i
          when 0
            left = 23
            top = 23
          when 1
            left = 23
            top = 348
          when 2
            left = 348
            top = 23
          when 3
            left = 348
            top = 348
        end
      end

      caption  = params["caption_product_#{itemId}"]
      itemImg = params["img_product_#{itemId}"]
      itemAPI  = params["api_product_#{itemId}"]
      itemURL  = params["url_product_#{itemId}"]
      
      # 상품등록
      if itemAPI=="shopstyle"
        cnt_item = Product.where(url: itemURL).count
        
        if cnt_item>0
          addProduct = Product.where(url: itemURL).first
        else
          addProduct = Product.getItemApi(itemId,session[:user_id])
        end
        
        itemId = addProduct.id
      end
      
      @collection_product = CollectionProduct.new
      @collection_product.collection_id = @collection.id
      @collection_product.product_id = itemId.to_i
      @collection_product.height = 280
      @collection_product.top = top
      @collection_product.left = left
      @collection_product.cssleft = top
      @collection_product.csstop = left
      @collection_product.zindex = i+1
      @collection_product.rotate = 0
      @collection_product.caption = caption  
      @collection_product.save! 
    end
    
    
    
  end
  
  
  # set 등록
  def drowSet(params)
    items = params[:items] 
    info  = params[:info]
    collection_id = params[:id]||""
    
    #info (name, description, category_d, tages, share, contestId, oauth_providers)
    @collection = Collection.new
    if collection_id && collection_id!=""
    	@collection = Collection.find(collection_id)
    	CollectionProduct.where(collection_id: collection_id).destroy_all
    end
    
    imgStyle = "original"
    collectionFilePath = "/public/data/collection/"
    productFilePath = "/public/data/product/"
    
    bg = Magick::Image.new(650, 650){
      self.background_color = 'white'
      self.format = 'PNG'
    }
    
    items = items.sort_by{|t| t[1][:zIndex].to_i} 

    items.each_with_index do |img, i|
      itemAPI    = img[1][:itemAPI]||""
      itemId     = img[1][:itemId]
      itemImg    = img[1][:itemImg]
      whiteBck   = img[1][:whiteBck]  #배경색 흰색으로
      flip       = img[1][:flip]
      flop       = img[1][:flop]
      itemOrigin = img[1][:itemOrigin]
      height     = img[1][:height]
      top        = img[1][:top]
      left       = img[1][:left]
      cssLeft    = img[1][:cssLeft]
      cssTop     = img[1][:cssTop]
      zIndex     = img[1][:zIndex]
      rotate     = img[1][:rotate]
      
      if whiteBck == 'true'
        imgStyle = "original"
      else
        imgStyle = "removebg"
      end
      
      image_tmp = nil;
      
      if itemAPI=="shopstyle"
        #image1_tmp = Magick::Image.read(itemImg).first
        r = open(itemImg)
        bytes = r.read
        image1_tmp = Magick::Image.from_blob(bytes).first
      else
        image1_tmp = Magick::Image.read(RAILS_ROOT+productFilePath+imgStyle+'/'+itemImg).first
      end

      if image1_tmp
        image1 = Magick::Image.new(image1_tmp.columns,image1_tmp.rows){
          if whiteBck == 'true'
            self.background_color = 'white'  # 배경 흰색채우기 
          else
            self.background_color = 'none' # 배경 제거
          end
        }
        image1.format = 'PNG'
        image1.composite!(image1_tmp, 0, 0, Magick::OverCompositeOp)
      
        if flip == 'true' 
          image1.flip! #상하뒤집기
        end
        
        if flop == 'true'
          image1.flop! #좌우뒤집기
        end
        
        #image1 = image1.transpose #왼쪽90회전
        #image1 = image1.transverse #오른쪽90회전
        #image1 = image1.vignette #부드러운 원 crop 처리
        
        #image1.resize_to_fill(70, 70)
        #image1.resize "400X300"
        
        #convert image1.png -fuzz 20% -transparent white result.png (배경제거명령어)
        
        bg.composite!(image1.resize_to_fit(height.to_i).rotate!(rotate.to_i), left.to_i, top.to_i, Magick::OverCompositeOp)
      end
    end
    
    
    collection_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"

    bg.write(RAILS_ROOT+collectionFilePath+'original/'+collection_file_name)
    
    # 썸네일 만들기
    bg_img = Magick::Image.read(RAILS_ROOT+collectionFilePath+'original/'+collection_file_name).first

    thumb = bg_img.resize(220,220) # 이미 정사각형 이미지니깐...
    #thumb = bg_img.resize_to_fit(220,220)
    thumb.write(RAILS_ROOT+collectionFilePath+'thumb/'+collection_file_name)
    #send_data(thumb.to_blob, :disposition => 'inline', :type => 'image/png')
    #Magick::Image.read(RAILS_ROOT+collectionFilePath+imgStyle+'/'+itemImg).first
    #bg_thumb = bg_img.scale(220,220)
    #bg_img.resize_to_fit!(220)
    #bg_img.write(RAILS_ROOT+collectionFilePath+'thumb/'+collection_file_name){self.quality = 100}
    #thumbnail = bg_img.thumbnail(220)
    #thumbnail.write(RAILS_ROOT+collectionFilePath+'thumb/'+collection_file_name){self.quality = 100}
    
    # collections 저장
    @collection.subject = info["name"]
    @collection.contents = info["description"]
    @collection.user_id = session[:user_id]
    @collection.collection_type = 'set'
    @collection.img_file_name = collection_file_name
    @collection.img_content_type = 'image/png'
    @collection.img_file_size = bg.filesize
    @collection.hit = 1
    @collection.save!
    
    # collections_products 저장
    items.each_with_index do |img, i|
      itemAPI    = img[1][:itemAPI]||""
      itemURL    = img[1][:itemURL]||""
      itemId     = img[1][:itemId]
      itemImg    = img[1][:itemImg]
      whiteBck   = img[1][:whiteBck]  #배경색 흰색으로
      flip       = img[1][:flip]
      flop       = img[1][:flop]
      itemOrigin = img[1][:itemOrigin]
      height     = img[1][:height]
      top        = img[1][:top]
      left       = img[1][:left]
      cssLeft    = img[1][:cssLeft]
      cssTop     = img[1][:cssTop]
      zIndex     = img[1][:zIndex]
      rotate     = img[1][:rotate]

      # 상품등록
      if itemAPI=="shopstyle"
        cnt_item = Product.where(url: itemURL).count

        if cnt_item>0
          addProduct = Product.where(url: itemURL).first
        else
          addProduct = Product.getItemApi(itemId,session[:user_id])
        end
        
        itemId = addProduct.id
      end
      
      @collection_product = CollectionProduct.new
      @collection_product.collection_id = @collection.id
      @collection_product.product_id = itemId.to_i
      @collection_product.white_bck = whiteBck
      @collection_product.flip = flip
      @collection_product.flop = flop
      @collection_product.height = height.to_i
      @collection_product.top = top
      @collection_product.left = left
      @collection_product.cssleft = cssLeft
      @collection_product.csstop = cssTop
      @collection_product.zindex = zIndex.to_i
      @collection_product.rotate = rotate.to_f
        
      @collection_product.save! 
    end
    
  end
  
  
  
end
