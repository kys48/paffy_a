#encoding: utf-8

class StoreController < ApplicationController
  
  def topstore
    cmenu = params[:cmenu]||"3"
    cmenu_sub = params[:cmenu_sub]||"1"
    params[:cmenu] = cmenu
    params[:cmenu_sub] = cmenu_sub
    
    @store_type = params[:store_type]||"I"
    @session_user_id = session[:user_id]

    respond_to do |format|
      format.html
      #format.json { render json: @store_list.to_json }
      #format.json { render :json => { status: true, result: result, product_list: product_list }.to_json }
    end
  end
  

  # 페이지 ajax
  def storeListCallback
    session_user_id = session[:user_id]
    page = params[:page]||1
    item_type = params[:type]||"P"
    params[:per_page] = 8

    cmenu = params[:cmenu]||"3"
    cmenu_sub = params[:cmenu_sub]||"1"
    params[:cmenu] = cmenu
    params[:cmenu_sub] = cmenu_sub
    
    stores	= User.storeList(params)
    
    # store 2차원배열
    # store_list = [{},{}]
    store_list = Array.new(stores.count) {Array.new(3,nil)}
    
    rcnt = 0
    stores.each{ |store|
      products = Product.paginate(page: 1, per_page: 8).where(user_id: store.user_id, use_yn: 'Y').order('hit DESC')
      
      follow_count = 0
      if session_user_id && session_user_id!=""
        follow_count = Follow.where(user_id: session_user_id, follow_id: store.user_id).count
      end 
      
      store_list[rcnt][0] = store
      store_list[rcnt][1] = products
      store_list[rcnt][2] = follow_count
      
      rcnt += 1
    }
    
    respond_to do |format|
      format.json { render :json => { status: true, store_list: store_list }.to_json }
    end
  end
  
  
end
