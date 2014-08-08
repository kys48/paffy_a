#encoding: utf-8

class MypageController < ApplicationController
  
  def index
    @session_user_id = session[:user_id]||""
    
    if @session_user_id && @session_user_id!=""
      @user = User.find(@session_user_id)
      redirect_to('/mypage/'+@user.profile_id)
    else
      redirect_to '/log_in'
    end
  end
  
  # 프로필 
  def show
    @session_user_id = session[:user_id]
    @profile_id = params[:id]
    @item_type = params[:type]
    @user = User.where(profile_id: @profile_id).first
    
    # 팔로우 여부 가져오기
    @follow_count = Follow.where(user_id: @session_user_id, follow_id: @user.id).count
    
    # 스크랩 수 가져오기
    #@cnt_scrap = Get.where(get_type: 'S', item_type: 'C', ref_id: collection_id).count
    @cnt_scrap = 10
    
    # 포스팅한 상품, 콜렉션
    #@collections = Collection.paginate(page: params[:page], per_page: 16).where(user_id: @user.id).order('created_at DESC')

    # 찜한 상품, 콜렉션
    #@collections = Collection.itemList(params)
    
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @collections }
    end
  end
  
  # 프로필 ajax
  def itemListCallback
    params[:session_user_id] = session[:user_id]
    profile_id = params[:id]
    page = params[:page]||1
    item_type = params[:type]
    #user = User.where(profile_id: @profile_id).first

    # 찜한 상품, 콜렉션
    collectionList = Collection.itemList(params)
    
    collectionList.each_with_index do |collection,i|
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
      #collections << collection
    end
    
    respond_to do |format|
      format.json { render :json => { status: true, collections: collectionList }.to_json }
    end
  end
  
  # Mypage 
  def myfeed
    @session_user_id = session[:user_id]||""
    params[:cmenu] = "4"
    
    if @session_user_id && @session_user_id!=""
      @profile_id = session[:profile_id]
      @item_type = params[:type]
      params[:id] = @profile_id
      params[:per_page] = 16
      params[:myfeed] = "Y"
  
      # 찜한 상품, 콜렉션
      #@collections = Collection.itemList(params)
      
      respond_to do |format|
        format.html # myfeed.html.erb
        format.json { render json: @collections }
      end
      
      
    else
      redirect_to '/log_in'
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
