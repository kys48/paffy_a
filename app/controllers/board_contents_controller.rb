class BoardContentsController < ApplicationController
  # GET /board_contents
  # GET /board_contents.json
  def index
    @board_contents = BoardContent.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @board_contents }
    end
  end

  # GET /board_contents/1
  # GET /board_contents/1.json
  def show
    @board_content = BoardContent.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @board_content }
    end
  end

  # GET /board_contents/new
  # GET /board_contents/new.json
  def new
    @board_content = BoardContent.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @board_content }
    end
  end

  # GET /board_contents/1/edit
  def edit
    @board_content = BoardContent.find(params[:id])
  end

  # POST /board_contents
  # POST /board_contents.json
  def create
    @board_content = BoardContent.new(params[:board_content])

    respond_to do |format|
      if @board_content.save
        format.html { redirect_to @board_content, notice: 'Board content was successfully created.' }
        format.json { render json: @board_content, status: :created, location: @board_content }
      else
        format.html { render action: "new" }
        format.json { render json: @board_content.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /board_contents/1
  # PUT /board_contents/1.json
  def update
    @board_content = BoardContent.find(params[:id])

    respond_to do |format|
      if @board_content.update_attributes(params[:board_content])
        format.html { redirect_to @board_content, notice: 'Board content was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @board_content.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /board_contents/1
  # DELETE /board_contents/1.json
  def destroy
    @board_content = BoardContent.find(params[:id])
    @board_content.destroy

    respond_to do |format|
      format.html { redirect_to board_contents_url }
      format.json { head :no_content }
    end
  end
end
