#encoding: utf-8
class BoardCommentsController < ApplicationController
  
  # 댓글 리스트
  def commentListCallback
    
    comment_type = params[:comment_type]||""
    ref_id = params[:ref_id]||""
    contents = params[:contents]||""

    commentList = BoardComment.commentList(params)
    
    commentList.each do |comment|
		createTime = (Time.zone.now - comment.created_at).to_i
		createTimeStr =  (Time.zone.now - comment.created_at).to_i / 1.second
		createTimeTail = ""
		
		if createTime<60
			createTimeStr =  ((Time.zone.now - comment.created_at).to_i / 1.second).to_s + "초"
		elsif createTime<60*60
			createTimeStr =  ((Time.zone.now - comment.created_at).to_i / 1.minute).to_s + "분"
		elsif createTime<60*60*24
			createTimeStr =  ((Time.zone.now - comment.created_at).to_i / 1.hour).to_s + "시간"
		elsif createTime<60*60*24*30
			createTimeStr =  ((Time.zone.now - comment.created_at).to_i / 1.day).to_s + "일"
		elsif createTime<60*60*24*365
			createTimeStr =  ((Time.zone.now - comment.created_at).to_i / 1.month).to_s + "개월"
		elsif createTime>=60*60*24*365
			createTimeStr =  ((Time.zone.now - comment.created_at).to_i / 1.year).to_s + "년"
		end
		
		comment.created_at_str = createTimeStr
    end
    
    # 댓글 총갯수 가져오기
    cnt_comment = BoardComment.where(comment_type: comment_type, ref_id: ref_id).count
    
    respond_to do |format|
      format.json { render :json => { status: true, comments: commentList, cnt_comment: cnt_comment }.to_json }
    end
    
  end
  
  # 댓글 등록
  def writeCallback
    msg_type		= params[:msg_type]
    msg_user_id	= params[:msg_user_id]
    msg_ref_url	= params[:msg_ref_url]
    msg_contents	= params[:msg_contents]
    
    session_user_id = session[:user_id]||""
    comment_type = params[:comment_type]||""
    ref_id = params[:ref_id]||""
    contents = params[:contents]||""

    if session_user_id && session_user_id!="" && comment_type && ref_id && contents
      comment = BoardComment.new
      comment.comment_type = comment_type
      comment.ref_id = ref_id.to_i
      comment.contents = contents
      comment.reg_id = session_user_id
      comment.save!
      
      # 나의 상품 or 콜렉션에 대한 댓글이 아닐경우 등록자에게 댓글알림추가
      if session_user_id.to_i!= msg_user_id.to_i
	      msg = Message.new
	      msg.user_id		= msg_user_id
	      msg.msg_type	= msg_type
	      msg.ref_user_id = session_user_id
	      msg.ref_id		= ref_id.to_i
	      msg.ref_url		= msg_ref_url
	      msg.read_yn		= "N"
	      msg.contents	= msg_contents
	      msg.save!
      end
      

      status = true
    else
      status = false
    end
    
    
    respond_to do |format|
      format.json { render :json => { status: status }.to_json }
    end
    
  end
  
  # 댓글 삭제
  def deleteCallback
    session_user_id = session[:user_id]||""
    id = params[:id]||""

    if session_user_id && session_user_id!="" && id && id!=""
      comment = BoardComment.find(id)
      
      if session_user_id.to_i == comment.reg_id.to_i
        comment.destroy
        status = true
      else
        status = false
      end
    else
      status = false
    end
    
    respond_to do |format|
      format.json { render :json => { status: status }.to_json }
    end
    
  end
  
  
  # GET /board_comments
  # GET /board_comments.json
  def index
    @board_comments = BoardComment.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @board_comments }
    end
  end

  # GET /board_comments/1
  # GET /board_comments/1.json
  def show
    @board_comment = BoardComment.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @board_comment }
    end
  end

  # GET /board_comments/new
  # GET /board_comments/new.json
  def new
    @board_comment = BoardComment.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @board_comment }
    end
  end

  # GET /board_comments/1/edit
  def edit
    @board_comment = BoardComment.find(params[:id])
  end

  # POST /board_comments
  # POST /board_comments.json
  def create
    @board_comment = BoardComment.new(params[:board_comment])

    respond_to do |format|
      if @board_comment.save
        format.html { redirect_to @board_comment, notice: 'Board comment was successfully created.' }
        format.json { render json: @board_comment, status: :created, location: @board_comment }
      else
        format.html { render action: "new" }
        format.json { render json: @board_comment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /board_comments/1
  # PUT /board_comments/1.json
  def update
    @board_comment = BoardComment.find(params[:id])

    respond_to do |format|
      if @board_comment.update_attributes(params[:board_comment])
        format.html { redirect_to @board_comment, notice: 'Board comment was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @board_comment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /board_comments/1
  # DELETE /board_comments/1.json
  def destroy
    @board_comment = BoardComment.find(params[:id])
    @board_comment.destroy

    respond_to do |format|
      format.html { redirect_to board_comments_url }
      format.json { head :no_content }
    end
  end
end
