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
    profile_id  = params[:id]
    item_type   = params[:type]||""
    page        = params[:page]||1
    per_page    = params[:per_page]||16
    order       = params[:order]||"hit DESC"
    myfeed      = params[:myfeed]||""
    search_key  = params[:search_key]||""
    price_stat  = params[:price_stat]||"0"
    color_code  = params[:color_code]||""
    cate_code   = params[:cate_code]||""
    store_type  = params[:store_type]||""
    session_user_id = params[:session_user_id]||""

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

    if profile_id
      user = User.where(profile_id: profile_id).first
    end
    
    str_from = "(
                    SELECT id, user_id, img_file_name, collection_type, subject
                         , hit, created_at, img_updated_at, '' AS item_type
                         , 0 AS profile_id, '' AS user_name, 0 AS price, '' AS price_type, '' AS merchant, '' AS url
                      FROM collections WHERE 1=0"
    
    if myfeed == "Y"
      str_from_myfeed1 = " UNION ALL
      
                    SELECT B.id, B.user_id, B.img_file_name, B.collection_type, B.subject
                         , B.hit, B.created_at, B.img_updated_at, A.item_type
                         , C.profile_id, C.user_name, 0 AS price, '' AS price_type, '' AS merchant, '' AS url
                      FROM gets A, collections B, users C
                     WHERE A.ref_id = B.id AND B.user_id = C.id AND A.item_type = 'C'"
      
      if profile_id && profile_id!=""
        str_from_myfeed1 += "    AND ("
        str_from_myfeed1 += "          A.user_id=#{user.id}"
        str_from_myfeed1 += "       OR A.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.follow_type='U' AND C1.user_id = #{user.id})"
        str_from_myfeed1 += "    )"
      end
      
      if search_key && search_key!=""
        str_from_myfeed1 += "    AND ("
        str_from_myfeed1 += "          B.subject LIKE '%#{search_key}%' "
        str_from_myfeed1 += "       OR B.contents LIKE '%#{search_key}%' "
        search_keys.each do |key|
          str_from_myfeed1 += "       OR LOWER(B.subject) LIKE '%#{key}%' "
          str_from_myfeed1 += "       OR LOWER(B.contents) LIKE '%#{key}%' "
        end
        str_from_myfeed1 += "    )"
      end
    
      
      str_from_myfeed2 = " UNION ALL   
                    SELECT B.id, B.user_id, B.img_file_name, '' AS collection_type, B.subject
                         , B.hit, B.created_at, B.img_updated_at, A.item_type
                         , C.profile_id, C.user_name, B.price, B.price_type, B.merchant, B.url
                      FROM gets A, products B, users C 
                     WHERE A.ref_id = B.id AND B.user_id = C.id AND A.item_type = 'P'"
      
      if profile_id
        str_from_myfeed2 += "    AND ("
        str_from_myfeed2 += "          A.user_id=#{user.id}"
        str_from_myfeed2 += "       OR A.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.follow_type='U' AND C1.user_id = "+user.id.to_s+")"
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
        end
        
        str_from_myfeed2 += "    )"
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
      
      if item_type=='C' || item_type=='P'
        if item_type=='C'
          str_from += str_from_myfeed1
        elsif item_type=='P'
          str_from += str_from_myfeed2
        end
      else
        str_from += str_from_myfeed1
        str_from += str_from_myfeed2
      end
    
    end
    
    
    str_from1 = " UNION ALL
                   SELECT A.id, A.user_id, A.img_file_name, A.collection_type, A.subject, A.hit, A.created_at, A.img_updated_at, 'C' AS item_type
                        , B.profile_id, B.user_name, 0 AS price, '' AS price_type, '' AS merchant, '' AS url
                    FROM collections A, users B
                   WHERE A.user_id = B.id"
    if profile_id
      str_from1 += "    AND ("
      str_from1 += "          A.user_id=#{user.id}"
      if myfeed == "Y"
        str_from1 += "       OR A.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.follow_type='U' AND C1.user_id = "+user.id.to_s+")"
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
      end
      
      str_from1 += "    )"
    end
    
    str_from2 = " UNION ALL
                   SELECT A.id, B.user_id, A.img_file_name, '' AS collection_type, A.subject, A.hit, B.created_at, A.img_updated_at, 'P' AS item_type
                        , C.profile_id, C.user_name, A.price, A.price_type, A.merchant, A.url
                    FROM products A, user_items B, users C
                   WHERE A.id = B.ref_id
                     AND B.user_id = C.id
                     AND B.item_type = 'P'"
    if myfeed != "Y"
      str_from2 += "    AND C.user_type='S'"
    end
    
    if profile_id
      str_from2 += "    AND ("
      str_from2 += "          B.user_id=#{user.id}"
      if myfeed == "Y"
        str_from2 += "       OR B.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.follow_type='U' AND C1.user_id = #{user.id})"
      end
      str_from2 += "    )"
    end
    
    if search_key && search_key!=""
      str_from2 += "    AND ("
      str_from2 += "          LOWER(A.subject) LIKE '%#{search_key}%' "
      str_from2 += "       OR LOWER(A.cate_code) LIKE '%#{search_key}%' "
      str_from2 += "       OR LOWER(A.merchant) LIKE '%#{search_key}%' "
      
      search_keys.each do |key|
        str_from2 += "       OR LOWER(A.subject) LIKE '%#{key}%' "
        str_from2 += "       OR LOWER(A.cate_code) LIKE '%#{key}%' "
        str_from2 += "       OR LOWER(A.merchant) LIKE '%#{key}%' "
      end
            
      str_from2 += "    )"
    end

    if price_stat && price_stat!="" && price_stat!="0"
      str_from2 += "    AND A.price IS NOT NULL "
      case price_stat
        when "1"
          str_from2 += "    AND A.price<=20000 "
        when "2"
          str_from2 += "    AND A.price BETWEEN 20000 AND 50000"
        when "3"
          str_from2 += "    AND A.price BETWEEN 50000 AND 100000"
        when "4"
          str_from2 += "    AND A.price BETWEEN 100000 AND 200000"
        when "5"
          str_from2 += "    AND A.price BETWEEN 200000 AND 500000"
        when "6"
          str_from2 += "    AND A.price >= 500000"
      end
    end
    
    if color_code && color_code!=""
      str_from2 += "    AND A.color_code_s IN ('#{color_code}') "
    end
    
    if cate_code && cate_code!=""
      str_from2 += "    AND A.cate_code='#{cate_code}'"
    end
    
    if store_type && store_type!=""
      str_from2 += "    AND A.store_type='#{store_type}'"
    end
      
    if item_type=='C'
      str_from += str_from1
    elsif item_type=='P'
      str_from += str_from2
    else
      str_from += str_from1
      str_from += str_from2
    end
    
    str_from += ") X"

    str_select = "id, user_id, img_file_name, collection_type
               , hit, created_at, img_updated_at, item_type
               , profile_id, user_name, price, price_type, merchant, url
               , F_COUNT_GETS(id,'L') AS cnt_like"
    if session_user_id && session_user_id!=""
      str_select += ", F_COUNT_GETS_USER(id,'L','#{session_user_id}') AS cnt_like_user"
    else
      str_select += ", 0 AS cnt_like_user"
    end
               
    str_select += ", CASE WHEN CHAR_LENGTH(F_REMOVE_HTML(subject))<25 THEN F_REMOVE_HTML(subject) ELSE CONCAT(SUBSTRING(F_REMOVE_HTML(subject),1,25),'..') END AS subject
                , subject AS subject_full"

    collections = Collection.paginate(page: page, per_page: per_page)
                    .select(str_select)
                      .from(str_from)
                     .order(order)

    return collections

  end






end
