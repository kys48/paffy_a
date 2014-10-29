class BoardInfosController < ApplicationController
  # GET /board_infos
  # GET /board_infos.json
  def index
    @board_infos = BoardInfo.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @board_infos }
    end
  end

  # GET /board_infos/1
  # GET /board_infos/1.json
  def show
    @board_info = BoardInfo.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @board_info }
    end
  end

  # GET /board_infos/new
  # GET /board_infos/new.json
  def new
    @board_info = BoardInfo.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @board_info }
    end
  end

  # GET /board_infos/1/edit
  def edit
    @board_info = BoardInfo.find(params[:id])
  end

  # POST /board_infos
  # POST /board_infos.json
  def create
    @board_info = BoardInfo.new(params[:board_info])

    respond_to do |format|
      if @board_info.save
        format.html { redirect_to @board_info, notice: 'Board info was successfully created.' }
        format.json { render json: @board_info, status: :created, location: @board_info }
      else
        format.html { render action: "new" }
        format.json { render json: @board_info.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /board_infos/1
  # PUT /board_infos/1.json
  def update
    @board_info = BoardInfo.find(params[:id])

    respond_to do |format|
      if @board_info.update_attributes(params[:board_info])
        format.html { redirect_to @board_info, notice: 'Board info was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @board_info.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /board_infos/1
  # DELETE /board_infos/1.json
  def destroy
    @board_info = BoardInfo.find(params[:id])
    @board_info.destroy

    respond_to do |format|
      format.html { redirect_to board_infos_url }
      format.json { head :no_content }
    end
  end
end
