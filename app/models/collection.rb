#require 'RMagick'
#include Magick

class Collection < ActiveRecord::Base
	attr_accessible :subject, :contents, :user_id, :collection_type, :img, :img_file_name, :img_content_type, :img_file_size, :hit
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
	def self.itemList(params)
		profile_id	= params[:id]
		item_type	= params[:type]||""
		page			= params[:page]||1
		per_page		= params[:per_page]||16
		order			= params[:order]||"hit DESC"
		myfeed		= params[:myfeed]||""
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
    
		str_from = "(
						SELECT id, item_type
								, MAX(get_yn) AS get_yn
								, MAX(user_id) AS user_id
								, MAX(img_file_name) AS img_file_name
								, MAX(collection_type) AS collection_type
								, MAX(hit) AS hit
								, MAX(created_at) AS created_at
								, MAX(img_updated_at) AS img_updated_at
								, MAX(profile_id) AS profile_id
								, MAX(user_name) AS user_name
								, MAX(price) AS price
								, MAX(price_type) AS price_type
								, MAX(merchant) AS merchant
								, MAX(url) AS url
								, MAX(subject) AS subject
								, MAX(use_yn) AS use_yn
								, MAX(store_type) AS store_type
						FROM ( "
    
		if myfeed == "Y"
			str_from_myfeed1 = "
								SELECT 'Y' AS get_yn, B.id, B.user_id, B.img_file_name, B.collection_type, B.subject
										, B.hit, B.created_at, B.img_updated_at, A.item_type
										, C.profile_id, C.user_name, 0 AS price, '' AS price_type, '' AS merchant, '' AS url
										, B.use_yn, '' AS store_type
								  FROM gets A, collections B, users C
								 WHERE A.ref_id = B.id AND B.user_id = C.id
								   AND A.item_type = 'C'
								   AND A.get_type = 'L'"
	
			if use_yn && use_yn!=""
				str_from_myfeed1 += "    AND B.use_yn IN (''"
				use_yns.each do |key|
					str_from_myfeed1 += " ,'#{key}' "
				end
				str_from_myfeed1 += "    )"
			end
	
			if profile_id && profile_id!=""
				str_from_myfeed1 += "    AND ("
				str_from_myfeed1 += "          A.user_id=#{user.id}"
				if follow=="Y" && item_type!='L'
					str_from_myfeed1 += "       OR A.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.user_id = #{user.id})"
				end
				str_from_myfeed1 += "    )"
			end
	
			if search_key && search_key!=""
				str_from_myfeed1 += "    AND ("
				str_from_myfeed1 += "          B.subject LIKE '%#{search_key}%' "
				str_from_myfeed1 += "       OR B.contents LIKE '%#{search_key}%' "
				search_keys.each do |key|
					str_from_myfeed1 += "       OR LOWER(B.subject) LIKE '%#{key}%' "
					str_from_myfeed1 += "       OR LOWER(B.contents) LIKE '%#{key}%' "
					str_from_myfeed1 += "       OR LOWER(C.user_name) LIKE '%#{key}%' "
					str_from_myfeed1 += "       OR LOWER(C.profile_id) LIKE '%#{key}%' "
				end
				str_from_myfeed1 += "    )"
			end
	
			str_from_myfeed2 = "
								SELECT 'Y' AS get_yn, B.id, B.user_id, B.img_file_name, '' AS collection_type, B.subject
										, B.hit, B.created_at, B.img_updated_at, A.item_type
										, C.profile_id, C.user_name, B.price, B.price_type, B.merchant, B.url
										, B.use_yn, B.store_type
								  FROM gets A, products B, users C 
								 WHERE A.ref_id = B.id
									AND B.user_id = C.id
									AND A.item_type = 'P'
									AND A.get_type = 'L'"
	
			if use_yn && use_yn!=""
				str_from_myfeed2 += "    AND B.use_yn IN (''"
				use_yns.each do |key|
					str_from_myfeed2 += " ,'#{key}' "
				end
				str_from_myfeed2 += "    )"
			end
	
			if profile_id
				str_from_myfeed2 += "    AND ("
				str_from_myfeed2 += "          A.user_id=#{user.id}"
				if follow=="Y" && item_type!='L'
					str_from_myfeed2 += "       OR A.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.user_id = "+user.id.to_s+")"
				end
				str_from_myfeed2 += "    )"
			end
	      
			if search_key && search_key!=""
				str_from_myfeed2 += "    AND ("
				str_from_myfeed2 += "          LOWER(B.subject) LIKE '%#{search_key}%' "
				str_from_myfeed2 += "       OR LOWER(B.cate_code) LIKE '%#{search_key}%' "
				str_from_myfeed2 += "       OR LOWER(B.merchant) LIKE '%#{search_key}%' "
				search_keys.each do |key|
					str_from_myfeed22 += "       OR LOWER(B.subject) LIKE '%#{key}%' "
					str_from_myfeed22 += "       OR LOWER(B.cate_code) LIKE '%#{key}%' "
					str_from_myfeed22 += "       OR LOWER(B.merchant) LIKE '%#{key}%' "
					str_from_myfeed22 += "       OR LOWER(C.user_name) LIKE '%#{key}%' "
					str_from_myfeed22 += "       OR LOWER(C.profile_id) LIKE '%#{key}%' "
				end
				str_from_myfeed2 += "    )"
			end
	      
			if price_stat && price_stat!="" && price_stat!="0"
				str_from_myfeed2 += "    AND B.price IS NOT NULL "
				case price_stat
					when "1"
						str_from_myfeed2 += " AND (B.price*( CASE B.price_type
															WHEN 'USD' THEN "+currency_usd+" 
															WHEN 'JPY' THEN "+currency_jpy+"
															WHEN 'EUR' THEN "+currency_eur+"
															WHEN 'GBP' THEN "+currency_gbp+"
															WHEN 'CNY' THEN "+currency_cny+"
															ELSE 1 
															END )
													) <=20000 "
					when "2"
						str_from_myfeed2 += " AND (B.price*( CASE B.price_type 
															WHEN 'USD' THEN "+currency_usd+"
															WHEN 'JPY' THEN "+currency_jpy+"
															WHEN 'EUR' THEN "+currency_eur+"
															WHEN 'GBP' THEN "+currency_gbp+"
															WHEN 'CNY' THEN "+currency_cny+"
															ELSE 1 
															END )
													) BETWEEN 20000 AND 50000"
					when "3"
						str_from_myfeed2 += " AND (B.price*( CASE B.price_type 
															WHEN 'USD' THEN "+currency_usd+"
															WHEN 'JPY' THEN "+currency_jpy+"
															WHEN 'EUR' THEN "+currency_eur+"
															WHEN 'GBP' THEN "+currency_gbp+"
															WHEN 'CNY' THEN "+currency_cny+"
															ELSE 1 
															END )
													) BETWEEN 50000 AND 100000"
					when "4"
						str_from_myfeed2 += " AND (B.price*( CASE B.price_type 
															WHEN 'USD' THEN "+currency_usd+"
															WHEN 'JPY' THEN "+currency_jpy+"
															WHEN 'EUR' THEN "+currency_eur+"
															WHEN 'GBP' THEN "+currency_gbp+"
															WHEN 'CNY' THEN "+currency_cny+"
															ELSE 1 
															END )
													) BETWEEN 100000 AND 200000"
					when "5"
						str_from_myfeed2 += " AND (B.price*( CASE B.price_type 
															WHEN 'USD' THEN "+currency_usd+"
															WHEN 'JPY' THEN "+currency_jpy+"
															WHEN 'EUR' THEN "+currency_eur+"
															WHEN 'GBP' THEN "+currency_gbp+"
															WHEN 'CNY' THEN "+currency_cny+"
															ELSE 1 
															END )
													) BETWEEN 200000 AND 500000"
					when "6"
						str_from_myfeed2 += " AND (B.price*( CASE B.price_type 
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
				str_from_myfeed2 += "    AND B.color_code_s IN ('#{color_code}') "
			end
			
			if cate_code && cate_code!=""
				str_from_myfeed2 += "    AND B.cate_code='#{cate_code}'"
			end
			
			if store_type && store_type!=""
				str_from_myfeed2 += "    AND B.store_type='#{store_type}'"
			end
			
			if style_type && style_type!=""
				str_from_myfeed2 += "    AND B.style_type='#{style_type}'"
			end
			
			if limit_hit && limit_hit!=""
				str_from_myfeed2 += "    AND B.hit>=#{limit_hit}"
			end
			
			if item_type=='C' || item_type=='P'
				if item_type=='C'
					str_from += str_from_myfeed1
				elsif item_type=='P'
					str_from += str_from_myfeed2
				end
			else
				str_from += str_from_myfeed1
				str_from += " UNION ALL "
				str_from += str_from_myfeed2
			end
	      
			chk_union = true
	
		end # if myfeed == "Y"
	
	
		str_from1 = "	SELECT 'N' AS get_yn, A.id, A.user_id, A.img_file_name, A.collection_type, A.subject, A.hit, A.created_at, A.img_updated_at, 'C' AS item_type
									, B.profile_id, B.user_name, 0 AS price, '' AS price_type, '' AS merchant, '' AS url
									, A.use_yn, '' AS store_type
							  FROM collections A, users B
							 WHERE A.user_id = B.id"

		if use_yn && use_yn!=""
			str_from1 += "    AND A.use_yn IN (''"
			use_yns.each do |key|
				str_from1 += " ,'#{key}' "
			end
			str_from1 += "    )"
		end

		if profile_id
			str_from1 += "    AND ("
			str_from1 += "          A.user_id=#{user.id}"
			if myfeed=="Y" && follow=="Y"
				str_from1 += "       OR A.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.user_id = "+user.id.to_s+")"
			end
			str_from1 += "    )"
		end

		if search_key && search_key!=""
			str_from1 += "    AND ("
			str_from1 += "          A.subject LIKE '%#{search_key}%' "
			str_from1 += "       OR A.contents LIKE '%#{search_key}%' "
			search_keys.each do |key|
				str_from1 += "       OR LOWER(A.subject) LIKE '%#{key}%' "
				str_from1 += "       OR LOWER(A.contents) LIKE '%#{key}%' "
				str_from1 += "       OR LOWER(B.user_name) LIKE '%#{key}%' "
				str_from1 += "       OR LOWER(B.profile_id) LIKE '%#{key}%' "
			end
			str_from1 += "    )"
		end

		str_from2 = "	SELECT 'N' AS get_yn, B.id, A.user_id, B.img_file_name, '' AS collection_type, B.subject, B.hit, A.created_at, B.img_updated_at, 'P' AS item_type
									, C.profile_id, C.user_name, B.price, B.price_type, B.merchant, B.url
									, B.use_yn, B.store_type
							  FROM user_items A, products B, users C
							 WHERE B.id = A.ref_id
							   AND A.user_id = C.id
							   AND A.item_type = 'P'"

		if use_yn && use_yn!=""
			str_from2 += "    AND B.use_yn IN (''"
			use_yns.each do |key|
				str_from2 += " ,'#{key}' "
			end
			str_from2 += "    )"
		end

		if myfeed != "Y"
			str_from2 += "    AND C.user_type='S'"
		end

		if profile_id
			str_from2 += "    AND ("
			str_from2 += "          A.user_id=#{user.id}"
			if myfeed=="Y" && follow=="Y"
				str_from2 += "       OR A.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.user_id = #{user.id})"
			end
			str_from2 += "    )"
		end
    
		if search_key && search_key!=""
			str_from2 += "    AND ("
			str_from2 += "          LOWER(B.subject) LIKE '%#{search_key}%' "
			str_from2 += "       OR LOWER(B.cate_code) LIKE '%#{search_key}%' "
			str_from2 += "       OR LOWER(B.merchant) LIKE '%#{search_key}%' "
			search_keys.each do |key|
				str_from2 += "       OR LOWER(B.subject) LIKE '%#{key}%' "
				str_from2 += "       OR LOWER(B.cate_code) LIKE '%#{key}%' "
				str_from2 += "       OR LOWER(B.merchant) LIKE '%#{key}%' "
				str_from2 += "       OR LOWER(C.user_name) LIKE '%#{key}%' "
				str_from2 += "       OR LOWER(C.profile_id) LIKE '%#{key}%' "
			end
			str_from2 += "    )"
		end

		if price_stat && price_stat!="" && price_stat!="0"
			str_from2 += "    AND B.price IS NOT NULL "
			case price_stat
				when "1"
					str_from2 += " AND (B.price*( CASE B.price_type 
															WHEN 'USD' THEN "+currency_usd+" 
															WHEN 'JPY' THEN "+currency_jpy+"
															WHEN 'EUR' THEN "+currency_eur+"
															WHEN 'GBP' THEN "+currency_gbp+"
															WHEN 'CNY' THEN "+currency_cny+"
															ELSE 1 
															END )
										) <=20000 "
				when "2"
					str_from2 += " AND (B.price*( CASE B.price_type 
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 20000 AND 50000"
				when "3"
					str_from2 += " AND (B.price*( CASE B.price_type  
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 50000 AND 100000"
				when "4"
					str_from2 += " AND (B.price*( CASE B.price_type  
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 100000 AND 200000"
				when "5"
					str_from2 += " AND (B.price*( CASE B.price_type  
                                           WHEN 'USD' THEN "+currency_usd+"
                                           WHEN 'JPY' THEN "+currency_jpy+"
                                           WHEN 'EUR' THEN "+currency_eur+"
                                           WHEN 'GBP' THEN "+currency_gbp+"
                                           WHEN 'CNY' THEN "+currency_cny+"
                                           ELSE 1 
                                           END )
										) BETWEEN 200000 AND 500000"
				when "6"
					str_from2 += " AND (B.price*( CASE B.price_type  
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
			str_from2 += "    AND B.color_code_s IN ('#{color_code}') "
		end
		 
		if cate_code && cate_code!=""
			str_from2 += "    AND B.cate_code='#{cate_code}'"
		end
		 
		if store_type && store_type!=""
			str_from2 += "    AND B.store_type='#{store_type}'"
		end
		 
		if style_type && style_type!=""
			str_from2 += "    AND B.style_type='#{style_type}'"
		end
		 
		if limit_hit && limit_hit!=""
			str_from2 += "    AND B.hit>=#{limit_hit}"
		end
      
		if item_type!='L'
			if chk_union  
				str_from += " UNION ALL "
			end
			if item_type=='C'
				str_from += str_from1
			elsif item_type=='P'
				str_from += str_from2
			else
				str_from += str_from1
				str_from += " UNION ALL "
				str_from += str_from2
			end
		end

		str_from += ") Y
						GROUP BY id, item_type
					) X"

		str_select = "id, item_type, get_yn, user_id
							, img_file_name, collection_type, hit, created_at
							, img_updated_at, profile_id, user_name, price
							, price_type, merchant, url, use_yn
							, store_type
							, F_COUNT_GETS(id,'L') AS cnt_like"
		if session_user_id && session_user_id!=""
			str_select += ", F_COUNT_GETS_USER(id,'L','#{session_user_id}') AS cnt_like_user"
		else
			str_select += ", 0 AS cnt_like_user"
		end
		
		str_select += ", CASE WHEN CHAR_LENGTH(F_REMOVE_HTML(subject))<20 THEN F_REMOVE_HTML(subject) ELSE CONCAT(SUBSTRING(F_REMOVE_HTML(subject),1,20),'..') END AS subject
							, subject AS subject_full"

		collections = Collection.paginate(page: page, per_page: per_page)
							.select(str_select)
							.from(str_from)
							.order(order)

		return collections

	end



end
