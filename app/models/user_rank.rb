class UserRank < ActiveRecord::Base
  attr_accessible :follow_count, :product_count, :rank, :store_type, :user_id, :user_type
  
  # 추천 스토어 리스트
  def self.storeList(params)
    page = params[:page]||1
    per_page = params[:per_page]||10
    page = page.to_i
    per_page = per_page.to_i
    rank_type = params[:rank_type]||""
    store_type = params[:store_type]||""
    order = params[:order]||"rank ASC"
=begin    
    str_from = "(
              SELECT A.user_id, A.user_type, A.store_type, A.follow_count, A.product_count, A.rank
                   , B.profile_id, B.email, B.user_name, B.url, B.img_file_name
                FROM user_ranks A, users B
               WHERE A.user_id = B.id
                 AND A.rank_type = '"+rank_type+"'
                 AND A.store_type='"+store_type+"'
               ORDER BY A.rank ASC
               LIMIT 0,20
            ) X "
    stores = User
    .select("user_id, user_type, store_type, follow_count, product_count, rank
           , profile_id, email, user_name, url, img_file_name")
    .from( str_from )
    .order("rank ASC")
=end

    stores = User.paginate(page: page, per_page: per_page)
            .select("A.user_id, A.user_type, A.store_type, A.follow_count, A.product_count, A.rank
                   , B.profile_id, B.email, B.user_name, B.url, B.img_file_name")
              .from("user_ranks A, users B")
             .where("A.user_id = B.id AND A.rank_type = '"+rank_type+"' AND A.store_type='"+store_type+"'")
             .order("A.rank ASC")

    return stores

  end
  
end
