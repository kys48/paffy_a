#encoding: utf-8

class WishesController < ApplicationController
  
  # 찜하기
  def put
    user_id   = session[:user_id]
    ref_id    = params[:ref_id]
    item_type = params[:item_type]
    subject   = params[:subject]
    contents  = params[:contents]


    count = Wish.where(item_type: item_type, ref_id: ref_id, user_id: user_id).count

    status = false
    msg = ''
    item_type_str = '상품'
    if item_type == 'C'
      item_type_str = '콜렉션'
    end

    if count>0
        status = false
        msg = '이미 찜한 '+item_type_str+' 입니다'
    else
      status = true
      @wish = Wish.new
      @wish.user_id = user_id
      @wish.ref_id = ref_id.to_i
      @wish.item_type = item_type
      @wish.subject = subject
      @wish.contents = contents
      @wish.save!
      msg = item_type_str+'을 찜했습니다'
    end

    cnt_item = Wish.where(item_type: item_type, ref_id: ref_id).count
    
    respond_to do |format|
      #format.json { render json: @collection.to_json }
      format.json { render :json => { status: status, msg: msg, cnt_item: cnt_item }.to_json }
    end
  end
  
  
  # GET /wishes
  # GET /wishes.json
  def index
    @wishes = Wish.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @wishes }
    end
  end

  # GET /wishes/1
  # GET /wishes/1.json
  def show
    @wish = Wish.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @wish }
    end
  end

  # GET /wishes/new
  # GET /wishes/new.json
  def new
    @wish = Wish.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @wish }
    end
  end

  # GET /wishes/1/edit
  def edit
    @wish = Wish.find(params[:id])
  end

  # POST /wishes
  # POST /wishes.json
  def create
    @wish = Wish.new(params[:wish])

    respond_to do |format|
      if @wish.save
        format.html { redirect_to @wish, notice: 'Wish was successfully created.' }
        format.json { render json: @wish, status: :created, location: @wish }
      else
        format.html { render action: "new" }
        format.json { render json: @wish.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /wishes/1
  # PUT /wishes/1.json
  def update
    @wish = Wish.find(params[:id])

    respond_to do |format|
      if @wish.update_attributes(params[:wish])
        format.html { redirect_to @wish, notice: 'Wish was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @wish.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /wishes/1
  # DELETE /wishes/1.json
  def destroy
    @wish = Wish.find(params[:id])
    @wish.destroy

    respond_to do |format|
      format.html { redirect_to wishes_url }
      format.json { head :no_content }
    end
  end
end
