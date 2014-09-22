#encoding: utf-8

class MainController < ApplicationController
  
  def index
    cmenu = params[:cmenu]||"1"
    cmenu_sub = params[:cmenu_sub]||"1"
    params[:cmenu] = cmenu
    params[:cmenu_sub] = cmenu_sub
    
    @session_user_id = session[:user_id]||""
    @item_type = params[:type]||""
    @style_type = params[:style_type]||""
    @store_type = params[:store_type]||""
    params[:per_page] = 15
    #params[:order] = " RAND() "
    #params[:order] = " created_at DESC "
    params[:order] = " hit DESC "
    
    # 추천 스토어 list
    search_params = Hash.new
    search_params[:page] = 1
    search_params[:per_page] = 10
    search_params[:rank_type] = "recommend"
    search_params[:store_type] = "FB"
    
    @store_list0 = UserRank.storeList(search_params)
    
    search_params[:store_type] = "OM"
    @store_list1 = UserRank.storeList(search_params)
    
    search_params[:store_type] = "WF"
    @store_list2 = UserRank.storeList(search_params)
    
    search_params[:store_type] = "AK"
    @store_list3 = UserRank.storeList(search_params)
    
    search_params[:store_type] = "BH"
    @store_list4 = UserRank.storeList(search_params)
    
    @currency_usd = 0
    @currency_jpy = 0
    @currency_eur = 0
    @currency_gbp = 0
    @currency_cny = 0

    if @store_type=="F"
      @currency_usd = GoogCurrency.usd_to_krw(1).to_i
      @currency_jpy = GoogCurrency.jpy_to_krw(1).to_i
      @currency_eur = GoogCurrency.eur_to_krw(1).to_i
      @currency_gbp = GoogCurrency.gbp_to_krw(1).to_i
      @currency_cny = GoogCurrency.cny_to_krw(1).to_i
    end

    # 찜한 상품, 콜렉션
    params[:session_user_id] = @session_user_id
    
    if params[:cmenu_sub]=="2" || params[:cmenu_sub]=="3"
    	params[:limit_hit] = 0  # hit수가 0이상인 상품만 뿌려준다
    else
    	params[:limit_hit] = 2  # hit수가 2이상인 상품만 뿌려준다
    end
    
    @limit_hit = params[:limit_hit]
    
    
    @collections = Collection.itemList(params)
    @collectionSize = @collections.size
    
    @cateList = Cate.all()

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @collections }
    end
  end
  
  # 메인페이지 ajax
  def itemListCallback
    params[:session_user_id] = session[:user_id]
    page = params[:page]||1
    item_type = params[:type]||"P"
    params[:per_page] = 16

    # 찜한 상품, 콜렉션
    collectionList = Collection.itemList(params)
    
    respond_to do |format|
      format.json { render :json => { status: true, collections: collectionList }.to_json }
    end
  end
  
  # 통합검색
  def search
    @search_key = params[:search_key]
    @currency_usd = GoogCurrency.usd_to_krw(1).to_i
    @currency_jpy = GoogCurrency.jpy_to_krw(1).to_i
    @currency_eur = GoogCurrency.eur_to_krw(1).to_i
    @currency_gbp = GoogCurrency.gbp_to_krw(1).to_i
    @currency_cny = GoogCurrency.cny_to_krw(1).to_i
    
    @cateList = Cate.all()
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @collections }
    end
  end
  
  
end
