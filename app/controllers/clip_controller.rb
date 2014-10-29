#encoding: utf-8

include ApplicationHelper

class ClipController < ApplicationController
  
  
  layout 'clip'
  
  def new
    @domain = params[:domain]
    @url = params[:url]
    @subject = params[:subject]
    @imgurl = params[:imgurl]
    
    # 등록여부 가져오기(url체크)
    @cnt_img = Product.where(url: @url).count
    
    respond_to do |format|
      format.html # clip.html.erb
      #format.json { render json: @url }
    end
  end
  
  
  def post
    @product = Product.new(params[:product])
    
    @item_imgurl = params[:item_imgurl]
    @item_domain = params[:item_domain]
    @item_url = params[:item_url]
    @item_subject = params[:item_subject]
    @item_price = params[:item_price]
    @item_price_type = params[:item_price_type]
    @item_merchant = ApplicationHelper.domain_name(@item_domain)

    # 스토어 확인
    cnt_store1 = User.where(url: 'http://'+@item_domain, user_type: 'S').count
    cnt_store2 = User.where(email: @item_domain, user_type: 'S').count
    cnt_store3 = User.where(unique_key: @item_domain).count
    cnt_store4 = User.where(profile_id: @item_merchant).count
    
    if cnt_store1>0
      store = User.where(url: 'http://'+@item_domain, user_type: 'S').first
    elsif cnt_store2>0
      store = User.where(email: @item_domain, user_type: 'S').first
    elsif cnt_store3>0
      store = User.where(unique_key: @item_domain).first
    elsif cnt_store4>0
      store = User.where(profile_id: @item_merchant).first
    else
      store = User.addStore(@item_domain,"","","R")
    end
    
    
    # 이미지 저장
    cnt_product = Product.where(url: @item_url).count
    add_product = Product.new
    if cnt_product>0
      add_product = Product.where(url: @item_url).first
    else
      imgStyle = "original"
      dataFilePath = "/public/data/product/"
      product_file_name = ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)+".png"
  
      #tmpimg = Magick::Image.read(@item_imgurl).first
      r = open(@item_imgurl)
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
      ipos = ApplicationHelper.get_resize_fit(thumbSize,tmpimg.columns,tmpimg.rows)
      tmpimg.resize!(ipos[0],ipos[1])
      tmpimg.write(RAILS_ROOT+dataFilePath+'original/'+product_file_name)
      tmpimg.write(RAILS_ROOT+dataFilePath+'removebg/'+product_file_name)
      
      thumbSize = 220
      ipos = ApplicationHelper.get_resize_fit(thumbSize,tmpimg.columns,tmpimg.rows)
      thumb = tmpimg.resize!(ipos[0],ipos[1])
      bg = Magick::Image.new(thumbSize,thumbSize){
        self.background_color = 'white'
        self.format = 'PNG'
      }
      bg.composite!(thumb, ipos[2], ipos[3], Magick::OverCompositeOp)
      bg.write(RAILS_ROOT+dataFilePath+'medium/'+product_file_name)
      
      thumbSize = 75
      bg.resize!(thumbSize,thumbSize)
      bg.write(RAILS_ROOT+dataFilePath+'thumb/'+product_file_name)
      
      # 이미지 배경제거 (remove_bg.bat 원본디렉토리 원본이미지 target디렉토리 배경제거비율)
      #%x{remove_bg.bat #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
      %x{sh remove_bg #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
      
      # 이미지 대표색상코드 추출
      colors = ApplicationHelper.get_product_color(product_file_name)
      @product.color_code_o = colors[0] 
      @product.color_code_s = colors[1]
      
      @product.subject    = @item_subject
      @product.price      = @item_price
      @product.price_type = @item_price_type
      @product.url        = @item_url
      @product.img_file_name    = product_file_name
      @product.img_content_type = "image/png"
      @product.img_file_size    = 0
      @product.hit        = 1
      #@product.user_id    = session[:user_id]
      @product.user_id    = store.id
      @product.use_yn     = 'R'
      @product.merchant   = @item_merchant

      # 상품정보 저장
      add_collection = Product.addProduct(@product)
    end
    
    @product = add_collection
    
    # 회원 상품 연결 정보 추가 저장
    cnt_user_item = UserItem.where(user_id: session[:user_id], collection_id: add_collection.id).count
    if cnt_user_item==0
      user_item = UserItem.new
      user_item.user_id = session[:user_id]
      user_item.collection_id = add_collection.id
      user_item.save!
    end

    respond_to do |format|
      format.html # post.html.erb
      format.json { render json: @product }
    end

  end

  
end
