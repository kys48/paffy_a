#encoding: utf-8

class GetsController < ApplicationController
  
  # 스크랩, 좋아요 처리
  def put
    user_id   = session[:user_id]
    ref_id    = params[:ref_id]
    get_type  = params[:get_type]
    item_type = params[:item_type]
    
    count = Get.where(get_type: get_type, item_type: item_type, ref_id: ref_id, user_id: user_id).count
    status = false
    msg = ''
    like_status = 'Y'

    if get_type == 'S'
      if count>0
          status = false
          msg = '이미 스크랩하였습니다'
      else
        status = true
        @get = Get.new(params[:get])
        @get.ref_id = ref_id
        @get.get_type = get_type
        @get.item_type = item_type
        @get.user_id = user_id
        @get.save!
      end
    
    elsif get_type == 'L'
      status = true
      @get = Get.new(params[:get])
      @get.ref_id = ref_id
      @get.get_type = get_type
      @get.item_type = item_type
      @get.user_id = user_id
      
      if count>0
        Get.where(ref_id: ref_id, get_type: get_type, item_type: item_type, user_id: user_id).destroy_all
        like_status = 'N'
      else
        @get.save!
        like_status = 'Y'
      end
    end
    
    cnt_item = Get.where(get_type: get_type, item_type: item_type, ref_id: ref_id).count
    
    respond_to do |format|
      #format.json { render json: @collection.to_json }
      format.json { render :json => { status: status, msg: msg, cnt_item: cnt_item, like_status: like_status }.to_json }
    end
  end
  
  
  # GET /gets
  # GET /gets.json
  def index
    @gets = Get.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @gets }
    end
  end

  # GET /gets/1
  # GET /gets/1.json
  def show
    @get = Get.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @get }
    end
  end

  # GET /gets/new
  # GET /gets/new.json
  def new
    @get = Get.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @get }
    end
  end

  # GET /gets/1/edit
  def edit
    @get = Get.find(params[:id])
  end

  # POST /gets
  # POST /gets.json
  def create
    @get = Get.new(params[:get])

    respond_to do |format|
      if @get.save
        format.html { redirect_to @get, notice: 'Get was successfully created.' }
        format.json { render json: @get, status: :created, location: @get }
      else
        format.html { render action: "new" }
        format.json { render json: @get.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /gets/1
  # PUT /gets/1.json
  def update
    @get = Get.find(params[:id])

    respond_to do |format|
      if @get.update_attributes(params[:get])
        format.html { redirect_to @get, notice: 'Get was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @get.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /gets/1
  # DELETE /gets/1.json
  def destroy
    @get = Get.find(params[:id])
    @get.destroy

    respond_to do |format|
      format.html { redirect_to gets_url }
      format.json { head :no_content }
    end
  end
end
