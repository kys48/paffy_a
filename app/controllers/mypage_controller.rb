#encoding: utf-8
include ApplicationHelper

class MypageController < ApplicationController
  
  def index
    @session_user_id = session[:user_id]||""
    
    if @session_user_id && @session_user_id!=""
      @user = User.find(@session_user_id)
      redirect_to('/mypage/'+@user.profile_id)
    else
      redirect_to '/log_in'
    end
  end
  
  # 프로필 
  def show
    @session_user_id = session[:user_id]
    @profile_id = params[:id]
    @item_type = params[:type]
    @user = User.where(profile_id: @profile_id).first
    
    if @user.user_type=='S'
      @item_type = 'P'
    end
    
    @currency_usd = GoogCurrency.usd_to_krw(1).to_i
    @currency_jpy = GoogCurrency.jpy_to_krw(1).to_i
    @currency_eur = GoogCurrency.eur_to_krw(1).to_i
    @currency_gbp = GoogCurrency.gbp_to_krw(1).to_i
    @currency_cny = GoogCurrency.cny_to_krw(1).to_i
    
    # 팔로우 여부 가져오기
    @follow_count = Follow.where(user_id: @session_user_id, follow_id: @user.id).count
    
    # 조회 수 가져오기
    cnt_view_product = Product.select("IFNULL(SUM(hit),0) AS hit").from("products").where(user_id: @user.id, use_yn: "Y").first
    cnt_view_collection = Collection.select("IFNULL(SUM(hit),0) AS hit").from("collections").where(user_id: @user.id, use_yn: "Y").first
    @cnt_view = cnt_view_product.hit + cnt_view_collection.hit
    
    # 좋아요 수 가져오기
    cnt_like_product = Get.select("A.id")
                          .from("gets A, products B")
                          .where("A.ref_id = B.id AND B.user_id=#{@user.id} AND A.get_type='L'")
                          .count
                          
    cnt_like_collection = Get.select("A.id")
                          .from("gets A, collections B")
                          .where("A.ref_id = B.id AND B.user_id=#{@user.id} AND A.get_type='L'")
                          .count
    
    @cnt_like = cnt_like_product + cnt_like_collection
    
    # follower 수 가져오기
    @cnt_follower = Follow.select("id").from("follows").where(follow_id: @user.id).count
    
    # following 수 가져오기
    @cnt_following = Follow.select("id").from("follows").where(user_id: @user.id).count
    
    # 상품 수 가져오기
    @cnt_product = Product.select("id").from("products").where(user_id: @user.id, use_yn: "Y").count
    
    @cateList = Cate.all()
    
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @collections }
    end
  end
  
  # 프로필 ajax
  def itemListCallback
    params[:session_user_id] = session[:user_id]||""
    profile_id = params[:id]
    page = params[:page]||1
    item_type = params[:type]
    
    #user = User.where(profile_id: @profile_id).first

    # 찜한 상품, 콜렉션
    collectionList = Collection.itemList(params)
    
    respond_to do |format|
      format.json { render :json => { status: true, collections: collectionList }.to_json }
    end
  end
  
  # Mypage 
  def myfeed
    @session_user_id = session[:user_id]||""
    params[:cmenu] = "4"
    
    @currency_usd = GoogCurrency.usd_to_krw(1).to_i
    @currency_jpy = GoogCurrency.jpy_to_krw(1).to_i
    @currency_eur = GoogCurrency.eur_to_krw(1).to_i
    @currency_gbp = GoogCurrency.gbp_to_krw(1).to_i
    @currency_cny = GoogCurrency.cny_to_krw(1).to_i
    
#    if @session_user_id && @session_user_id!=""
      @profile_id = session[:profile_id]
      @item_type = params[:type]
      params[:id] = @profile_id
      params[:per_page] = 16
      params[:myfeed] = "Y"
  
      # 찜한 상품, 콜렉션
      #@collections = Collection.itemList(params)
      
      respond_to do |format|
        format.html # myfeed.html.erb
        format.json { render json: @collections }
      end
      
      
