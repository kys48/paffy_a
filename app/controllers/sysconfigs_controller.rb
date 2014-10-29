class SysconfigsController < ApplicationController
  # GET /sysconfigs
  # GET /sysconfigs.json
  def index
    @sysconfigs = Sysconfig.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @sysconfigs }
    end
  end

  # GET /sysconfigs/1
  # GET /sysconfigs/1.json
  def show
    @sysconfig = Sysconfig.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @sysconfig }
    end
  end

  # GET /sysconfigs/new
  # GET /sysconfigs/new.json
  def new
    @sysconfig = Sysconfig.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @sysconfig }
    end
  end

  # GET /sysconfigs/1/edit
  def edit
    @sysconfig = Sysconfig.find(params[:id])
  end

  # POST /sysconfigs
  # POST /sysconfigs.json
  def create
    @sysconfig = Sysconfig.new(params[:sysconfig])

    respond_to do |format|
      if @sysconfig.save
        format.html { redirect_to @sysconfig, notice: 'Sysconfig was successfully created.' }
        format.json { render json: @sysconfig, status: :created, location: @sysconfig }
      else
        format.html { render action: "new" }
        format.json { render json: @sysconfig.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /sysconfigs/1
  # PUT /sysconfigs/1.json
  def update
    @sysconfig = Sysconfig.find(params[:id])

    respond_to do |format|
      if @sysconfig.update_attributes(params[:sysconfig])
        format.html { redirect_to @sysconfig, notice: 'Sysconfig was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @sysconfig.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sysconfigs/1
  # DELETE /sysconfigs/1.json
  def destroy
    @sysconfig = Sysconfig.find(params[:id])
    @sysconfig.destroy

    respond_to do |format|
      format.html { redirect_to sysconfigs_url }
      format.json { head :no_content }
    end
  end
end
