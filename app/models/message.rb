#encoding: utf-8

class Message < ActiveRecord::Base
	attr_accessible :contents, :msg_type, :read_yn, :ref_id, :ref_url, :ref_user_id, :user_id
  
	# 메시지 리스트
	def self.msgList(params)
		user_id		= params[:user_id]||""
		if !user_id || user_id==""
			user_id = "-1"
		end

		message_type	= params[:message_type]||""
		page			= params[:page]||1
		per_page		= params[:per_page]||8
		order			= params[:order]||"A.created_at DESC"

		page			= page.to_i
		per_page		= per_page.to_i
		
		where_str	= "A.ref_user_id = B.id AND A.user_id=#{user_id}"

		if message_type!=""
			where_str	+= " AND A.msg_type='#{message_type}'"
		end

		msg_list = Message.paginate(page: page, per_page: per_page)
							.select("A.id, A.user_id, A.msg_type, A.ref_user_id
									, A.ref_id, A.ref_url, A.read_yn, A.contents
									, A.created_at, B.user_name, B.profile_id, IFNULL(B.img_file_name,'') AS img_file_name
									, '' AS created_at_str")
							.from("messages A, users B")
							.where(where_str)
							.order(order)
		
		return msg_list

  end  
  
  
  
end