#    else
#      redirect_to '/log_in'
#    end
  end

	# 개인정보 설정  
	def setting
		@session_user_id = session[:user_id]||""
		@user = User.new
		if @session_user_id && @session_user_id!=""
			@user = User.find(@session_user_id)
			
			respond_to do |format|
				format.html
			end
			
		else
			redirect_to '/log_in'
		end
	end
	
	# 개인정보 수정
	def editProfile
		@user = User.find(params[:id])

		respond_to do |format|
			if @user.update_attributes(params[:user])
				format.html { redirect_to '/mypage/setting', notice: '개인정보를 수정하였습니다.' }
				format.json { render json: @user, status: :created, location: @user }
			else
				format.html { render action: "setting" }
				format.json { render json: @user.errors, status: :unprocessable_entity }
			end
		end
	end

  
	# 프로필 ajax
	def checkValidCallback
		session_user_id	= session[:user_id]
		stat	= params[:stat]
		val	= params[:val]
		status = true
		
		count_user = User.where("#{stat}='#{val}' AND id!=#{session_user_id}").count
		
		if count_user>0
			status = false
		end
		 
		respond_to do |format|
			format.json { render :json => { status: status }.to_json }
		end
	end

	# 알림  
	def messages
		@session_user_id = session[:user_id]||""
		@message_type = params[:message_type]
		@user = User.new
		
		if @session_user_id && @session_user_id!=""
			@user = User.find(@session_user_id)
			
 
			# 조회 수 가져오기
			cnt_view_product = Product.select("IFNULL(SUM(hit),0) AS hit").from("products").where(user_id: @user.id, use_yn: "Y").first
			cnt_view_collection = Collection.select("IFNULL(SUM(hit),0) AS hit").from("collections").where(user_id: @user.id, use_yn: "Y").first
			@cnt_view = cnt_view_product.hit + cnt_view_collection.hit
			 
			# 좋아요 수 가져오기
			cnt_like_product = Get.select("A.id")
									.from("gets A, products B")
									.where("A.ref_id = B.id AND B.user_id=#{@user.id} AND A.get_type='L'")
									.count
			                       
			cnt_like_collection = Get.select("A.id")
									.from("gets A, collections B")
									.where("A.ref_id = B.id AND B.user_id=#{@user.id} AND A.get_type='L'")
									.count
			
			@cnt_like = cnt_like_product + cnt_like_collection
			 
			# follower 수 가져오기
			@cnt_follower = Follow.select("id").from("follows").where(follow_id: @user.id).count
			 
			# following 수 가져오기
			@cnt_following = Follow.select("id").from("follows").where(user_id: @user.id).count
			 
			# 상품 수 가져오기
			@cnt_product = Product.select("id").from("products").where(user_id: @user.id, use_yn: "Y").count
			
			# 메시지 읽음 처리
			Message.update_all("read_yn='Y'", "user_id=#{@session_user_id} AND read_yn!='Y'")
			
			
			respond_to do |format|
				format.html
			end
			
		else
			redirect_to '/log_in'
		end
	end
  
	# 메시지 list ajax
	def msgListCallback
		session_user_id = session[:user_id]||""
		params[:user_id] = session_user_id
		page = params[:page]||1
		per_page = params[:per_page]||20
		
		if session_user_id && session_user_id!=""
			msgList = Message.msgList(params)
			
			total_count = msgList.count
			page_str = getPagging("goPage",total_count.to_i,page.to_i,per_page.to_i,10)
			
			msgList.each do |message|
				createTime = (Time.zone.now - message.created_at).to_i
				createTimeStr =  (Time.zone.now - message.created_at).to_i / 1.second
				createTimeTail = ""
				
				if createTime<60
					createTimeStr =  ((Time.zone.now - message.created_at).to_i / 1.second).to_s + "초"
				elsif createTime<60*60
					createTimeStr =  ((Time.zone.now - message.created_at).to_i / 1.minute).to_s + "분"
				elsif createTime<60*60*24
					createTimeStr =  ((Time.zone.now - message.created_at).to_i / 1.hour).to_s + "시간"
				elsif createTime<60*60*24*30
					createTimeStr =  ((Time.zone.now - message.created_at).to_i / 1.day).to_s + "일"
				elsif createTime<60*60*24*365
					createTimeStr =  ((Time.zone.now - message.created_at).to_i / 1.month).to_s + "개월"
				elsif createTime>=60*60*24*365
					createTimeStr =  ((Time.zone.now - message.created_at).to_i / 1.year).to_s + "년"
				end
				
				message.created_at_str = createTimeStr
			end
		end
    
		respond_to do |format|
			format.json { render :json => { status: true, messages: msgList, total_count: total_count, page_str: page_str }.to_json }
		end
	end
	
	# 메시지 숫자
	def msgCountCallback
		user_id = params[:user_id]||""
		read_yn	= params[:read_yn]
		
		count_message = 0
		if user_id && user_id!=""
			count_message = Message.where(user_id: user_id, read_yn: read_yn).count
		end
    
		respond_to do |format|
			format.json { render :json => { status: true, count_message: count_message }.to_json }
		end
	end


  
end
