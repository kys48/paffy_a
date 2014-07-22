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
    profile_id = params[:id]
    item_type = params[:type]||""
    page = params[:page]||1
    per_page = params[:per_page]||16
    page = page.to_i
    per_page = per_page.to_i
    #order = params[:order]||"created_at DESC"
    order = params[:order]||"hit DESC"
    myfeed = params[:myfeed]

    if profile_id
      user = User.where(profile_id: profile_id).first
    end
    
    str_from = "(
                    SELECT id, user_id, img_file_name, collection_type, subject
                         , hit, created_at, img_updated_at, '' AS item_type
                         , 0 AS profile_id, 0 AS price, '' AS price_type
                      FROM collections WHERE 1=0"
    if myfeed == "Y"
      str_from += " UNION ALL
      
                    SELECT B.id, B.user_id, B.img_file_name, B.collection_type, B.subject
                         , B.hit, B.created_at, B.img_updated_at, A.item_type
                         , C.profile_id, 0 AS price, '' AS price_type
                      FROM wishes A, collections B, users C
                     WHERE A.ref_id = B.id AND B.user_id = C.id AND A.item_type = 'C'"
      
      if item_type=='C' || item_type=='P'
        str_from += "    AND A.item_type='"+item_type+"'"
      end
      
      if profile_id
        str_from += "    AND ("
        str_from += "          A.user_id="+user.id.to_s
        if myfeed == "Y"
          str_from += "       OR A.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.follow_type='U' AND C1.user_id = "+user.id.to_s+")"
        end
        str_from += "    )"
      end
      
      str_from += " UNION ALL   
                    
                    SELECT B.id, B.user_id, B.img_file_name, '' AS collection_type, B.subject
                         , B.hit, B.created_at, B.img_updated_at, A.item_type
                         , C.profile_id, B.price, B.price_type
                      FROM wishes A, products B, users C 
                     WHERE A.ref_id = B.id AND B.user_id = C.id AND A.item_type = 'P'"
      
      if item_type=='C' || item_type=='P'
        str_from += "    AND A.item_type='"+item_type+"'"
      end
      
      if profile_id
        str_from += "    AND ("
        str_from += "          A.user_id="+user.id.to_s
        if myfeed == "Y"
          str_from += "       OR A.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.follow_type='U' AND C1.user_id = "+user.id.to_s+")"
        end
        str_from += "    )"
      end
    
    end
    
    str_from1 = " UNION ALL
                   SELECT A.id, A.user_id, A.img_file_name, A.collection_type, A.subject, A.hit, A.created_at, A.img_updated_at, 'C' AS item_type
                        , B.profile_id, 0 AS price, '' AS price_type
                    FROM collections A, users B
                   WHERE A.user_id = B.id"
    if profile_id
      str_from1 += "    AND ("
      str_from1 += "          A.user_id="+user.id.to_s
      if myfeed == "Y"
        str_from1 += "       OR A.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.follow_type='U' AND C1.user_id = "+user.id.to_s+")"
      end
      str_from1 += "    )"
    end
    
    str_from2 = " UNION ALL
                   SELECT A.id, B.user_id, A.img_file_name, '' AS collection_type, A.subject, A.hit, B.created_at, A.img_updated_at, 'P' AS item_type
                        , C.profile_id, A.price, A.price_type
                    FROM products A, user_items B, users C
                   WHERE A.id = B.ref_id
                     AND B.user_id = C.id
                     AND B.item_type = 'P'"
    if profile_id
      str_from2 += "    AND ("
      str_from2 += "          B.user_id="+user.id.to_s
      if myfeed == "Y"
        str_from2 += "       OR B.user_id IN (SELECT C1.follow_id FROM follows C1, users C2 WHERE C1.follow_id = C2.id AND C1.follow_type='U' AND C1.user_id = "+user.id.to_s+")"
      end
      str_from2 += "    )"
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
    
    collections = Collection.paginate(page: page, per_page: per_page)
                    .select("id, user_id, img_file_name, collection_type
                           , hit, created_at, img_updated_at, item_type, profile_id
                           , price, price_type
                           , F_COUNT_GETS(id,'L') AS cnt_like
                           , F_COUNT_GETS(id,'S') AS cnt_scrap
                           , CASE WHEN CHAR_LENGTH(F_REMOVE_HTML(subject))<25 THEN F_REMOVE_HTML(subject) ELSE CONCAT(SUBSTRING(F_REMOVE_HTML(subject),1,25),'..') END AS subject
                           , subject AS subject_full")
                      .from(str_from)
                     .order(order)

    return collections

  end






end
