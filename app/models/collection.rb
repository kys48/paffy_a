#require 'RMagick'
#include Magick

class Collection < ActiveRecord::Base
	attr_accessible :item_type, :user_id, :collection_type, :subject, :contents, :hit, :use_yn, :img, :img_file_name, :img_content_type, :img_file_size
	has_many :collection_products, dependent: :destroy

	has_attached_file :img,
							:styles => {
								:medium => "220x220>", 
								:thumb => "220x220>" 
							},
							:default_url => "/imgs/:style/missing.png",
							#:path => ":rails_root/public/:attachment/:id/:style/:basename.:extension",
							#:url => "/:attachment/:id/:style/:basename.:extension"
							:path => ":rails_root/public/data/collection/:style/:basename.:extension",
							:url => "/data/collection/:style/:basename.:extension"

	# 상품, 콜렉션 리스트
	def self.mainItemList(params)
		profile_id	= params[:id]
		item_type	= params[:type]||""
		page			= params[:page]||1
		per_page		= params[:per_page]||16
		order			= params[:order]||"A.hit DESC"
		search_key	= params[:search_key]||""
		price_stat	= params[:price_stat]||"0"
		color_code	= params[:color_code]||""
		cate_code	= params[:cate_code]||""
		store_type	= params[:store_type]||""
		style_type	= params[:style_type]||""
		session_user_id	= params[:session_user_id]||""
		limit_hit		= params[:limit_hit]||""
		follow			= params[:follow]||""
		use_yn			= params[:use_yn]||"Y,R"

		currency_usd	= params[:currency_usd]||"1"
		currency_jpy	= params[:currency_jpy]||"1"
		currency_eur	= params[:currency_eur]||"1"
		currency_gbp	= params[:currency_gbp]||"1"
		currency_cny	= params[:currency_cny]||"1"

		if cate_code == "All"
			cate_code = ""
		end
		
		if store_type == "All"
			store_type = ""
		end
		
		page      = page.to_i
		per_page  = per_page.to_i
		 
		if search_key && search_key!=""
			search_key = search_key.gsub(/\+/," ")
			search_key = search_key.gsub(/\=/," ")
			search_key = search_key.gsub(/_/," ")
			search_key = search_key.gsub(/%/," ")
			search_key = search_key.gsub(/\|/," ")
			search_key = search_key.gsub(/\&/," ")
			search_key = search_key.strip().downcase
			
			search_keys = search_key.split(" ")
		end
		
		if use_yn && use_yn!=""
			use_yns = use_yn.split(",")
		end
		    
		chk_union = false

		if profile_id
			user = User.where(profile_id: profile_id).first
		end
		
		str_select = "id
						, item_type
						, user_id
						, img_file_name
						, collection_type
						, subject
						, hit
						, created_at
						, img_updated_at
						, use_yn
						, price
						, price_type
						, merchant
						, url
						, profile_id
						, user_name
						, store_type
						, F_COUNT_GETS(id,'L') AS cnt_like"
		if session_user_id && session_user_id!=""
			str_select += ", F_COUNT_GETS_USER(id,'L','#{session_user_id}') AS cnt_like_user"
		else
			str_select += ", 0 AS cnt_like_user"
		end
		
		str_select += ", CASE WHEN CHAR_LENGTH(F_REMOVE_HTML(subject))<20 THEN F_REMOVE_HTML(subject) ELSE CONCAT(SUBSTRING(F_REMOVE_HTML(subject),1,20),'..') END AS subject
							, subject AS subject_full"
		
		str_from = "(SELECT A.id
								, A.item_type
								, A.user_id
								, A.img_file_name
								, A.collection_type
								, A.subject
								, A.hit
								, A.created_at
								, A.img_updated_at
								, A.use_yn
								, C.price
								, C.price_type
								, C.merchant
								, C.url
								, D.profile_id
								, D.user_name
								, D.store_type"
							
		#str_from += "  FROM collections A, (SELECT collection_id, MAX(product_id) AS product_id FROM collection_products GROUP BY collection_id) B, products C, users D "
		#str_from += " WHERE A.id=B.collection_id AND B.product_id=C.id AND A.user_id=D.id "
		str_from += "  FROM collections A LEFT OUTER JOIN products C ON A.product_id=C.id, users D "
		str_from += " WHERE A.user_id=D.id "

		if item_type && item_type!=''
			str_from += "    AND A.item_type='#{item_type}'"
		end
		
		if use_yn && use_yn!=""
			str_from += "    AND A.use_yn IN ("
			use_yns.each_with_index do |key,i|
				if i>0
					str_from += ","
				end 
				str_from += "'#{key}'"
			end
			str_from += ")"
		end

		if profile_id
			str_from += "    AND ("
			str_from += "          A.user_id=#{user.id}"
			if myfeed=="Y" && follow=="Y"
				str_from += "       OR A.user_id IN (SELECT follow_id FROM follows WHERE user_id = "+user.id.to_s+")"
				str_from += "       OR A.id IN (SELECT collection_id FROM gets WHERE get_type='L' AND user_id = "+user.id.to_s+")"
			end
			str_from += "    )"
		end

		if search_key && search_key!=""
			str_from += "    AND ("
			str_from += "          LOWER(A.subject) LIKE '%#{search_key}%' "
			str_from += "       OR LOWER(C.cate_code) LIKE '%#{search_key}%' "
			str_from += "       OR LOWER(C.merchant) LIKE '%#{search_key}%' "
			search_keys.each do |key|
				str_from += "       OR LOWER(A.subject) LIKE '%#{key}%' "
				str_from += "       OR LOWER(C.cate_code) LIKE '%#{key}%' "
				str_from += "       OR LOWER(C.merchant) LIKE '%#{key}%' "
				str_from += "       OR LOWER(D.user_name) LIKE '%#{key}%' "
				str_from += "       OR LOWER(D.profile_id) LIKE '%#{key}%' "
			end
			str_from += "    )"
		end

		if price_stat && price_stat!="" && price_stat!="0"
			str_from += "    AND C.price IS NOT NULL "
			case price_stat
				when "1"
					str_from += " AND (C.price*( CASE C.price_type 
															WHEN 'USD' THEN "+currency_usd+" 
															WHEN 'JPY' THEN "+currency_jpy+"
															WHEN 'EUR' THEN "+currency_eur+"
															WHEN 'GBP' THEN "+currency_gbp+"
															WHEN 'CNY' THEN "+currency_cny+"
															ELSE 1 
															END )
										) <=20000 "
				when "2"
					str_from += " AND (C.price*( CASE C.price_type 
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 20000 AND 50000"
				when "3"
					str_from += " AND (C.price*( CASE C.price_type  
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 50000 AND 100000"
				when "4"
					str_from += " AND (C.price*( CASE C.price_type  
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 100000 AND 200000"
				when "5"
					str_from += " AND (C.price*( CASE C.price_type  
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 200000 AND 500000"
				when "6"
					str_from += " AND (C.price*( CASE C.price_type  
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) >= 500000"
			end
		end
    
		if color_code && color_code!=""
			str_from += "    AND C.color_code_s IN ('#{color_code}') "
		end
		 
		if cate_code && cate_code!=""
			str_from += "    AND C.cate_code='#{cate_code}'"
		end
		 
		if store_type && store_type!=""
			str_from += "    AND D.store_type='#{store_type}'"
		end
		 
		if style_type && style_type!=""
			str_from += "    AND C.style_type='#{style_type}'"
		end
		 
		if limit_hit && limit_hit!=""
			str_from += "    AND A.hit>=#{limit_hit}"
		else
			str_from += "    AND A.hit>0 "
		end
		
		
		#str_from += " GROUP BY A.id "
		str_from += " ORDER BY #{order}"
		str_from += " LIMIT #{per_page} OFFSET #{(page.to_i-1)*per_page}"
		str_from += ") X "

		collections = Collection.select(str_select).from(str_from).where("1=1")
							
