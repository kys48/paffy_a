#encoding: utf-8

class FollowsController < ApplicationController

	# 팔로우하기
	def put
		user_id   = session[:user_id]
		follow_id = params[:follow_id]
		follow_type = params[:follow_type]
		
		count = Follow.where(user_id: user_id, follow_id: follow_id).count
		
		follow_user = User.find(follow_id)
		
		status = true
		
		follow_status = 'Y'
		
		follow = Follow.new
		follow.user_id = user_id
		follow.follow_id = follow_id
		follow.follow_type = follow_user.user_type
    
		if count>0
			Follow.where(user_id: user_id, follow_id: follow_id).destroy_all
			follow_status = 'N'
		else
			follow.save!
			follow_status = 'Y'
		end

		respond_to do |format|
			format.json { render :json => { status: status, follow_status: follow_status }.to_json }
		end
	end


	# 페이지 ajax
	def followListCallback
		session_user_id = session[:user_id]
		page = params[:page]||1
		per_page = params[:per_page]||8
		user_type = params[:user_type]||""
		list_type = params[:list_type]||"4"
		
		users	= User.followList(params)
		 
		# users 2차원배열
		# user_list = [{},{}]
		user_list = Array.new(users.count) {Array.new(3,nil)}
    
		rcnt = 0
		users.each{ |user|
			# follow한 시간
			createTimeFollow = (Time.zone.now - user.created_at_follow).to_i
			createTimeFollowStr =  (Time.zone.now - user.created_at_follow).to_i / 1.second
			
			if createTimeFollow<60
				createTimeFollowStr =  ((Time.zone.now - user.created_at_follow).to_i / 1.second).to_s + "초"
			elsif createTimeFollow<60*60
				createTimeFollowStr =  ((Time.zone.now - user.created_at_follow).to_i / 1.minute).to_s + "분"
			elsif createTimeFollow<60*60*24
				createTimeFollowStr =  ((Time.zone.now - user.created_at_follow).to_i / 1.hour).to_s + "시간"
			elsif createTimeFollow<60*60*24*30
				createTimeFollowStr =  ((Time.zone.now - user.created_at_follow).to_i / 1.day).to_s + "일"
			elsif createTimeFollow<60*60*24*365
				createTimeFollowStr =  ((Time.zone.now - user.created_at_follow).to_i / 1.month).to_s + "개월"
			elsif createTimeFollow>=60*60*24*365
				createTimeFollowStr =  ((Time.zone.now - user.created_at_follow).to_i / 1.year).to_s + "년"
			end
			
			user.created_at_follow_str = createTimeFollowStr

			# 가입한 시간
			createTimeJoin = (Time.zone.now - user.created_at_join).to_i
			createTimeJoinStr =  (Time.zone.now - user.created_at_join).to_i / 1.second
			
			if createTimeJoin<60
				createTimeJoinStr =  ((Time.zone.now - user.created_at_join).to_i / 1.second).to_s + "초"
			elsif createTimeJoin<60*60
				createTimeJoinStr =  ((Time.zone.now - user.created_at_join).to_i / 1.minute).to_s + "분"
			elsif createTimeJoin<60*60*24
				createTimeJoinStr =  ((Time.zone.now - user.created_at_join).to_i / 1.hour).to_s + "시간"
			elsif createTimeJoin<60*60*24*30
				createTimeJoinStr =  ((Time.zone.now - user.created_at_join).to_i / 1.day).to_s + "일"
			elsif createTimeJoin<60*60*24*365
				createTimeJoinStr =  ((Time.zone.now - user.created_at_join).to_i / 1.month).to_s + "개월"
			elsif createTimeJoin>=60*60*24*365
				createTimeJoinStr =  ((Time.zone.now - user.created_at_join).to_i / 1.year).to_s + "년"
			end
			
			user.created_at_join_str = createTimeJoinStr
			
			follow_count = 0
	      if session_user_id && session_user_id!=""
	        follow_count = Follow.where(user_id: session_user_id, follow_id: user.user_id).count
	      end
	      
	      
	      user_list[rcnt][0] = user
	      collections_per_page = 8
	      if list_type == "L"
	      	collections_per_page = 4
	      end
	      
			if user_type == "S"
				collections = Product.paginate(page: 1, per_page: collections_per_page).where(user_id: user.user_id, use_yn: 'Y').order('hit DESC')
			else
				collections	= Collection.paginate(page: 1, per_page: collections_per_page).where(user_id: user.user_id, use_yn: 'Y').order('hit DESC')
			end
			user_list[rcnt][1] = collections
			user_list[rcnt][2] = follow_count
			
			rcnt += 1
		}
    
		respond_to do |format|
			format.json { render :json => { status: true, user_list: user_list }.to_json }
		end
	end


end
