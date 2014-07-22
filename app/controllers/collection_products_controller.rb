class CollectionProductsController < ApplicationController
  # GET /collection_products
  # GET /collection_products.json
  def index
    @collection_products = CollectionProduct.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @collection_products }
    end
  end

  # GET /collection_products/1
  # GET /collection_products/1.json
  def show
    @collection_product = CollectionProduct.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @collection_product }
    end
  end

  # GET /collection_products/new
  # GET /collection_products/new.json
  def new
    @collection_product = CollectionProduct.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @collection_product }
    end
  end

  # GET /collection_products/1/edit
  def edit
    @collection_product = CollectionProduct.find(params[:id])
  end

  # POST /collection_products
  # POST /collection_products.json
  def create
    @collection_product = CollectionProduct.new(params[:collection_product])

    respond_to do |format|
      if @collection_product.save
        format.html { redirect_to @collection_product, notice: 'Collection product was successfully created.' }
        format.json { render json: @collection_product, status: :created, location: @collection_product }
      else
        format.html { render action: "new" }
        format.json { render json: @collection_product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /collection_products/1
  # PUT /collection_products/1.json
  def update
    @collection_product = CollectionProduct.find(params[:id])

    respond_to do |format|
      if @collection_product.update_attributes(params[:collection_product])
        format.html { redirect_to @collection_product, notice: 'Collection product was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @collection_product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /collection_products/1
  # DELETE /collection_products/1.json
  def destroy
    @collection_product = CollectionProduct.find(params[:id])
    @collection_product.destroy

    respond_to do |format|
      format.html { redirect_to collection_products_url }
      format.json { head :no_content }
    end
  end
end