=begin
		collections = Collection.paginate(page: page, per_page: per_page)
							.select(str_select)
							.from(str_from)
							.where("1=1")
							.order(order)
=end
		return collections

	end
	
	
	# 상품, 콜렉션 리스트
	def self.itemList(params)
		profile_id	= params[:profile_id]
		item_type	= params[:item_type]||""
		page			= params[:page]||1
		per_page		= params[:per_page]||16
		order			= params[:order]||"A.hit DESC"
		search_key	= params[:search_key]||""
		price_stat	= params[:price_stat]||"0"
		color_code	= params[:color_code]||""
		cate_code	= params[:cate_code]||""
		store_type	= params[:store_type]||""
		style_type	= params[:style_type]||""
		session_user_id	= params[:session_user_id]||""
		limit_hit		= params[:limit_hit]||""
		follow			= params[:follow]||""
		like				= params[:like]||""
		use_yn			= params[:use_yn]||"Y,R"
		myitem			= params[:myitem]||""

		currency_usd	= params[:currency_usd]||"1"
		currency_jpy	= params[:currency_jpy]||"1"
		currency_eur	= params[:currency_eur]||"1"
		currency_gbp	= params[:currency_gbp]||"1"
		currency_cny	= params[:currency_cny]||"1"

		if cate_code == "All"
			cate_code = ""
		end
		
		if store_type == "All"
			store_type = ""
		end
		
		page      = page.to_i
		per_page  = per_page.to_i
		 
		if search_key && search_key!=""
			search_key = search_key.gsub(/\+/," ")
			search_key = search_key.gsub(/\=/," ")
			search_key = search_key.gsub(/_/," ")
			search_key = search_key.gsub(/%/," ")
			search_key = search_key.gsub(/\|/," ")
			search_key = search_key.gsub(/\&/," ")
			search_key = search_key.strip().downcase
			
			search_keys = search_key.split(" ")
		end
		
		if use_yn && use_yn!=""
			use_yns = use_yn.split(",")
		end
		    
		chk_union = false

		if profile_id
			user = User.where(profile_id: profile_id).first
		end
		
		str_select = "id
						, item_type
						, user_id
						, img_file_name
						, collection_type
						, subject
						, hit
						, created_at
						, img_updated_at
						, use_yn
						, price
						, price_type
						, merchant
						, url
						, profile_id
						, user_name
						, store_type
						, F_COUNT_GETS(id,'L') AS cnt_like"
		if session_user_id && session_user_id!=""
			str_select += ", F_COUNT_GETS_USER(id,'L','#{session_user_id}') AS cnt_like_user"
		else
			str_select += ", 0 AS cnt_like_user"
		end
		
		str_select += ", CASE WHEN CHAR_LENGTH(F_REMOVE_HTML(subject))<20 THEN F_REMOVE_HTML(subject) ELSE CONCAT(SUBSTRING(F_REMOVE_HTML(subject),1,20),'..') END AS subject
							, subject AS subject_full"
		
		str_from = "(SELECT A.id
								, A.item_type
								, A.user_id
								, A.img_file_name
								, A.collection_type
								, A.subject
								, A.hit
								, A.created_at
								, A.img_updated_at
								, A.use_yn
								, C.price
								, C.price_type
								, C.merchant
								, C.url
								, D.profile_id
								, D.user_name
								, D.store_type"
							
		#str_from += "  FROM collections A, (SELECT collection_id, MAX(product_id) AS product_id FROM collection_products GROUP BY collection_id) B, products C, users D "
		#str_from += " WHERE A.id=B.collection_id AND B.product_id=C.id AND A.user_id=D.id "
		str_from += "  FROM collections A LEFT OUTER JOIN products C ON A.product_id=C.id, users D "
		str_from += " WHERE A.user_id=D.id "
							

		if item_type && item_type!=''
			str_from += "    AND A.item_type='#{item_type}'"
		end
		
		if use_yn && use_yn!=""
			str_from += "    AND A.use_yn IN ("
			use_yns.each_with_index do |key,i|
				if i>0
					str_from += ","
				end 
				str_from += "'#{key}'"
			end
			str_from += ")"
		end

		if profile_id && profile_id!=""
			if like=="Y"
				str_from += "    AND A.id IN (SELECT collection_id FROM gets WHERE get_type='L' AND user_id = "+user.id.to_s+")"
			else
				str_from += "    AND ("
				str_from += "          A.user_id=#{user.id}"
				if follow=="Y"
					str_from += "       OR A.user_id IN (SELECT follow_id FROM follows WHERE user_id = "+user.id.to_s+")"
				end
				if myitem=="Y"
					str_from += "       OR A.id IN (SELECT collection_id FROM user_items WHERE user_id = "+user.id.to_s+")"
				end
				str_from += "       OR A.id IN (SELECT collection_id FROM gets WHERE get_type='L' AND user_id = "+user.id.to_s+")"
				str_from += "    )"
			end
		end

		if search_key && search_key!=""
			str_from += "    AND ("
			str_from += "          LOWER(A.subject) LIKE '%#{search_key}%' "
			str_from += "       OR LOWER(C.cate_code) LIKE '%#{search_key}%' "
			str_from += "       OR LOWER(C.merchant) LIKE '%#{search_key}%' "
			search_keys.each do |key|
				str_from += "       OR LOWER(A.subject) LIKE '%#{key}%' "
				str_from += "       OR LOWER(C.cate_code) LIKE '%#{key}%' "
				str_from += "       OR LOWER(C.merchant) LIKE '%#{key}%' "
				str_from += "       OR LOWER(D.user_name) LIKE '%#{key}%' "
				str_from += "       OR LOWER(D.profile_id) LIKE '%#{key}%' "
			end
			str_from += "    )"
		end

		if price_stat && price_stat!="" && price_stat!="0"
			str_from += "    AND C.price IS NOT NULL "
			case price_stat
				when "1"
					str_from += " AND (C.price*( CASE C.price_type 
															WHEN 'USD' THEN "+currency_usd+" 
															WHEN 'JPY' THEN "+currency_jpy+"
															WHEN 'EUR' THEN "+currency_eur+"
															WHEN 'GBP' THEN "+currency_gbp+"
															WHEN 'CNY' THEN "+currency_cny+"
															ELSE 1 
															END )
										) <=20000 "
				when "2"
					str_from += " AND (C.price*( CASE C.price_type 
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 20000 AND 50000"
				when "3"
					str_from += " AND (C.price*( CASE C.price_type  
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 50000 AND 100000"
				when "4"
					str_from += " AND (C.price*( CASE C.price_type  
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 100000 AND 200000"
				when "5"
					str_from += " AND (C.price*( CASE C.price_type  
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 200000 AND 500000"
				when "6"
					str_from += " AND (C.price*( CASE C.price_type  
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) >= 500000"
			end
		end
    
		if color_code && color_code!=""
			str_from += "    AND C.color_code_s IN ('#{color_code}') "
		end
		 
		if cate_code && cate_code!=""
			str_from += "    AND C.cate_code='#{cate_code}'"
		end
		 
		if store_type && store_type!=""
			str_from += "    AND D.store_type='#{store_type}'"
		end
		 
		if style_type && style_type!=""
			str_from += "    AND C.style_type='#{style_type}'"
		end
		 
		if limit_hit && limit_hit!=""
			str_from += "    AND A.hit>=#{limit_hit}"
		else
			str_from += "    AND A.hit>0 "
		end
		
		#str_from += " GROUP BY A.id "
		str_from += " ORDER BY #{order}"
		str_from += " LIMIT #{per_page} OFFSET #{(page.to_i-1)*per_page}"
		str_from += ") X "

		collections = Collection.select(str_select).from(str_from).where("1=1")

		return collections

	end


end
