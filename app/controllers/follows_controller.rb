class FollowsController < ApplicationController

  # 팔로우하기
  def put
    user_id   = session[:user_id]
    follow_id = params[:follow_id]
    follow_type = params[:follow_type]

    count = Follow.where(user_id: user_id, follow_id: follow_id).count

    status = true
    
    follow_status = 'Y'

    follow = Follow.new
    follow.user_id = user_id
    follow.follow_id = follow_id
    follow.follow_type = follow_type
    
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
  


end
