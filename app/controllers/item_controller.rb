#encoding: utf-8

require 'open-uri'
require 'uri'

include ApplicationHelper

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
	
		@currency_usd = 0
		@currency_jpy = 0
		@currency_eur = 0
		@currency_gbp = 0
		@currency_cny = 0
		
		# 환율정보를 가져온다
		sysconfigs = Sysconfig.where(config_type: "currency", use_yn: "Y")
		sysconfigs.each do |sysconfig|
			if sysconfig.config_key=="USD"
				@currency_usd = sysconfig.config_value 
			elsif sysconfig.config_key=="JPY"
				@currency_jpy = sysconfig.config_value
			elsif sysconfig.config_key=="EUR"
				@currency_eur = sysconfig.config_value
			elsif sysconfig.config_key=="GBP"
				@currency_gbp = sysconfig.config_value
			elsif sysconfig.config_key=="CNY"
				@currency_cny = sysconfig.config_value
			end
		end
		
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
		collection_id	= params[:collection_id]
		session_user_id = session[:user_id]||""
		
		collection = Collection.find(collection_id)
		item_type = collection.item_type
		
		if session_user_id && session_user_id!=""
			if get_yn=="Y"	# like에서 삭제
				count = Get.where(get_type: "L", collection_id: collection_id, user_id: session_user_id).count
				if count>0
					Get.where(get_type: "L", collection_id: collection_id, user_id: session_user_id).destroy_all
				end
			else
				if item_type=="P"
					product = Product.select("*").from("vw_collectionlist").where("id=#{collection_id}").first
					#product = Product.find(collection_id)
					if session_user_id == product.user_id	# 나의 상품이면 사용여부 N
						product.use_yn = "N"
						product.save!
					else	# 다른 스토어 상품이면 user_items에서 삭제
						item_count	= UserItem.where(user_id: session_user_id, collection_id: collection_id).count
						if item_count>0
							UserItem.where(user_id: session_user_id, collection_id: collection_id).destroy_all
						end
					end
					
				elsif item_type=="C"
					collection = Collection.find(collection_id)
					collection.use_yn = "N"
#					collection.save!
				end
			
			end
			
		end
		
		status = true

		respond_to do |format|
			format.json { render :json => { status: status }.to_json }
		end
	end
	
	# image crop
	def crop
		itemId		= params[:itemId]
		itemStyle	= params[:itemStyle]
		itemOrigin	= params[:itemOrigin]
		cropHeight	= params[:cropHeight]
		cropType		= params[:cropType]	#polygonal, rectangular
		cropPoints	= params[:cropPoints]

		product = Product.find(itemId)
		
		new_file_name = ApplicationHelper.randomize_name+".png"
		
		if product.img_file_name && product.img_file_name!=""
		
			dataFilePath = "/public/data/product/"
			original = Magick::Image.read("#{RAILS_ROOT}#{dataFilePath}#{itemStyle}/#{product.img_file_name}").first
			crop_rate = original.rows.to_f / cropHeight.to_f

			if original
				cropPath = ""
				
				if cropType=="rectangular"
					crop_x = 0
					crop_y = 0
					crop_width = 0
					crop_height = 0
					
					cropPoints.each_with_index do |point,i|
						original_point = point.to_f * crop_rate
						if i==0
							crop_x = original_point.to_i
						elsif i==1
							crop_y = original_point.to_i
						elsif i==2
							crop_width = original_point.to_i-crop_x
						elsif i==3
							crop_height = original_point.to_i-crop_y
						end
					end

					chopped = original.crop(crop_x, crop_y, crop_width, crop_height)
					
					bg = Magick::Image.new(crop_width, crop_height){self.background_color="transparent"}
					bg = bg.composite(chopped, 0, 0, Magick::OverCompositeOp)
					bg.write("#{RAILS_ROOT}#{dataFilePath}crop/#{new_file_name}")
					
				elsif cropType=="polygonal"
					cropPoints.each_with_index do |point,i|
						original_point = point.to_f * crop_rate
						if i%2==0
							cropPath += " +#{original_point}"
						else
							cropPath += "+#{original_point}"
						end
					end
									
					%x{convert -size #{original.columns}x#{original.rows} xc:black -fill white -stroke black -draw "path 'M #{cropPath}'" #{RAILS_ROOT}#{dataFilePath}tmp/crop_bg.png}
					if itemStyle=="removebg"
						%x{convert #{RAILS_ROOT}#{dataFilePath}#{itemStyle}/#{product.img_file_name} #{RAILS_ROOT}#{dataFilePath}tmp/crop_bg.png -alpha off -compose CopyOpacity -composite -fuzz 2% -transparent white #{RAILS_ROOT}#{dataFilePath}tmp/crop_combined.png}
					else
						%x{convert #{RAILS_ROOT}#{dataFilePath}#{itemStyle}/#{product.img_file_name} #{RAILS_ROOT}#{dataFilePath}tmp/crop_bg.png -alpha off -compose CopyOpacity -composite #{RAILS_ROOT}#{dataFilePath}tmp/crop_combined.png}
					end
					
					%x{convert #{RAILS_ROOT}#{dataFilePath}tmp/crop_combined.png -alpha set -virtual-pixel transparent -channel A -blur 0x0.7 -level 50,100% +channel -background none -flatten -trim #{RAILS_ROOT}#{dataFilePath}crop/#{new_file_name}}
					
					# crop한 이미지를 가져와서 정사각형 안에 넣는다
					new_img = Magick::Image.read("#{RAILS_ROOT}#{dataFilePath}crop/#{new_file_name}").first
					
					%x{convert #{RAILS_ROOT}#{dataFilePath}crop/#{new_file_name} -background none -gravity center -extent #{new_img.columns}x#{new_img.rows} #{RAILS_ROOT}#{dataFilePath}crop/#{new_file_name}}
					
					%x{rm -f #{RAILS_ROOT}#{dataFilePath}tmp/*}
				end

			end

		end
		
		respond_to do |format|
			format.json { render :json => { status: true, cropImg: new_file_name, img_src: "/data/product/crop/#{new_file_name}" }.to_json }
		end
		
	end
  
end
