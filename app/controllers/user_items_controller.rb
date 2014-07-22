class UserItemsController < ApplicationController
  # GET /user_items
  # GET /user_items.json
  def index
    @user_items = UserItem.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @user_items }
    end
  end

  # GET /user_items/1
  # GET /user_items/1.json
  def show
    @user_item = UserItem.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user_item }
    end
  end

  # GET /user_items/new
  # GET /user_items/new.json
  def new
    @user_item = UserItem.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user_item }
    end
  end

  # GET /user_items/1/edit
  def edit
    @user_item = UserItem.find(params[:id])
  end

  # POST /user_items
  # POST /user_items.json
  def create
    @user_item = UserItem.new(params[:user_item])

    respond_to do |format|
      if @user_item.save
        format.html { redirect_to @user_item, notice: 'User item was successfully created.' }
        format.json { render json: @user_item, status: :created, location: @user_item }
      else
        format.html { render action: "new" }
        format.json { render json: @user_item.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /user_items/1
  # PUT /user_items/1.json
  def update
    @user_item = UserItem.find(params[:id])

    respond_to do |format|
      if @user_item.update_attributes(params[:user_item])
        format.html { redirect_to @user_item, notice: 'User item was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @user_item.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_items/1
  # DELETE /user_items/1.json
  def destroy
    @user_item = UserItem.find(params[:id])
    @user_item.destroy

    respond_to do |format|
      format.html { redirect_to user_items_url }
      format.json { head :no_content }
    end
  end
end
