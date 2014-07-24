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
      format.json { render json: @product }
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
    @item_merchant = domain_name(@item_domain)
    
    # 스토어 확인
    cnt_store1 = User.where(url: 'http://'+@item_domain, user_type: 'S').count
    cnt_store2 = User.where(email: @item_domain, user_type: 'S').count
    
    if cnt_store1>0
      store = User.where(url: 'http://'+@item_domain, user_type: 'S').first
    elsif cnt_store2>0
      store = User.where(email: @item_domain, user_type: 'S').first
    else
      store = User.addStore(@item_domain,"")
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
  
      tmpimg = Magick::Image.read(@item_imgurl).first
      tmpimg.write(RAILS_ROOT+dataFilePath+'original/'+product_file_name)
      
      tmpimg.resize!(220,220)
      tmpimg.write(RAILS_ROOT+dataFilePath+'medium/'+product_file_name)
      
      tmpimg.resize!(75,75)
      tmpimg.write(RAILS_ROOT+dataFilePath+'thumb/'+product_file_name)
      
      # 이미지 배경제거 (remove_bg.bat 원본디렉토리 원본이미지 target디렉토리 배경제거비율)
      %x{remove_bg.bat #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
      
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
      @product.use_yn     = 'Y'
      @product.merchant   = @item_merchant

      # 상품정보 저장
      add_product = Product.addProduct(@product)
    end
    
    @product = add_product
    
    # 회원 상품 연결 정보 저장
    cnt_user_item = UserItem.where(user_id: session[:user_id], ref_id: add_product.id).count
    if cnt_user_item==0
      user_item = UserItem.new
      user_item.user_id = session[:user_id]
      user_item.ref_id = add_product.id
      user_item.item_type = 'P'
      user_item.save!
    end

    # 스토어 상품 연결 정보 저장
    cnt_store_item = UserItem.where(user_id: store.id, ref_id: add_product.id).count
    if cnt_store_item==0
      store_item = UserItem.new
      store_item.user_id = store.id
      store_item.ref_id = add_product.id
      store_item.item_type = 'P'
      store_item.save!
    end

    respond_to do |format|
      format.html # post.html.erb
      format.json { render json: @product }
    end

  end

  private
  
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
