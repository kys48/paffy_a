#encoding: utf-8

require 'nokogiri'
require 'uri'
require 'erb'
include ERB::Util

class ItemController < ApplicationController

	# product API 이용
	def getProductList
		cmenu = params[:cmenu]||"2"
		cmenu_sub = params[:cmenu_sub]||"1"
		params[:cmenu] = cmenu
		params[:cmenu_sub] = cmenu_sub
		
		@session_user_id = session[:user_id]||""
		@cate_code = params[:cate_code]
		@item_type = "P"
		
		@currency_usd = GoogCurrency.usd_to_krw(1).to_i
		@currency_jpy = GoogCurrency.jpy_to_krw(1).to_i
		@currency_eur = GoogCurrency.eur_to_krw(1).to_i
		@currency_gbp = GoogCurrency.gbp_to_krw(1).to_i
		@currency_cny = GoogCurrency.cny_to_krw(1).to_i
    
		respond_to do |format|
			format.html
			#format.json { render json: @search_key }
		end
	end

# shopstyle API ajax
  def getShopStyleCallback
    params[:per_page] = params[:per_page]||16
    params[:save_yn] = "Y"
    
puts("#{params[:page]} page : #{Time.zone.now}")

    # 찜한 상품, 콜렉션
    productList = Product.getItemListApi(params)
   
    respond_to do |format|
      #format.json { render json: productList.to_json }
      format.json { render :json => { status: true, products: productList }.to_json }
    end
  end
  
  
	# 나의 item(상품,콜렉션) 및 like한 item 삭제
	def removeItemCallback
		get_yn	= params[:get_yn]
		stat		= params[:stat]
		ref_id	= params[:ref_id]
		session_user_id = session[:user_id]||""
		
		if session_user_id && session_user_id!=""
			if get_yn=="Y"	# like에서 삭제
				count = Get.where(get_type: "L", item_type: stat, ref_id: ref_id, user_id: session_user_id).count
				if count>0
					Get.where(get_type: "L", item_type: stat, ref_id: ref_id, user_id: session_user_id).destroy_all
				end
			else
				if stat=="P"
					product = Product.find(ref_id)
					if session_user_id == product.user_id	# 나의 상품이면 사용여부 N
						product.use_yn = "N"
						product.save!
					else	# 다른 스토어 상품이면 user_items에서 삭제
						item_count	= UserItem.where(user_id: session_user_id, ref_id: ref_id).count
						if item_count>0
							UserItem.where(user_id: session_user_id, ref_id: ref_id, item_type: "P").destroy_all
						end
					end
					
				elsif stat=="C"
					collection = Collection.find(ref_id)
					collection.use_yn = "N"
					collection.save!
				end
			
			end
			
		end
		
		status = true

		respond_to do |format|
			format.json { render :json => { status: status }.to_json }
		end
	end
  
end
