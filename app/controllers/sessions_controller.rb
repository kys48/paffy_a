#encoding: utf-8

class SessionsController < ApplicationController
  layout 'lite'
  
  def login
    if session[:user_id]
      redirect_to root_url
    end
  end
  
  def login_pop
    if session[:user_id]
      redirect_to root_url
    end
  end

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
  
  

end