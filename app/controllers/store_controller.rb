#encoding: utf-8

class StoreController < ApplicationController
  
  def topstore
    @store_type = params[:store_type]||"F"
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
           , profile_id, email, user_name, url, img_file_name")
    .from( str_from )
    .where("1=1")
    .order("rank ASC")
    
    
    @store_list = Array.new(stores.count) {Array.new(3,nil)}
    
    rcnt = 0
    stores.each{ |store|
      if @store_type=="I"
        products = Product.paginate(page: 1, per_page: 8).where(user_id: store.user_id).order('hit DESC')
      elsif @store_type=="F"
        params[:searchKey] = store.profile_id
        params[:page] = 1
        params[:per_page] = 8
        params[:img_style] = "Large"
        products = Product.getItemListApi(params)
      end
      
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
