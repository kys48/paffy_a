#encoding: utf-8

class MypageController < ApplicationController
  
  def index
    if session[:user_id]
      user_id = session[:user_id]
      @user = User.find(user_id)
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
    
    # 팔로우 여부 가져오기
    @follow_count = Follow.where(user_id: @session_user_id, follow_id: @user.id).count
    
    # 스크랩 수 가져오기
    #@cnt_scrap = Get.where(get_type: 'S', item_type: 'C', ref_id: collection_id).count
    @cnt_scrap = 10
    
    # 포스팅한 상품, 콜렉션
    #@collections = Collection.paginate(page: params[:page], per_page: 16).where(user_id: @user.id).order('created_at DESC')

    # 찜한 상품, 콜렉션
    @collections = Collection.itemList(params)
    
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @collections }
    end
  end
  
  # 프로필 ajax
  def itemListCallback
    profile_id = params[:id]
    page = params[:page]||1
    item_type = params[:type]
    #user = User.where(profile_id: @profile_id).first

    # 찜한 상품, 콜렉션
    @collections = Collection.itemList(params)
    
    respond_to do |format|
      #format.json { render json: @collections.to_json }
      format.json { render :json => { status: true, collections: @collections }.to_json }
    end
  end
  
  # Mypage 
  def myfeed
    if session[:user_id]
      @profile_id = session[:profile_id]
      @item_type = params[:type]
      params[:id] = @profile_id
      params[:per_page] = 16
      params[:order] = "RAND()"
      #params[:order] = " created_at ASC "
      params[:myfeed] = "Y"
  
      # 찜한 상품, 콜렉션
      @collections = Collection.itemList(params)
      
      respond_to do |format|
        format.html # myfeed.html.erb
        format.json { render json: @collections }
      end
      
      
    else
      redirect_to '/log_in'
    end
    

  end
  
  
  
  
  
  private
  
  def domain_name(url)
    domain = url.split(".")
    if domain.count > 2
      domain[1]
    else 
      domain_names = domain[0].split("/")
      if domain_names.count>2
        domain[0].split("/")[2]
      else
        domain[0]
      end    
    end
  end
  
  
end
