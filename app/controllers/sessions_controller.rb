#encoding: utf-8

class SessionsController < ApplicationController
  layout 'lite'
  
  # 로그인
  def login
    if session[:user_id]
      redirect_to root_url
    end
  end
  
  # 로그인(팝업)
  def login_pop
    @backurl = params[:backurl]
    @target = params[:target]
    
    if session[:user_id]
      #redirect_to root_url
      render "createpop"
    end
  end

  # facebook 로그인
  def fcreate
    user = User.from_omniauth(env["omniauth.auth"])
    session[:user_id] = user.id
    session[:provider] = user.provider
    session[:profile_id] = user.profile_id
    #redirect_to root_url
    respond_to do |format|
      format.html # fcreate.html.erb
    end
  end
  
  # 카카오 로그인
  def kcreate
    user = User.from_kakaoauth(params)

    session[:user_id] = user.id
    session[:provider] = user.provider
    session[:profile_id] = user.profile_id
    
    respond_to do |format|
      #format.json { render json: @collection.to_json }
      format.json { render :json => { status: true }.to_json }
    end
  end
  
  def create
    user = User.authenticate(params[:email], params[:password])
    @backurl = params[:backurl]
    @target = params[:target]
    
    if user
      session[:user_id] = user.id
      session[:provider] = user.provider
      session[:profile_id] = user.profile_id
      redirect_to root_url, :notice => "로그인!"
    else
      flash.now.alert = "이메일주소 또는 비밀번호가 맞지 않아요"
      render "login"
    end
  end
  
  def createpop
    user = User.authenticate(params[:email], params[:password])
    @backurl = params[:backurl]
    @target = params[:target]
    
    if user
      session[:user_id] = user.id
      session[:provider] = user.provider
      session[:profile_id] = user.profile_id
      render "createpop"
    else
      flash.now.alert = "이메일주소 또는 비밀번호가 맞지 않아요"
      render "login_pop"
    end
  end
  
  def destroy
    session[:user_id] = nil
    redirect_to root_url, :notice => "로그아웃!"
  end
  
  # 회원가입
  def sign_up
    @user = User.new
    @backurl = params[:backurl]
    @target = params[:target]
    
    respond_to do |format|
      format.html # sign_up.html.erb
    end
  end
  
  # 회원가입 완료
  def sign_up_complete
    @user = User.new(params[:user])
    @user.user_type = "U"
    @user.use_yn = "R"  # 대기
    
    @backurl = params[:backurl]
    @target = params[:target]
    
    respond_to do |format|
      if @user.save
        session[:user_id] = @user.id
        session[:provider] = @user.provider
        session[:profile_id] = @user.profile_id
        
        format.html # sign_up.html.erb
      else
        format.html { render action: "sign_up" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

end