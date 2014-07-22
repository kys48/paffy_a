#encoding: utf-8

class MainController < ApplicationController
  
  def index
    #exec("ls -l")
    #system "ls -l"
    
    @item_type = params[:type]
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
    
    # 찜한 상품, 콜렉션
    @collections = Collection.itemList(params)
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @collections }
    end
  end
  
  # 메인페이지 ajax
  def itemListCallback
    page = params[:page]||1
    item_type = params[:type]
    params[:per_page] = 16

    # 찜한 상품, 콜렉션
    @collections = Collection.itemList(params)
    
    respond_to do |format|
      #format.json { render json: @collections.to_json }
      format.json { render :json => { status: true, collections: @collections }.to_json }
    end
  end
  
  
end
