#encoding: utf-8

class StoreController < ApplicationController
  
  def topstore
    cmenu = params[:cmenu]||"3"
    cmenu_sub = params[:cmenu_sub]||"1"
    params[:cmenu] = cmenu
    params[:cmenu_sub] = cmenu_sub
    
    @store_type = params[:store_type]||"I"
    @session_user_id = session[:user_id]
    
    str_from = "(
                  SELECT A.user_id, A.user_type, A.store_type, A.follow_count, A.product_count, A.rank
                       , B.profile_id, B.email, B.user_name, B.url, B.img_file_name
                    FROM user_ranks A, users B
                   WHERE A.user_id = B.id
                     AND A.rank_type = 'top_store'
                     AND A.store_type='"+@store_type+"'
                   ORDER BY A.rank ASC
                   LIMIT 0,20
                ) X "
    
    stores = User
    .select("user_id, user_type, store_type, follow_count, product_count, rank
           , profile_id, email, user_name, url, img_file_name
           , F_COUNT_PRODUCTS(user_id) AS cnt_product
           , F_COUNT_FOLLOWS(user_id, 'follower') AS cnt_follower")
    .from( str_from )
    .where("1=1")
    .order("rank ASC")
    
    # store 2차원배열
    # @store_list = [{},{}]
    @store_list = Array.new(stores.count) {Array.new(3,nil)}
    
    rcnt = 0
    stores.each{ |store|
      products = Product.paginate(page: 1, per_page: 8).where(user_id: store.user_id).order('hit DESC')
      
      follow_count = 0
      if @session_user_id
        follow_count = Follow.where(user_id: @session_user_id, follow_id: store.user_id).count
      end 
      
      @store_list[rcnt][0] = store
      @store_list[rcnt][1] = products
      @store_list[rcnt][2] = follow_count
      
      rcnt += 1
    }
    

    respond_to do |format|
      format.html
      format.json { render json: @store_list.to_json }
      #format.json { render :json => { status: true, result: result, product_list: product_list }.to_json }
    end
  end
  

  
end
