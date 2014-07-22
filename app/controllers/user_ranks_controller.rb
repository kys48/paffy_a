class UserRanksController < ApplicationController
  # GET /user_ranks
  # GET /user_ranks.json
  def index
    @user_ranks = UserRank.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @user_ranks }
    end
  end

  # GET /user_ranks/1
  # GET /user_ranks/1.json
  def show
    @user_rank = UserRank.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user_rank }
    end
  end

  # GET /user_ranks/new
  # GET /user_ranks/new.json
  def new
    @user_rank = UserRank.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user_rank }
    end
  end

  # GET /user_ranks/1/edit
  def edit
    @user_rank = UserRank.find(params[:id])
  end

  # POST /user_ranks
  # POST /user_ranks.json
  def create
    @user_rank = UserRank.new(params[:user_rank])

    respond_to do |format|
      if @user_rank.save
        format.html { redirect_to @user_rank, notice: 'User rank was successfully created.' }
        format.json { render json: @user_rank, status: :created, location: @user_rank }
      else
        format.html { render action: "new" }
        format.json { render json: @user_rank.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /user_ranks/1
  # PUT /user_ranks/1.json
  def update
    @user_rank = UserRank.find(params[:id])

    respond_to do |format|
      if @user_rank.update_attributes(params[:user_rank])
        format.html { redirect_to @user_rank, notice: 'User rank was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @user_rank.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_ranks/1
  # DELETE /user_ranks/1.json
  def destroy
    @user_rank = UserRank.find(params[:id])
    @user_rank.destroy

    respond_to do |format|
      format.html { redirect_to user_ranks_url }
      format.json { head :no_content }
    end
  end
end
