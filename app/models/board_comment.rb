class BoardComment < ActiveRecord::Base
  attr_accessible :comment_type, :contents, :ref_id, :reg_id
  
  
    # 댓글 리스트
  def self.commentList(params)
    page = params[:page]||1
    per_page = params[:per_page]||16
    page = page.to_i
    per_page = per_page.to_i
    
    comment_type = params[:comment_type]||""
    ref_id = params[:ref_id]||""
    reg_id = params[:reg_id]||""
    order       = params[:order]||"A.created_at DESC, A.id DESC"
    
    
    from_str = ""
    where_str = ""
    
    if comment_type && comment_type!=""
      where_str += "    AND A.comment_type='#{comment_type}' "
    end
    
    if ref_id && ref_id!=""
      where_str += "    AND A.ref_id=#{ref_id} "
    end
    
    if reg_id && reg_id!=""
      where_str += "    AND A.reg_id='#{reg_id}' "
    end

    comments = BoardComment.paginate(page: page, per_page: per_page)
                    .select("A.id, A.comment_type, A.ref_id, A.contents, A.reg_id, A.created_at
                           , B.user_name, B.profile_id, IFNULL(B.img_file_name,'') AS img_file_name
                           , '' AS created_at_str")
                      .from("board_comments A, users B")
                     .where(" A.reg_id = B.id " + where_str)
                     .order(order)

    return comments

  end
  
end
